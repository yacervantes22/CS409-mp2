export const formatPokemonName = (name: string): string => {
    // Split by hyphens
    const words = name.split('-');
    // Capitalize first letter of each word
    const capitalizedWords = words.map((word) => {
        if (word.length === 0) {
            return word;
        }
        const firstLetter = word.charAt(0).toUpperCase();
        const restOfWord = word.slice(1);
        return firstLetter + restOfWord;
    });
    const formattedName = capitalizedWords.join(' ');
    return formattedName;
};