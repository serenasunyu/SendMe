namespace SendMeApi.DTOs
{
    public class MessageDto
    {
        public string Id { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public string Content { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public List<FileDto> Files { get; set; } = new List<FileDto>();
    }
}