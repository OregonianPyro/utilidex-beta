module.exports = () => {
    const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    const random_num = () => {
        return Math.floor(Math.random() * 9) + 1;
    };
    const random_letter = () => {
        return alphabet[Math.floor(Math.random() * alphabet.length)];
    };
    const l1 = random_letter();
    const l2 = random_letter();
    const l3 = random_letter();
    const l4 = random_letter();
    const n1 = random_num();
    const n2 = random_num();
    const n3 = random_num();
    return n1 + l1 + l2 + n2 + l3 + n3 + n3;
};