namespace BookStoreTestApp.Backend.Utils;

public static class FractionalValueHelper
{
    public static int GetActualCount(double averageValue, Random random)
    {
        if (averageValue < 0)
            return 0;

        int baseValue = (int)Math.Floor(averageValue);
        double fractionalPart = averageValue - baseValue;
        
        return random.NextDouble() < fractionalPart ? baseValue + 1 : baseValue;
    }
}