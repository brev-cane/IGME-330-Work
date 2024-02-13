//"use strict";
import { randomElement } from "./utils.js";

// access the buttons
let button = document.querySelector("#my-button");
let fiveButton = document.querySelector("#five-button");

// initialize the word arrays
let words1 = [];
let words2 = [];
let words3 = [];

// New arrow function for the ultimate version
const generateTechno = (num) => {
    // access the output
    let output = document.querySelector("#output");

    // technobabble that will be concatenated with the words found in the array
    let technobabble = "";

    // for loop used to create a passed in amount of lines of technobabble
    for (let i = 0; i < num; i++) {
        // the random words will be accessed here
        let word1 = randomElement(words1);
        let word2 = randomElement(words2);
        let word3 = randomElement(words3);

        // add the new words to technobabble
        technobabble += `${word1} ${word2} ${word3}<br>`;
    }

    // change the output's innerHTML
    output.innerHTML = technobabble;
};

const babbleLoaded = (data) => {
    // initialize words1, words2, words3 arrays
    words1 = data.words1;
    words2 = data.words2;
    words3 = data.words3;

    // create an event handler for the buttons
    button.addEventListener("click", () => generateTechno(1));
    fiveButton.addEventListener("click", () => generateTechno(5));

    // triggering the function so that the html doesn't display "Loading..."
    button.click();
};

const loadBabble = (callback) => {
    const url = "data/babble-data.json"
    const xhr = new XMLHttpRequest();
    xhr.onload = (e) => {
        console.log(`In onload - HTTP Status Code = ${e.target.status}`);
        babbleLoaded(JSON.parse(xhr.responseText));
    }

    xhr.open("GET", url, true);
    xhr.send();
};

document.addEventListener("DOMContentLoaded", loadBabble);