using Microsoft.AspNetCore.Mvc;
using BookStoreTestApp.Backend.DTOs;
using BookStoreTestApp.Backend.Models;
using BookStoreTestApp.Backend.Services;
using CsvHelper;
using System.Globalization;
using System.Text;

namespace BookStoreTestApp.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly IBookGeneratorService _bookGenerator;
    private readonly ILogger<BooksController> _logger;

    public BooksController(IBookGeneratorService bookGenerator, ILogger<BooksController> logger)
    {
        _bookGenerator = bookGenerator;
        _logger = logger;
    }

    [HttpGet]
    public ActionResult<List<Book>> GetBooks([FromQuery] GenerationParameters parameters)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (parameters.Count > 50)
            {
                return BadRequest(new { error = "Count cannot exceed 50" });
            }

            var books = _bookGenerator.GenerateBooks(parameters);
            
            _logger.LogInformation($"Generated {books.Count} books for locale {parameters.Locale}, seed {parameters.Seed}");
            
            return Ok(books);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating books");
            return StatusCode(500, new { error = "An error occurred while generating books" });
        }
    }

    [HttpGet("export")]
    public IActionResult ExportCsv([FromQuery] GenerationParameters parameters)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var books = _bookGenerator.GenerateBooks(parameters);
            
            using var memoryStream = new MemoryStream();
            using var writer = new StreamWriter(memoryStream, Encoding.UTF8);
            using var csv = new CsvWriter(writer, CultureInfo.InvariantCulture);
            
            csv.WriteRecords(books.Select(b => new
            {
                Index = b.AbsoluteIndex,
                ISBN = b.ISBN,
                Title = b.Title,
                Authors = string.Join("; ", b.Authors),
                Publisher = b.Publisher,
                Likes = b.Likes,
                ReviewCount = b.Reviews.Count,
                Reviews = string.Join(" | ", b.Reviews.Select(r => $"{r.Author}: {r.Text}"))
            }));
            
            writer.Flush();
            var result = memoryStream.ToArray();
            
            return File(result, "text/csv", $"books_{parameters.Locale}_{parameters.Seed}.csv");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error exporting books to CSV");
            return StatusCode(500, new { error = "An error occurred while exporting books" });
        }
    }
}