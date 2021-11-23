// Get a fully random seed. Mainly based when generating a new universe. 
function GetFullyRandomSeed() {
    return Math.floor(random() * 100000000);
}

// Get a new seed based on the given seed
function GetSeedFromSeed(seed) {
    return Math.floor(SeededRandom(seed) * 100000000);
}

// Get the random number corresponding to a seed in a range from 0 to 1
function SeededRandom(seed) {
    var x = Math.sin(seed) * 100000000;
    return x - Math.floor(x);
}