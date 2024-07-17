namespace SendMeApi.Models
{
    public class File
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Name { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public string MessageId { get; set; } = string.Empty;
        public Message? Message { get; set; }
    }
}