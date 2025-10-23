using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CurbsideAPI.Models
{
    public class Review
    {
        public int ReviewId { get; set; }
        
        public int FoodTruckId { get; set; }
        public int UserId { get; set; }
        
        [Range(1, 5)]
        public int Rating { get; set; }
        
        [MaxLength(1000)]
        public string? Comment { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        
        public FoodTruck FoodTruck { get; set; } = null!;
        public User User { get; set; } = null!;
    }
}