using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CurbsideAPI.Migrations
{
    /// <inheritdoc />
    public partial class RemoveUniqueReviewConstraint : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Reviews_FoodTruckId_UserId",
                table: "Reviews");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_FoodTruckId",
                table: "Reviews",
                column: "FoodTruckId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Reviews_FoodTruckId",
                table: "Reviews");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_FoodTruckId_UserId",
                table: "Reviews",
                columns: new[] { "FoodTruckId", "UserId" },
                unique: true);
        }
    }
}
