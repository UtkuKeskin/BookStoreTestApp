namespace BookStoreTestApp.Backend.Models;

public class Book
{
    public int AbsoluteIndex { get; set; }
    public string ISBN { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public List<string> Authors { get; set; } = new();
    public string Publisher { get; set; } = string.Empty;
    public int Likes { get; set; }
    public List<Review> Reviews { get; set; } = new();
}