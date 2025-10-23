using AutoMapper;
using CurbsideAPI.DTOs;
using CurbsideAPI.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CurbsideAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MenuItemController : ControllerBase
{
    private readonly IMenuItemService _menuItemService;
    private readonly IMapper _mapper;

    public MenuItemController(IMenuItemService menuItemService, IMapper mapper)
    {
        _menuItemService = menuItemService;
        _mapper = mapper;
    }

    [HttpGet("foodtruck/{foodTruckId}")]
    public async Task<ActionResult<ApiResponse<List<MenuItemResponseDto>>>> GetMenuItemsByFoodTruck(int foodTruckId)
    {
        try
        {
            var result = await _menuItemService.GetAllAsync(foodTruckId);
            
            var response = new ApiResponse<List<MenuItemResponseDto>>
            {
                Success = true,
                Data = result,
                Message = "Menu items retrieved successfully"
            };
            
            return Ok(response);
        }
        catch (Exception ex)
        {
            var errorResponse = new ApiResponse<List<MenuItemResponseDto>>
            {
                Success = false,
                Message = "Error retrieving menu items: " + ex.Message
            };
            
            return BadRequest(errorResponse);
        }
    }

    [HttpPost("foodtruck/{foodTruckId}")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<MenuItemResponseDto>>> CreateMenuItem(int foodTruckId, MenuItemCreateDto createMenuItemDto)
    {
        var result = await _menuItemService.CreateAsync(foodTruckId, createMenuItemDto);
        
        if (!result.Success)
        {
            return BadRequest(result);
        }
        
        return CreatedAtAction(nameof(GetMenuItemsByFoodTruck), new { foodTruckId = foodTruckId }, result);
    }

    [HttpPut("foodtruck/{foodTruckId}/{id}")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<MenuItemResponseDto>>> UpdateMenuItem(int foodTruckId, int id, MenuItemUpdateDto updateMenuItemDto)
    {
        var result = await _menuItemService.UpdateAsync(foodTruckId, id, updateMenuItemDto);
        
        if (!result.Success)
        {
            return BadRequest(result);
        }
        
        return Ok(result);
    }

    [HttpDelete("foodtruck/{foodTruckId}/{id}")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteMenuItem(int foodTruckId, int id)
    {
        var result = await _menuItemService.DeleteAsync(foodTruckId, id);
        
        if (!result.Success)
        {
            return BadRequest(result);
        }
        
        return Ok(result);
    }
}