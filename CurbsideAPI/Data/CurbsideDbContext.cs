using Microsoft.EntityFrameworkCore;
using CurbsideAPI.Models;

namespace CurbsideAPI.Data
{
    public class CurbsideDbContext : DbContext
    {
        public CurbsideDbContext(DbContextOptions<CurbsideDbContext> options) : base(options)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.ConfigureWarnings(warnings =>
                warnings.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning));
        }

        public DbSet<User> Users { get; set; }
        public DbSet<FoodTruck> FoodTrucks { get; set; }
        public DbSet<MenuItem> MenuItems { get; set; }
        public DbSet<Review> Reviews { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.UserId);
                entity.HasIndex(u => u.Email).IsUnique();
                entity.HasIndex(u => u.UserName).IsUnique();
            });

            modelBuilder.Entity<FoodTruck>(entity =>
            {
                entity.HasKey(f => f.FoodTruckId);
                entity.HasOne(f => f.Owner)
                    .WithMany(u => u.OwnedFoodTrucks)
                    .HasForeignKey(f => f.OwnerId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<MenuItem>(entity =>
            {
                entity.HasKey(m => m.MenuItemId);
                entity.HasOne(m => m.FoodTruck)
                    .WithMany(f => f.MenuItems)
                    .HasForeignKey(m => m.FoodTruckId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Review>(entity =>
            {
                entity.HasKey(r => r.ReviewId);
                
                entity.HasOne(r => r.User)
                    .WithMany(u => u.Reviews)
                    .HasForeignKey(r => r.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(r => r.FoodTruck)
                    .WithMany(f => f.Reviews)
                    .HasForeignKey(r => r.FoodTruckId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(r => new { r.FoodTruckId, r.UserId }).IsUnique();
            });

            modelBuilder.Entity<User>()
                .HasMany(u => u.FavoriteFoodTrucks)
                .WithMany(f => f.FavoredByUsers)
                .UsingEntity(j => j.ToTable("UserFavorites"));
        }
    }
}