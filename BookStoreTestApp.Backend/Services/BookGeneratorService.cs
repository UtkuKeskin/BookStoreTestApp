using Bogus;
using BookStoreTestApp.Backend.DTOs;
using BookStoreTestApp.Backend.Models;
using BookStoreTestApp.Backend.Utils;

namespace BookStoreTestApp.Backend.Services;

public class BookGeneratorService : IBookGeneratorService
{
    private readonly RandomGeneratorFactory _randomFactory;

    public BookGeneratorService(RandomGeneratorFactory randomFactory)
    {
        _randomFactory = randomFactory;
    }

    public List<Book> GenerateBooks(GenerationParameters parameters)
    {
        var books = new List<Book>();

        for (int i = 0; i < parameters.Count; i++)
        {
            int recordIndex = parameters.Start + i;
            int absoluteIndex = recordIndex + 1;

            var bookRandomizer = _randomFactory.GetBookRandomizer(parameters.Seed, recordIndex);
            var faker = GetFakerForLocale(parameters.Locale, bookRandomizer);

            var likeRandom = _randomFactory.GetLikeRandomizer(parameters.Seed, recordIndex);
            int likeCount = FractionalValueHelper.GetActualCount(parameters.AverageLikes, likeRandom);

            var reviewRandom = _randomFactory.GetReviewRandomizer(parameters.Seed, recordIndex);
            int reviewCount = FractionalValueHelper.GetActualCount(parameters.AverageReviews, reviewRandom);

            var book = GenerateBook(absoluteIndex, faker, likeCount, reviewCount, parameters.Locale, reviewRandom);
            books.Add(book);
        }

        return books;
    }

    private Faker GetFakerForLocale(string locale, Randomizer randomizer)
    {
        return locale switch
        {
            "de-DE" => new Faker("de") { Random = randomizer },
            "ja-JP" => new Faker("ja") { Random = randomizer },
            _ => new Faker("en") { Random = randomizer }
        };
    }

    private Book GenerateBook(int index, Faker faker, int likes, int reviewCount, string locale, Random reviewRandom)
    {
        var book = new Book
        {
            AbsoluteIndex = index,
            ISBN = GenerateISBN(faker),
            Title = GenerateTitle(faker, locale),
            Authors = GenerateAuthors(faker, locale),
            Publisher = GeneratePublisher(faker, locale),
            Likes = likes,
            Reviews = GenerateReviews(faker, reviewCount, locale)
        };

        return book;
    }

    private string GenerateISBN(Faker faker)
    {
        // ISBN-13 format: 978-X-XX-XXXXXX-X
        var group = faker.Random.Int(0, 9);
        var publisher = faker.Random.Int(10, 99);
        var title = faker.Random.Int(100000, 999999);
        var checkDigit = faker.Random.Int(0, 9);
        
        return $"978-{group}-{publisher}-{title}-{checkDigit}";
    }

    private string GenerateTitle(Faker faker, string locale)
    {
        return locale switch
        {
            "de-DE" => GenerateGermanTitle(faker),
            "ja-JP" => GenerateJapaneseTitle(faker),
            _ => GenerateEnglishTitle(faker)
        };
    }

    private string GenerateEnglishTitle(Faker faker)
    {
        var patterns = new[]
        {
            () => $"The {faker.Lorem.Word().ToTitle()} {faker.Lorem.Word().ToTitle()}",
            () => $"{faker.Lorem.Word().ToTitle()} of {faker.Lorem.Word().ToTitle()}",
            () => $"A {faker.Lorem.Word().ToTitle()} in {faker.Address.City()}",
            () => $"{faker.Person.FirstName}'s {faker.Lorem.Word().ToTitle()}",
            () => $"The {faker.Commerce.Color()} {faker.Lorem.Word().ToTitle()}",
            () => $"{faker.Lorem.Word().ToTitle()} and {faker.Lorem.Word().ToTitle()}",
            () => $"Beyond the {faker.Lorem.Word().ToTitle()}",
            () => $"{faker.Random.Int(2, 100)} {faker.Lorem.Word().ToTitle()}s",
            () => $"The Last {faker.Lorem.Word().ToTitle()}",
            () => $"{faker.Lorem.Word().ToTitle()}: A Novel"
        };

        return faker.PickRandom(patterns).Invoke();
    }

