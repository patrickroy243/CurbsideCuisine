namespace CurbsideAPI.DTOs
{
    public class MenuItemCreateDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string? Category { get; set; }
        public bool IsAvailable { get; set; } = true;
    }

    public class MenuItemUpdateDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string? Category { get; set; } 
        public bool IsAvailable { get; set; } = true;
    }

    public class MenuItemResponseDto
    {
        public int MenuItemId { get; set; }
        public int FoodTruckId { get; set; }
        public string FoodTruckName { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string? Category { get; set; } 
        public bool IsAvailable { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}