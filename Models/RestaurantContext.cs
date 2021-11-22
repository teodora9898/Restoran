using Microsoft.EntityFrameworkCore;

namespace Restoran.Models
{
    public class RestoranContext : DbContext
    {
       public DbSet<Restaurant> Restaurants { get; set; }
       public DbSet<Table> Tables { get; set; }
       public DbSet<Waiter> Waiters { get; set; } 
       public RestoranContext(DbContextOptions options) : base(options)
        {
            
        }  
    }
}