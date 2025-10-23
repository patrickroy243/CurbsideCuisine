using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CurbsideAPI.DTOs;
using CurbsideAPI.Services;
using CurbsideAPI.Interfaces;
using System.Security.Claims;

namespace CurbsideAPI.Controllers
{
    [Authorize(Roles = "admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("users")]
        public async Task<ActionResult<PaginatedResponse<UserResponseDto>>> GetAllUsers(
            [FromQuery] int pageNumber = 1, 
            [FromQuery] int pageSize = 10)
        {
            var result = await _adminService.GetAllUsersAsync(pageNumber, pageSize);
            return Ok(result);
        }

        [HttpGet("users/{id}")]
        public async Task<ActionResult<ApiResponse<UserResponseDto>>> GetUserById(int id)
        {
            var result = await _adminService.GetUserByIdAsync(id);
            return Ok(result);
        }

        [HttpPost("users/{id}/role")]
        public async Task<ActionResult<ApiResponse<bool>>> ChangeUserRole(int id, [FromBody] ChangeRoleDto roleDto)
        {
            var result = await _adminService.ChangeUserRoleAsync(id, roleDto.Role);
            return Ok(result);
        }

        [HttpPost("users/{id}/status")]
        public async Task<ActionResult<ApiResponse<bool>>> UpdateUserStatus(int id, [FromBody] UpdateUserStatusDto statusDto)
        {
            var result = await _adminService.UpdateUserStatusAsync(id, statusDto.IsActive);
            return Ok(result);
        }

        [HttpDelete("users/{id}")]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteUser(int id)
        {
            var result = await _adminService.DeleteUserAsync(id);
            return Ok(result);
        }

        [HttpGet("foodtrucks")]
        public async Task<ActionResult<PaginatedResponse<FoodTruckResponseDto>>> GetAllFoodTrucks(
            [FromQuery] int pageNumber = 1, 
            [FromQuery] int pageSize = 10)
        {
            var result = await _adminService.GetAllFoodTrucksAsync(pageNumber, pageSize);
            return Ok(result);
        }

        [HttpPost("foodtrucks/{id}/verify")]
        public async Task<ActionResult<ApiResponse<bool>>> VerifyFoodTruck(int id)
        {
            var result = await _adminService.VerifyFoodTruckAsync(id);
            return Ok(result);
        }

        [HttpPost("foodtrucks/{id}/suspend")]
        public async Task<ActionResult<ApiResponse<bool>>> SuspendFoodTruck(int id)
        {
            var result = await _adminService.SuspendFoodTruckAsync(id);
            return Ok(result);
        }

        [HttpDelete("foodtrucks/{id}")]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteFoodTruck(int id)
        {
            var result = await _adminService.DeleteFoodTruckAsync(id);
            return Ok(result);
        }

        [HttpGet("reviews")]
        public async Task<ActionResult<PaginatedResponse<ReviewResponseDto>>> GetAllReviews(
            [FromQuery] int pageNumber = 1, 
            [FromQuery] int pageSize = 10)
        {
            var result = await _adminService.GetAllReviewsAsync(pageNumber, pageSize);
            return Ok(result);
        }

        [HttpDelete("reviews/{id}")]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteReview(int id)
        {
            var result = await _adminService.DeleteReviewAsync(id);
            return Ok(result);
        }

        [HttpGet("statistics")]
        public async Task<ActionResult<ApiResponse<AdminStatisticsDto>>> GetStatistics()
        {
            var result = await _adminService.GetStatisticsAsync();
            return Ok(result);
        }

        [HttpGet("analytics/users")]
        public async Task<ActionResult<ApiResponse<UserAnalyticsDto>>> GetUserAnalytics()
        {
            var result = await _adminService.GetUserAnalyticsAsync();
            return Ok(result);
        }

        [HttpGet("analytics/foodtrucks")]
        public async Task<ActionResult<ApiResponse<FoodTruckAnalyticsDto>>> GetFoodTruckAnalytics()
        {
            var result = await _adminService.GetFoodTruckAnalyticsAsync();
            return Ok(result);
        }

        [HttpGet("logs")]
        public async Task<ActionResult<PaginatedResponse<AdminLogDto>>> GetSystemLogs(
            [FromQuery] int pageNumber = 1, 
            [FromQuery] int pageSize = 50,
            [FromQuery] string? level = null,
            [FromQuery] DateTime? from = null,
            [FromQuery] DateTime? to = null)
        {
            var result = await _adminService.GetSystemLogsAsync(pageNumber, pageSize, level, from, to);
            return Ok(result);
        }
    }

    public class ChangeRoleDto
    {
        public string Role { get; set; } = null!;
    }

    public class UpdateUserStatusDto
    {
        public bool IsActive { get; set; }
    }
}