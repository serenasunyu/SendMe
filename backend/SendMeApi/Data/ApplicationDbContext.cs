using Microsoft.EntityFrameworkCore;
using SendMeApi.Models;

namespace SendMeApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Message> Messages { get; set; }
        public DbSet<Models.File> Files { get; set; }
    }
}