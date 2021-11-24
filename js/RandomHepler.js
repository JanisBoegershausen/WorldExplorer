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

function GetRandomWord(length) {
    var word = "";
    var vowelChance = 0.25;
    var charactersSinceLastVowel = 2;
    for (let i = 0; i < length; i++) {
        if(random() <= vowelChance * charactersSinceLastVowel) {
            word += GetRandomVowel();
            charactersSinceLastVowel = 1;
        } else {
            word += GetRandomConstant();
            charactersSinceLastVowel += 1;
        }
    }
    word = word[0].toUpperCase() + word.substr(1);
    return word;
}

function GetRandomLetter() {
    var allLetters = "abcdefghijklmnopqrstuvwxyz";
    return allLetters[Math.floor(random(0, allLetters.length))];
}

function GetRandomConstant() {
    var allConstants = "bcdfghjklmnpqrstvwxyz";
    return allConstants[Math.floor(random(0, allConstants.length))];
}

function GetRandomVowel() {
    var allVowels = "aeiou";
    return allVowels[Math.floor(random(0, allVowels.length))];
}