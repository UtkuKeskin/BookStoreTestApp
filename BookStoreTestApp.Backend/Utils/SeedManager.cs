namespace BookStoreTestApp.Backend.Utils;
public class SeedManager
{    public int GetBookSeed(int userSeed, int recordIndex)
    {
        return HashCombine(userSeed, recordIndex);
    }
    
    public int GetLikeSeed(int userSeed, int recordIndex)
    {
        return HashCombine(userSeed, recordIndex, "likes");
    }

    public int GetReviewSeed(int userSeed, int recordIndex)
    {
        return HashCombine(userSeed, recordIndex, "reviews");
    }

       private int HashCombine(params object[] values)
    {
        unchecked
        {
            int hash = 17;
            foreach (var value in values)
            {
                hash = hash * 23 + (value?.GetHashCode() ?? 0);
            }
            return Math.Abs(hash);
        }
    }
}