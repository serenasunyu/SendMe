using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SendMeApi.Data;
using SendMeApi.DTOs;
using SendMeApi.Models;
using SendMeApi.Services;
using SendMeApi.Exceptions; 
using Microsoft.AspNetCore.Cors;
using System.IO;


namespace SendMeApi.Controllers
{
    [EnableCors("AllowReactApp")]
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly FileService _fileService;

        private readonly IWebHostEnvironment _webHostEnvironment;

        public MessagesController(ApplicationDbContext context, FileService fileService, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _fileService = fileService;
            _webHostEnvironment = webHostEnvironment;
        }

        // GET: api/Messages
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessages()
        {
            var messages = await _context.Messages
                .Include(m => m.Files)
                .OrderByDescending(m => m.Timestamp)
                .ToListAsync();

            return messages.Select(m => new MessageDto
            {
                Id = m.Id,
                Timestamp = m.Timestamp,
                Content = m.Content,
                Type = m.Type,
                Files = m.Files.Select(f => new FileDto
                {
                    Id = f.Id,
                    Name = f.Name,
                    Url = f.Url
                }).ToList()
            }).ToList();
        }

        // GET: api/Messages/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MessageDto>> GetMessage(string id)
        {
            var message = await _context.Messages
                .Include(m => m.Files)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (message == null)
            {
                return NotFound();
            }

            return new MessageDto
            {
                Id = message.Id,
                Timestamp = message.Timestamp,
                Content = message.Content,
                Type = message.Type,
                Files = message.Files.Select(f => new FileDto
                {
                    Id = f.Id,
                    Name = f.Name,
                    Url = f.Url
                }).ToList()
            };
        }

        // POST: api/Messages
        [HttpPost]
        public async Task<ActionResult<MessageDto>> PostMessage([FromForm] string? content, [FromForm] List<IFormFile> files)
        {
            if (string.IsNullOrWhiteSpace(content) && !files.Any())
            {
                throw new BadRequestException("A message must contain either text or at least one image.");
            }

            var message = new Message
            {
                Id = Guid.NewGuid().ToString(),
                Timestamp = DateTime.UtcNow,
                Content = content ?? "",
                Type = DetermineMessageType(content, files),
                Files = new List<Models.File>()
            };

            if (files.Any())
            {
                foreach (var file in files)
                {
                    var fileUrl = await _fileService.SaveFile(file);
                    message.Files.Add(new Models.File
                    {
                        Id = Guid.NewGuid().ToString(),
                        Name = file.FileName,
                        Url = fileUrl,
                        MessageId = message.Id
                    });
                }
            }

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            var messageDto = new MessageDto
            {
                Id = message.Id,
                Timestamp = message.Timestamp,
                Content = message.Content,
                Type = message.Type,
                Files = message.Files?.Select(f => new FileDto
                {
                    Id = f.Id,
                    Name = f.Name,
                    Url = f.Url
                }).ToList() ?? new List<FileDto>()
            };

            return CreatedAtAction(nameof(GetMessage), new { id = message.Id }, messageDto);
        }

        private string DetermineMessageType(string? content, List<IFormFile> files)
        {
            if (!string.IsNullOrWhiteSpace(content) && files.Any())
            {
                return "mixed";
            }
            else if (!string.IsNullOrWhiteSpace(content))
            {
                return "text";
            }
            else if (files.Any())
            {
                return "image";
            }
            else
            {
                throw new BadRequestException("A message must contain either text or at least one image.");
            }
        }

        // DELETE: api/Messages/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMessage(string id)
        {
            var message = await _context.Messages.FindAsync(id);
            if (message == null)
            {
                return NotFound();
            }

            _context.Messages.Remove(message);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("download/{fileId}")]
        public async Task<IActionResult> DownloadFile(string fileId)
        {
            var file = await _context.Files.FirstOrDefaultAsync(f => f.Id == fileId);
            if (file == null)
            {
                return NotFound();
            }

            // Remove the leading slash if it exists
            var fileName = file.Url.TrimStart('/');
            var filePath = Path.Combine(_webHostEnvironment.WebRootPath, fileName);

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound();
            }

            var memory = new MemoryStream();
            using (var stream = new FileStream(filePath, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;

            return File(memory, GetContentType(filePath), file.Name);
        }

        private string GetContentType(string path)
        {
            var types = GetMimeTypes();
            var ext = Path.GetExtension(path).ToLowerInvariant();
            return types.ContainsKey(ext) ? types[ext] : "application/octet-stream";
        }

        private Dictionary<string, string> GetMimeTypes()
        {
            return new Dictionary<string, string>
            {
                {".txt", "text/plain"},
                {".pdf", "application/pdf"},
                {".doc", "application/vnd.ms-word"},
                {".docx", "application/vnd.ms-word"},
                {".xls", "application/vnd.ms-excel"},
                {".xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"},
                {".png", "image/png"},
                {".jpg", "image/jpeg"},
                {".jpeg", "image/jpeg"},
                {".gif", "image/gif"},
                {".csv", "text/csv"}
            };
        }
    }
}