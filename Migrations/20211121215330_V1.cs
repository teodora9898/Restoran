using Microsoft.EntityFrameworkCore.Migrations;

namespace Restoran.Migrations
{
    public partial class V1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Restaurants",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Address = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Restaurants", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Waiter",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    LastName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    JMBG = table.Column<string>(type: "nvarchar(13)", maxLength: 13, nullable: true),
                    Experience = table.Column<int>(type: "int", nullable: false),
                    RestaurantID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Waiter", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Waiter_Restaurants_RestaurantID",
                        column: x => x.RestaurantID,
                        principalTable: "Restaurants",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Tables",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Number = table.Column<int>(type: "int", nullable: false),
                    NumberOfSeats = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    WaiterId = table.Column<int>(type: "int", nullable: true),
                    RestaurantID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tables", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Tables_Restaurants_RestaurantID",
                        column: x => x.RestaurantID,
                        principalTable: "Restaurants",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Tables_Waiter_WaiterId",
                        column: x => x.WaiterId,
                        principalTable: "Waiter",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Tables_RestaurantID",
                table: "Tables",
                column: "RestaurantID");

            migrationBuilder.CreateIndex(
                name: "IX_Tables_WaiterId",
                table: "Tables",
                column: "WaiterId");

            migrationBuilder.CreateIndex(
                name: "IX_Waiter_RestaurantID",
                table: "Waiter",
                column: "RestaurantID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Tables");

            migrationBuilder.DropTable(
                name: "Waiter");

            migrationBuilder.DropTable(
                name: "Restaurants");
        }
    }
}
