const fs = require('fs');

// Use a large prime modulus (256-bit prime)
const p = BigInt("79228162514264337593543950343"); // ≈ 10^24

// Read and parse the input JSON file
const rawData = fs.readFileSync('input1.json');
const input = JSON.parse(rawData);

// Parse shares from the input JSON
function parseShares(json) {
    const shares = [];

    for (const key in json) {
        if (key === "keys") continue;

        const x = BigInt(key);
        const base = parseInt(json[key].base);
        const y = BigInt(parseInt(json[key].value, base));

        shares.push({ x, y });
    }

    return shares;
}

// Modular inverse using Extended Euclidean Algorithm
function modInv(a, mod) {
    let m0 = mod, x0 = BigInt(0), x1 = BigInt(1);
    if (mod === BigInt(1)) return BigInt(0);
    while (a > 1) {
        const q = a / mod;
        [a, mod] = [mod, a % mod];
        [x0, x1] = [x1 - q * x0, x0];
    }
    return x1 < 0 ? x1 + m0 : x1;
}

// Lagrange interpolation at x = 0
function reconstructSecret(shares) {
    let secret = BigInt(0);
    const k = shares.length;

    for (let i = 0; i < k; i++) {
        let xi = shares[i].x;
        let yi = shares[i].y;
        let li = BigInt(1);

        for (let j = 0; j < k; j++) {
            if (i !== j) {
                let xj = shares[j].x;
                const numerator = -xj;
                const denominator = xi - xj;
                li = (li * numerator * modInv(denominator, p)) % p;
            }
        }

        secret = (secret + (yi * li)) % p;
    }

    return (secret + p) % p; // Ensure non-negative
}

// Driver code
const shares = parseShares(input);
const secret = reconstructSecret(shares);

// Final secret as string (can be large: 12 to 24+ digits)
const trimmedSecret = secret % BigInt("1" + "0".repeat(24));
console.log("Secret:", trimmedSecret.toString());