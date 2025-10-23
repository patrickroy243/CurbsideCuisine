using System.Collections.Generic;
using CurbsideAPI.DTOs;

namespace CurbsideAPI.DTOs
{
    public class FoodTruckCreateDto
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public string? Cuisine { get; set; }
        public string? Phone { get; set; }
        public string? Website { get; set; }
        public string? ImageUrl { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }

    public class FoodTruckUpdateDto
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Cuisine { get; set; }
        public string? Phone { get; set; }
        public string? Website { get; set; }
        public string? ImageUrl { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsOpen { get; set; }
    }

    public class FoodTruckResponseDto
    {
        public int FoodTruckId { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public string? Cuisine { get; set; }
        public string? Phone { get; set; }
        public string? Website { get; set; }
        public string? ImageUrl { get; set; }
        public int OwnerId { get; set; }
        public string? OwnerName { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public bool IsActive { get; set; }
        public bool IsOpen { get; set; }
        public double AverageRating { get; set; }
        public int TotalReviews { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<MenuItemResponseDto> MenuItems { get; set; } = new();
    }

    public class NearbyFoodTruckDto
    {
        public int FoodTruckId { get; set; }
        public string Name { get; set; } = null!;
        public string? Cuisine { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public double Distance { get; set; }
        public bool IsOpen { get; set; }
        public double AverageRating { get; set; }
    }
}