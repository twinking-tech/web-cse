// script.js
function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;
    document.getElementById('time-display').textContent = timeString;
}

// Update the time every second
setInterval(updateTime, 1000);

// Initial call to display time immediately when the page loads
updateTime();

const apiKey = '1bc7b38ac06cc70190aaa7aa77ae445f'; // Replace with your OpenWeatherMap API key

document.getElementById('search-button').addEventListener('click', () => {
  const city = document.getElementById('city-input').value;
  if (city) {
    getWeather(city);
    getForecast(city); // Call forecast function here
  }
});

async function getWeather(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (data.cod === 200) {
      displayWeather(data);
    } else {
      alert('City not found');
    }
  } catch (error) {
    console.error("Error fetching the weather data:", error);
  }
}

function displayWeather(data) {
  const weatherDisplay = document.getElementById('weather-display');
  const { name } = data;
  const { temp, humidity } = data.main;
  const { speed } = data.wind;
  const { description } = data.weather[0];

  weatherDisplay.innerHTML = `
    <div class="card">
      <div class="card-body">
        <h2 class="card-title">${name}</h2>
        <p class="card-text">Temperature: ${temp} °C</p>
        <p class="card-text">Humidity: ${humidity}%</p>
        <p class="card-text">Wind Speed: ${speed} m/s</p>
        <p class="card-text">Condition: ${description}</p>
      </div>
    </div>
  `;
}

async function getForecast(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    displayForecast(data);
  } catch (error) {
    console.error("Error fetching the forecast data:", error);
  }
}

function displayForecast(data) {
  const forecastDisplay = document.getElementById('weather-display');
  
  // Clear previous forecast data before adding new data
  forecastDisplay.innerHTML += `<h3 class="mt-4">5-Day Forecast</h3>`;
  
  const forecastHtml = data.list
    .filter((_, index) => index % 8 === 0) // Select one forecast per day
    .map(item => {
      const date = new Date(item.dt_txt).toLocaleDateString();
      const { temp } = item.main;
      const { description } = item.weather[0];
      return `
        <div class="card mt-2">
          <div class="card-body">
            <h5 class="card-title">${date}</h5>
            <p class="card-text">Temperature: ${temp} °C</p>
            <p class="card-text">Condition: ${description}</p>
          </div>
        </div>
      `;
    })
    .join('');
    
  forecastDisplay.innerHTML += forecastHtml;
}
