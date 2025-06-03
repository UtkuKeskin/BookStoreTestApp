using BookStoreTestApp.Backend.DTOs;
using BookStoreTestApp.Backend.Models;

namespace BookStoreTestApp.Backend.Services;

public interface IBookGeneratorService
{
    List<Book> GenerateBooks(GenerationParameters parameters);
}