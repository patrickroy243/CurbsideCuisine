using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CurbsideAPI.Models
{
    public class User
    {
        public int UserId { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string UserName { get; set; } = null!;
        
        [Required]
        [MaxLength(255)]
        public string Email { get; set; } = null!;
        
        [Required]
        public string Password { get; set; } = null!;
        
        [MaxLength(20)]
        public string Role { get; set; } = "appuser";
        
        [MaxLength(20)]
        public string? Phone { get; set; }
        
        [MaxLength(255)]
        public string? Location { get; set; }
        
        [MaxLength(500)]
        public string? Bio { get; set; }
        
        public double? CurrentLatitude { get; set; }
        public double? CurrentLongitude { get; set; }
        public int PreferredRadius { get; set; } = 5;
        public DateTime? LastLocationUpdate { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true;

        
        public ICollection<FoodTruck> OwnedFoodTrucks { get; set; } = new List<FoodTruck>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
        public ICollection<FoodTruck> FavoriteFoodTrucks { get; set; } = new List<FoodTruck>();
    }

    public static class UserRoles
    {
        public const string Admin = "admin";
        public const string AppUser = "appuser";
        public const string Vendor = "vendor";
    }
}