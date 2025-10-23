using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CurbsideAPI.Models
{
    public class FoodTruck
    {
        public int FoodTruckId { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = null!;
        
        [MaxLength(1000)]
        public string? Description { get; set; }
        
        [MaxLength(100)]
        public string? Cuisine { get; set; }
        
        [MaxLength(20)]
        public string? Phone { get; set; }
        
        [MaxLength(500)]
        public string? Website { get; set; }
        
        [MaxLength(1000)]
        public string? ImageUrl { get; set; }
        
        public int OwnerId { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public bool IsActive { get; set; } = true;
        public bool IsOpen { get; set; } = false;
        public double AverageRating { get; set; } = 0;
        public int TotalReviews { get; set; } = 0;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastLocationUpdate { get; set; }

        
        public User Owner { get; set; } = null!;
        public ICollection<MenuItem> MenuItems { get; set; } = new List<MenuItem>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
        public ICollection<User> FavoredByUsers { get; set; } = new List<User>();
    }
}