    private string GenerateGermanTitle(Faker faker)
    {
        var patterns = new[]
        {
            () => $"Der {faker.Lorem.Word()} {faker.Lorem.Word()}",
            () => $"Die {faker.Lorem.Word()} von {faker.Address.City()}",
            () => $"Das {faker.Lorem.Word()} {faker.Lorem.Word()}",
            () => $"{faker.Lorem.Word()} und {faker.Lorem.Word()}",
            () => $"Eine {faker.Lorem.Word()} Geschichte",
            () => $"Im {faker.Lorem.Word()} der {faker.Lorem.Word()}"
        };

        return faker.PickRandom(patterns).Invoke();
    }

    private string GenerateJapaneseTitle(Faker faker)
    {
        var patterns = new[]
        {
            () => $"{faker.Lorem.Word()}の{faker.Lorem.Word()}",
            () => $"{faker.Lorem.Word()}と{faker.Lorem.Word()}",
            () => $"{faker.Lorem.Word()}物語",
            () => $"{faker.Address.City()}の{faker.Lorem.Word()}",
            () => $"{faker.Lorem.Word()}について"
        };

        return faker.PickRandom(patterns).Invoke();
    }

    private List<string> GenerateAuthors(Faker faker, string locale)
    {
        var authorCount = faker.Random.Int(1, 3);
        var authors = new List<string>();

        for (int i = 0; i < authorCount; i++)
        {
            authors.Add(locale switch
            {
                "de-DE" => $"{faker.Name.FirstName()} {faker.Name.LastName()}",
                "ja-JP" => $"{faker.Name.LastName()} {faker.Name.FirstName()}",
                _ => $"{faker.Name.FirstName()} {faker.Name.LastName()}"
            });
        }

        return authors;
    }

    private string GeneratePublisher(Faker faker, string locale)
    {
        var publisherPatterns = locale switch
        {
            "de-DE" => new[] { "Verlag", "Bücher", "Presse", "Edition" },
            "ja-JP" => new[] { "出版", "書房", "堂", "社" },
            _ => new[] { "Press", "Publishing", "Books", "House", "Publications" }
        };

        var prefix = faker.Company.CompanyName();
        var suffix = faker.PickRandom(publisherPatterns);
        
        return locale == "ja-JP" ? $"{prefix}{suffix}" : $"{prefix} {suffix}";
    }

    private List<Review> GenerateReviews(Faker faker, int count, string locale)
    {
        var reviews = new List<Review>();

        for (int i = 0; i < count; i++)
        {
            reviews.Add(new Review
            {
                Text = GenerateReviewText(faker, locale),
                Author = GenerateReviewAuthor(faker, locale)
            });
        }

        return reviews;
    }

    private string GenerateReviewText(Faker faker, string locale)
    {
        return locale switch
        {
            "de-DE" => faker.Lorem.Sentence(faker.Random.Int(10, 20)),
            "ja-JP" => faker.Lorem.Sentence(faker.Random.Int(15, 25)),
            _ => faker.Lorem.Sentence(faker.Random.Int(10, 20))
        };
    }

    private string GenerateReviewAuthor(Faker faker, string locale)
    {
        return locale switch
        {
            "de-DE" => $"{faker.Name.FirstName()} {faker.Name.LastName()[0]}.".Trim(),
            "ja-JP" => $"{faker.Name.LastName()} {faker.Name.FirstName()[0]}.".Trim(),
            _ => $"{faker.Name.FirstName()} {faker.Name.LastName()[0]}.".Trim()
        };
    }
}

public static class StringExtensions
{
    public static string ToTitle(this string input)
    {
        if (string.IsNullOrEmpty(input))
            return input;
        
        return char.ToUpper(input[0]) + input.Substring(1).ToLower();
    }
}