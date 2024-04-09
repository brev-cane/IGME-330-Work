const apiKeyWeather = '8cdd27c1df6a53f687ebf1e1fbd45b0b';

const countryInput = document.querySelector('#countryInput');
const resultContainer = document.querySelector('#weatherResult');
const toggleUnitsButton = document.querySelector('#toggleUnits');
const viewHomeButton = document.querySelector('#viewHome');
const sortSelect = document.querySelector('#sort');

// Some constants that I'll need such as buttons and my results container

// I've been trying to add a loading gif but I can't seem to implement it right, as my page loads so fast ->
// -> the gif never appears, and then it only appears when the search bar is either empty (after -> 
// -> already typing something in) or if what is in the search bar doesn't return any countries

//I'll leave these loading gif comments here but I came up with a simple solution where I just add the gif to the weather info for each country-card so until
//the info is updated the loading gif will appear.

//const loadingContainer = document.querySelector('#loadingContainer');

let useMetricUnits = true;
// a use metric units parameter that will be able to help me switch between metric and imperial units.

// An event listener that gets information from my countries API and then passes that data into my displayCountryResults function
countryInput.addEventListener('input', function () {
    const inputValue = this.value;

    resultContainer.innerHTML = '';

    fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(inputValue)}`)
        .then(response => response.json())
        .then(countryData => {
            displayCountryResults(countryData);
        })
        .catch(error => {
            console.error('Error fetching country data:', error);
        });
});

// When a user clicks the toggleUnitsButton useMetricUnits will become false and the weather info will be refreshed using the new unit
toggleUnitsButton.addEventListener('click', function () {
    useMetricUnits = !useMetricUnits;
    refreshWeatherInformation();
});

// When a user clicks the home country button a function will run that displays their home country
viewHomeButton.addEventListener('click', function() {
    displayHomeCountry();
})

// When the dropdown is changed I want to refresh the page to display the same countries from Z-A instead of A-Z and vice cersa
sortSelect.addEventListener('change', function () {
    const inputValue = countryInput.value;

    resultContainer.innerHTML = '';

    fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(inputValue)}`)
        .then(response => response.json())
        .then(countryData => {
            displayCountryResults(countryData);
        })
        .catch(error => {
            console.error('Error fetching country data:', error);
        });
});


// This function sorts countries based on the first letter in the country's name
function sortCountries(countryData) {
    const sort = sortSelect.value;

    // I used the internet to help me figure out how to get the sorting function to work properly
    switch (sort) {
        case 'asc':
            countryData.sort((a, b) => a.name.common.localeCompare(b.name.common));
            break;
        case 'desc':
            countryData.sort((a, b) => b.name.common.localeCompare(a.name.common));
            break;
        default:
            break;
    }

    return countryData;
}

// This function checks how the countries are supposed to be sorted and then adds country cards to my resultsContainer accordingly
function displayCountryResults(countryData) {
    //loadingContainer.style.display = "block";
    countryData = sortCountries(countryData);

    countryData.forEach(country => {
        const countryCard = document.createElement('div');
        countryCard.className = 'country-card';

        const countryName = country.name.common;
        const countryFlag = country.flags.png;

        countryCard.innerHTML = `
            <h2>${countryName}</h2>
            <img src="${countryFlag}" alt="${countryName} Flag" class="flag">
            <div class="weatherInfo"><img id="loadingIMG" src="images/loading-earth.gif" alt="spinning globe gif"></div>
            <button id="selectHome">Set as home</button>
        `;
        const homeButton = countryCard.querySelector("#selectHome");
        homeButton.addEventListener("click", function() {
            storeHomeCountry(countryName, countryFlag);
        });
        resultContainer.appendChild(countryCard);
    });
    //loadingContainer.style.display = "none";
    refreshWeatherInformation();
}


// This function is used to store a countries name and flag
function storeHomeCountry(countryName, countryFlag) {
    localStorage.setItem("homeCountry", countryName);
    localStorage.setItem("homeCountryFlag", countryFlag);
}

// This function is used to retrive weather information for country cards, it also displays in different units of measurement depending on useMetricUnits
function refreshWeatherInformation() {
    document.querySelectorAll('.country-card').forEach(countryCard => {
        const countryName = countryCard.querySelector('h2').textContent;
        const weatherInfoContainer = countryCard.querySelector('.weatherInfo');

        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(countryName)}&units=${useMetricUnits ? 'metric' : 'imperial'}&appid=${apiKeyWeather}`)
            .then(response => response.json())
            .then(weatherData => {
                if (weatherData.cod === '404') {
                    // I used ChatGPT to help me figure out what to do when there was no information for certain countries
                    weatherInfoContainer.innerHTML = '<p class="error-message">Weather information not available.</p>';
                    console.warn(`No weather information available for ${countryName}`);
                } else {
                    const temperature = weatherData.main.temp;
                    const unitLabel = useMetricUnits ? '°C' : '°F';

                    weatherInfoContainer.innerHTML = `
                        <p class="weatherInfo">Temperature: ${temperature} ${unitLabel}</p>
                        <p class="weatherInfo">Description: ${weatherData.weather[0].description}</p>
                    `;
                }
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                weatherInfoContainer.innerHTML = '<p class="error-message">No weather information for this country.</p>';
            });
    });
    //loadingContainer.style.display = "none";
}

// This function clears the resultsContainer and then displays your selected home country
function displayHomeCountry() {
    const homeCountry = localStorage.getItem("homeCountry");
    const homeCountryFlag = localStorage.getItem("homeCountryFlag");
    console.log("Stored Home Country:", homeCountry);

    if (homeCountry) {
        resultContainer.innerHTML = '';
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(homeCountry)}&units=${useMetricUnits ? 'metric' : 'imperial'}&appid=${apiKeyWeather}`)
            .then(response => response.json())
            .then(weatherData => {
                const countryCard = document.createElement('div');
                countryCard.className = 'country-card';

                const countryFlag = homeCountryFlag;

                countryCard.innerHTML = `
                    <h2>${homeCountry}</h2>
                    <img src="${homeCountryFlag}" alt="${homeCountry} Flag" class="flag">
                    <div class="weatherInfo"></div>
                `;

                resultContainer.appendChild(countryCard);

                const weatherInfoContainer = countryCard.querySelector('.weatherInfo');
                
                if (weatherData.cod === '404') {
                    weatherInfoContainer.innerHTML = '<p class="error-message">Weather information not available.</p>';
                    console.warn(`No weather information available for ${homeCountry}`);
                } else {
                    const temperature = weatherData.main.temp;
                    const unitLabel = useMetricUnits ? '°C' : '°F';

                    weatherInfoContainer.innerHTML = `
                        <p class="weatherInfo">Temperature: ${temperature} ${unitLabel}</p>
                        <p class="weatherInfo">Description: ${weatherData.weather[0].description}</p>
                    `;
                }
            })
    } else {
        alert("Home country not set. Set a home country first.");
    }
}

