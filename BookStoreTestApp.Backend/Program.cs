using BookStoreTestApp.Backend.Services;
using BookStoreTestApp.Backend.Utils;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddSingleton<SeedManager>();
builder.Services.AddSingleton<RandomGeneratorFactory>();
builder.Services.AddScoped<IBookGeneratorService, BookGeneratorService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins(
                "http://localhost:3000",
                "https://bookstore-test-lmnrszjtn-utku-keskins-projects.vercel.app",
                "https://*.vercel.app"
             )
            .AllowAnyMethod()
            .AllowAnyHeader();
        });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();

app.Run();