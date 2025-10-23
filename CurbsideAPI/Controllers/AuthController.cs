using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CurbsideAPI.DTOs;
using CurbsideAPI.Interfaces;
using System.Security.Claims;

namespace CurbsideAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<ApiResponse<UserResponseDto>>> Register(UserRegisterDto registerDto)
        {
            var result = await _authService.RegisterAsync(registerDto);
            return CreatedAtAction(nameof(GetProfile), new { }, result);
        }

        [HttpPost("login")]
        public async Task<ActionResult<ApiResponse<UserResponseDto>>> Login(UserLoginDto loginDto)
        {
            var result = await _authService.LoginAsync(loginDto);
            return Ok(result);
        }

        [Authorize]
        [HttpGet("profile")]
        public async Task<ActionResult<ApiResponse<UserResponseDto>>> GetProfile()
        {
            var userId = GetCurrentUserId();
            var result = await _authService.GetUserProfileAsync(userId);
            return Ok(result);
        }

        [Authorize]
        [HttpPut("profile")]
        public async Task<ActionResult<ApiResponse<UserResponseDto>>> UpdateProfile(UserUpdateDto updateDto)
        {
            var userId = GetCurrentUserId();
            var result = await _authService.UpdateUserAsync(userId, updateDto);
            return Ok(result);
        }

        [Authorize]
        [HttpPost("change-password")]
        public async Task<ActionResult<ApiResponse<bool>>> ChangePassword(ChangePasswordDto changePasswordDto)
        {
            var userId = GetCurrentUserId();
            var result = await _authService.ChangePasswordAsync(userId, changePasswordDto.CurrentPassword, changePasswordDto.NewPassword);
            return Ok(result);
        }

        [Authorize]
        [HttpPut("location")]
        public async Task<ActionResult<ApiResponse<bool>>> UpdateLocation(UpdateLocationDto locationDto)
        {
            var userId = GetCurrentUserId();
            var result = await _authService.UpdateUserLocationAsync(userId, locationDto.Latitude, locationDto.Longitude);
            return Ok(result);
        }

        [Authorize]
        [HttpDelete("account")]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteAccount()
        {
            var userId = GetCurrentUserId();
            var result = await _authService.DeleteUserAsync(userId);
            return Ok(result);
        }

        [HttpGet("dashboard-stats")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<DashboardStatsDto>>> GetDashboardStats()
        {
            var result = await _authService.GetDashboardStatsAsync();
            return Ok(result);
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                throw new UnauthorizedAccessException("User not authenticated");
            return userId;
        }
    }

    public class ChangePasswordDto
    {
        public string CurrentPassword { get; set; } = null!;
        public string NewPassword { get; set; } = null!;
    }

    public class UpdateLocationDto
    {
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }
}