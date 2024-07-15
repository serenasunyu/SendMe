using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using SendMeApp.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;

namespace SendMeApp.Controllers
{

    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private static List<Message> Messages = new List<Message>();

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View(Messages);
        }

        [HttpPost]
        public IActionResult Send(string text, IFormFile imageFile)
        {

            string? imageUrl = null;
            if (imageUrl != null && imageFile.Length > 0)
            {

                var filePath = Path.Combine("wwwroot/uploads", imageFile.FileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    imageFile.CopyTo(stream);
                }
                imageUrl = $"/upload/{imageFile.FileName}";
            }

            Messages.Add(new Message
            {

                Date = DateTime.Now,
                Text = text,
                ImageUrl = imageUrl
            });

            return RedirectToAction("Index");
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}