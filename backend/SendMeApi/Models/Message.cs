namespace SendMeApi.Models
{
    public class Message
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public string Content { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public List<File> Files { get; set; } = new List<File>();
    }
}