using CollegeManagement.API.Data;
using Microsoft.EntityFrameworkCore;
using CollegeManagement.API.Models;
using Microsoft.AspNetCore.Identity;

var builder = WebApplication.CreateBuilder(args);

// Add database connection
builder.Services.AddDbContext<CollegeDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactPolicy", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddControllers();

var app = builder.Build();

// Enable CORS
app.UseCors("ReactPolicy");

app.UseHttpsRedirection();

app.MapControllers();

app.Run();