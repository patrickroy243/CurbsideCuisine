namespace CurbsideAPI.DTOs
{
    public class AdminStatisticsDto
    {
        public int TotalUsers { get; set; }
        public int TotalVendors { get; set; }
        public int TotalFoodTrucks { get; set; }
        public int ActiveFoodTrucks { get; set; }
        public int TotalReviews { get; set; }
        public double AverageRating { get; set; }
        public int NewUsersThisMonth { get; set; }
        public int NewFoodTrucksThisMonth { get; set; }
    }

    public class UserAnalyticsDto
    {
        public int TotalUsers { get; set; }
        public int AdminUsers { get; set; }
        public int VendorUsers { get; set; }
        public int RegularUsers { get; set; }
        public List<MonthlyUserCount> MonthlyGrowth { get; set; } = new();
    }

    public class FoodTruckAnalyticsDto
    {
        public int TotalFoodTrucks { get; set; }
        public int ActiveFoodTrucks { get; set; }
        public int InactiveFoodTrucks { get; set; }
        public Dictionary<string, int> FoodTrucksByCuisine { get; set; } = new();
        public List<TopRatedFoodTruck> TopRatedFoodTrucks { get; set; } = new();
    }

    public class MonthlyUserCount
    {
        public string Month { get; set; } = null!;
        public int Count { get; set; }
    }

    public class TopRatedFoodTruck
    {
        public int FoodTruckId { get; set; }
        public string Name { get; set; } = null!;
        public double AverageRating { get; set; }
        public int TotalReviews { get; set; }
    }

    public class AdminLogDto
    {
        public int LogId { get; set; }
        public string Level { get; set; } = null!;
        public string Message { get; set; } = null!;
        public DateTime Timestamp { get; set; }
        public string? UserId { get; set; }
        public string? Action { get; set; }
    }
}