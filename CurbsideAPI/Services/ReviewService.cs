using System.Security.Claims;
using AutoMapper;
using CurbsideAPI.Data;
using CurbsideAPI.DTOs;
using CurbsideAPI.Interfaces;
using CurbsideAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace CurbsideAPI.Services
{
    public class ReviewService : IReviewService
    {
        private readonly CurbsideDbContext _context;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ReviewService(CurbsideDbContext context, IMapper mapper, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<List<ReviewResponseDto>> GetAllAsync(int foodTruckId)
        {
            var reviews = await _context.Reviews
                .Include(r => r.User)
                .Where(r => r.FoodTruckId == foodTruckId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            return _mapper.Map<List<ReviewResponseDto>>(reviews);
        }

        public async Task<ApiResponse<ReviewResponseDto>> CreateAsync(int foodTruckId, ReviewCreateDto createDto)
        {
            var userId = GetCurrentUserId();

            
            var foodTruckExists = await _context.FoodTrucks
                .AnyAsync(f => f.FoodTruckId == foodTruckId);

            if (!foodTruckExists)
                throw new KeyNotFoundException("Food truck not found");

            
            var existingReview = await _context.Reviews
                .FirstOrDefaultAsync(r => r.FoodTruckId == foodTruckId && r.UserId == userId);

            if (existingReview != null)
                throw new ArgumentException("You have already reviewed this food truck");

            
            if (createDto.Rating < 1 || createDto.Rating > 5)
                throw new ArgumentException("Rating must be between 1 and 5");

            var review = new Review
            {
                FoodTruckId = foodTruckId,
                UserId = userId,
                Rating = createDto.Rating,
                Comment = createDto.Comment,
                CreatedAt = DateTime.UtcNow
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            
            await UpdateFoodTruckAverageRating(foodTruckId);

            
            var createdReview = await _context.Reviews
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.ReviewId == review.ReviewId);

            return new ApiResponse<ReviewResponseDto>
            {
                Success = true,
                Data = _mapper.Map<ReviewResponseDto>(createdReview),
                Message = "Review created successfully"
            };
        }

        public async Task<ApiResponse<ReviewResponseDto>> UpdateAsync(int foodTruckId, int id, ReviewUpdateDto updateDto)
        {
            var userId = GetCurrentUserId();
            var userRole = GetCurrentUserRole();

            var review = await _context.Reviews
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.ReviewId == id && r.FoodTruckId == foodTruckId);

            if (review == null)
                throw new KeyNotFoundException("Review not found");

            
            if (review.UserId != userId && userRole != "admin")
                throw new UnauthorizedAccessException("You don't have permission to update this review");

            
            if (updateDto.Rating < 1 || updateDto.Rating > 5)
                throw new ArgumentException("Rating must be between 1 and 5");

            review.Rating = updateDto.Rating;
            review.Comment = updateDto.Comment;

            await _context.SaveChangesAsync();

            
            await UpdateFoodTruckAverageRating(foodTruckId);

            return new ApiResponse<ReviewResponseDto>
            {
                Success = true,
                Data = _mapper.Map<ReviewResponseDto>(review),
                Message = "Review updated successfully"
            };
        }

        public async Task<ApiResponse<bool>> DeleteAsync(int foodTruckId, int id)
        {
            var userId = GetCurrentUserId();
            var userRole = GetCurrentUserRole();

            var review = await _context.Reviews
                .FirstOrDefaultAsync(r => r.ReviewId == id && r.FoodTruckId == foodTruckId);

            if (review == null)
                throw new KeyNotFoundException("Review not found");

            
            if (review.UserId != userId && userRole != "admin")
                throw new UnauthorizedAccessException("You don't have permission to delete this review");

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();

            
            await UpdateFoodTruckAverageRating(foodTruckId);

            return new ApiResponse<bool>
            {
                Success = true,
                Data = true,
                Message = "Review deleted successfully"
            };
        }

        public async Task<ApiResponse<List<ReviewResponseDto>>> GetReviewsByFoodTruckIdAsync(int foodTruckId)
        {
            try
            {
                var reviews = await _context.Reviews
                    .Include(r => r.User)
                    .Include(r => r.FoodTruck)
                    .Where(r => r.FoodTruckId == foodTruckId)
                    .OrderByDescending(r => r.CreatedAt)
                    .ToListAsync();

                var reviewDtos = _mapper.Map<List<ReviewResponseDto>>(reviews);

                return new ApiResponse<List<ReviewResponseDto>>
                {
                    Success = true,
                    Data = reviewDtos,
                    Message = "Reviews retrieved successfully"
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse<List<ReviewResponseDto>>
                {
                    Success = false,
                    Message = "Error retrieving reviews: " + ex.Message
                };
            }
        }

        private async Task UpdateFoodTruckAverageRating(int foodTruckId)
        {
            var reviews = await _context.Reviews
                .Where(r => r.FoodTruckId == foodTruckId)
                .ToListAsync();

            var foodTruck = await _context.FoodTrucks
                .FirstOrDefaultAsync(f => f.FoodTruckId == foodTruckId);

            if (foodTruck != null)
            {
                if (reviews.Any())
                {
                    foodTruck.AverageRating = reviews.Average(r => r.Rating);
                    foodTruck.TotalReviews = reviews.Count;
                }
                else
                {
                    foodTruck.AverageRating = 0;
                    foodTruck.TotalReviews = 0;
                }
                await _context.SaveChangesAsync();
            }
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                throw new UnauthorizedAccessException("User not authenticated");
            return userId;
        }

        private string GetCurrentUserRole()
        {
            return _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.Role)?.Value ?? "appuser";
        }
    }
}