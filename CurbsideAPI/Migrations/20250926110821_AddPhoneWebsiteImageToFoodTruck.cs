using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CurbsideAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddPhoneWebsiteImageToFoodTruck : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "FoodTrucks",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Phone",
                table: "FoodTrucks",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Website",
                table: "FoodTrucks",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "FoodTrucks");

            migrationBuilder.DropColumn(
                name: "Phone",
                table: "FoodTrucks");

            migrationBuilder.DropColumn(
                name: "Website",
                table: "FoodTrucks");
        }
    }
}
