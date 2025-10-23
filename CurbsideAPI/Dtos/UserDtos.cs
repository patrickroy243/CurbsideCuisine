using System;
using System.Collections.Generic;

namespace CurbsideAPI.DTOs
{
    public class UserLoginDto
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }

    public class UserRegisterDto
    {
        public string UserName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Role { get; set; } = "appuser";
        public double? CurrentLatitude { get; set; }
        public double? CurrentLongitude { get; set; }
        public int PreferredRadius { get; set; } = 5;
    }

    public class UserUpdateDto
    {
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Location { get; set; }
        public string? Bio { get; set; }
        public double? CurrentLatitude { get; set; }
        public double? CurrentLongitude { get; set; }
        public int? PreferredRadius { get; set; }
    }

    public class UserResponseDto
    {
        public int UserId { get; set; }
        public string UserName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Role { get; set; } = null!;
        public string? Phone { get; set; }
        public string? Location { get; set; }
        public string? Bio { get; set; }
        public double? CurrentLatitude { get; set; }
        public double? CurrentLongitude { get; set; }
        public int PreferredRadius { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? Token { get; set; }
        public bool IsActive { get; set; }
    }

    public class DashboardStatsDto
    {
        public int FavoriteCount { get; set; }
        public int WrittenReviewsCount { get; set; }
        public int VisitsCount { get; set; }
        public List<FoodTruckResponseDto> RecentFavorites { get; set; } = new List<FoodTruckResponseDto>();
        public List<ReviewResponseDto> RecentReviews { get; set; } = new List<ReviewResponseDto>();
    }
}