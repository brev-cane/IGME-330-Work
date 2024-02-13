// randomElement function used to return random words from a passed in array
export const randomElement = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}