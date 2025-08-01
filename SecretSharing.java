import java.math.BigInteger;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
import org.json.JSONArray;
import org.json.JSONObject;

public class SecretSharing {

    // Function to perform Lagrange interpolation at x = 0 to find constant term 'c'
    public static BigInteger lagrangeInterpolation(List<Integer> xVals, List<BigInteger> yVals, BigInteger primeMod) {
        BigInteger result = BigInteger.ZERO;

        for (int i = 0; i < xVals.size(); i++) {
            BigInteger xi = BigInteger.valueOf(xVals.get(i));
            BigInteger yi = yVals.get(i);

            BigInteger term = yi;
            for (int j = 0; j < xVals.size(); j++) {
                if (i == j) continue;

                BigInteger xj = BigInteger.valueOf(xVals.get(j));
                BigInteger numerator = xj.negate(); // 0 - xj
                BigInteger denominator = xi.subtract(xj);

                // Calculate modular inverse
                BigInteger inverse = denominator.modInverse(primeMod);
                term = term.multiply(numerator).multiply(inverse).mod(primeMod);
            }

            result = result.add(term).mod(primeMod);
        }

        return result;
    }

    public static void main(String[] args) {
        try {
            // Load JSON file
            String content = new String(Files.readAllBytes(Paths.get("data.json")));
            JSONArray jsonArray = new JSONArray(content);

            // Parse x and y values
            List<Integer> xList = new ArrayList<>();
            List<BigInteger> yList = new ArrayList<>();

            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject point = jsonArray.getJSONObject(i);
                int x = point.getInt("x");
                BigInteger y = new BigInteger(point.getString("y")); // decoded y

                xList.add(x);
                yList.add(y);
            }

            // Prime modulus to work in a finite field (should be > max y)
            BigInteger primeMod = new BigInteger("208351617316091241234326746312124448251235562226470491514186331217050270460481");

            // Validate share count
            if (xList.size() < 5) {
                System.out.println("Not enough shares to reconstruct the secret.");
                return;
            }

            // Compute the constant term 'c' using interpolation
            BigInteger secret = lagrangeInterpolation(xList, yList, primeMod);
            System.out.println("The secret constant term (c) is: " + secret);

        } catch (Exception e) {
            System.out.println("Invalid shares — can't reconstruct.");
            System.out.println("Error: " + e.getMessage());
        }
    }
}