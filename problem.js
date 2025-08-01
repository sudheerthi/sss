const data = {
    "keys": {
        "n": 4,
        "k": 3
    },
    "1": {
        "base": "10",
        "value": "4"
    },
    "2": {
        "base": "2",
        "value": "111"
    },
    "3": {
        "base": "10",
        "value": "12"
    },
    "6": {
        "base": "4",
        "value": "213"
    }
};

// You can change this prime to something larger as needed
const PRIME = BigInt(251);

// Convert base string to BigInt
function parseBase(value, base) {
    return BigInt(parseInt(value, parseInt(base)));
}

// Modular inverse using Fermat’s little theorem
function modInverse(a, p) {
    return modPow(a, p - 2n, p);
}

// Modular exponentiation
function modPow(base, exp, mod) {
    base = base % mod;
    let result = 1n;
    while (exp > 0n) {
        if (exp % 2n === 1n) result = (result * base) % mod;
        base = (base * base) % mod;
        exp = exp / 2n;
    }
    return result;
}

// Lagrange interpolation at x = 0
function lagrangeInterpolation(shares, prime) {
    let secret = 0n;
    const k = shares.length;

    for (let i = 0; i < k; i++) {
        let xi = BigInt(shares[i].x);
        let yi = shares[i].y;
        let numerator = 1n;
        let denominator = 1n;

        for (let j = 0; j < k; j++) {
            if (i !== j) {
                let xj = BigInt(shares[j].x);
                numerator = (numerator * (-xj + prime)) % prime;
                denominator = (denominator * (xi - xj + prime)) % prime;
            }
        }

        const invDenominator = modInverse(denominator, prime);
        const term = (yi * numerator * invDenominator) % prime;
        secret = (secret + term) % prime;
    }

    return secret;
}

// Prepare (x, y) pairs from JSON
let shares = [];
for (let key in data) {
    if (key === "keys") continue;
    const x = parseInt(key);
    const base = data[key].base;
    const yStr = data[key].value;
    const y = parseBase(yStr, base);
    shares.push({ x, y });
}

// Only use first k shares
const k = data.keys.k;
const selectedShares = shares.slice(0, k);

// Compute constant c using Lagrange Interpolation
const c = lagrangeInterpolation(selectedShares, PRIME);

console.log("The constant c (secret) is:", c.toString());
