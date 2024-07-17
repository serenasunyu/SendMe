using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SendMeApi.Data;
using SendMeApi.DTOs;
using SendMeApi.Models;
using SendMeApi.Services;

namespace SendMeApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly FileService _fileService;

        public MessagesController(ApplicationDbContext context, FileService fileService)
        {
            _context = context;
            _fileService = fileService;
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
        public async Task<ActionResult<MessageDto>> PostMessage([FromForm] string content, [FromForm] List<IFormFile> files)
        {
            var message = new Message
            {
                Content = content,
                Type = files.Any() ? "mixed" : "text"
            };

            if (files.Any())
            {
                foreach (var file in files)
                {
                    var fileUrl = await _fileService.SaveFile(file);
                    message.Files.Add(new Models.File
                    {
                        Name = file.FileName,
                        Url = fileUrl
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
                Files = message.Files.Select(f => new FileDto
                {
                    Id = f.Id,
                    Name = f.Name,
                    Url = f.Url
                }).ToList()
            };

            return CreatedAtAction(nameof(GetMessage), new { id = message.Id }, messageDto);
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
    }
}