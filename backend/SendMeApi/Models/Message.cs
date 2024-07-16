using System;

namespace SendMeApi.Models
{
    public class Message
    {
        public int Id { get; set; }
        public DateTime Timestamp { get; set; }
        public string? Content { get; set; }
        public string? Type { get; set; } // "text" or "image"
        public string? ImageUrl { get; set; } // Nullable, for image messages
    }
}