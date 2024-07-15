using System;

namespace SendMeApp.Models 
{
    public class Message
    {
        public DateTime Date {get; set;}
        public string Text { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
    }
}