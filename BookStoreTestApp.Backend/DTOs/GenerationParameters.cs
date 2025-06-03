using System.ComponentModel.DataAnnotations;

namespace BookStoreTestApp.Backend.DTOs;

public class GenerationParameters
{
    [Required]
    public string Locale { get; set; } = "en-US"; // en-US, de-DE, ja-JP
    
    [Required]
    [Range(0, int.MaxValue, ErrorMessage = "Seed must be a positive number")]
    public int Seed { get; set; } = 42;
    
    [Required]
    [Range(0, 10, ErrorMessage = "Average likes must be between 0 and 10")]
    public double AverageLikes { get; set; } = 5;
    
    [Required]
    [Range(0, double.MaxValue, ErrorMessage = "Average reviews must be a positive number")]
    public double AverageReviews { get; set; } = 3;
    
    [Required]
    [Range(0, int.MaxValue, ErrorMessage = "Start must be a positive number")]
    public int Start { get; set; } = 0;
    
    [Required]
    [Range(1, 50, ErrorMessage = "Count must be between 1 and 50")]
    public int Count { get; set; } = 20;
}