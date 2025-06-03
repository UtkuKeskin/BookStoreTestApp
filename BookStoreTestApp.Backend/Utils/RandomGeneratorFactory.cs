using Bogus;

namespace BookStoreTestApp.Backend.Utils;

public class RandomGeneratorFactory
{
    private readonly SeedManager _seedManager;

    public RandomGeneratorFactory(SeedManager seedManager)
    {
        _seedManager = seedManager;
    }

       public Randomizer GetBookRandomizer(int userSeed, int recordNumber)
    {
        var seed = _seedManager.GetBookSeed(userSeed, recordNumber);
        return new Randomizer(seed);
    }

        public Random GetLikeRandomizer(int userSeed, int recordNumber)
    {
        var seed = _seedManager.GetLikeSeed(userSeed, recordNumber);
        return new Random(seed);
    }

        public Random GetReviewRandomizer(int userSeed, int recordNumber)
    {
        var seed = _seedManager.GetReviewSeed(userSeed, recordNumber);
        return new Random(seed);
    }
}