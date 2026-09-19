document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;

  // Identify the current page
  console.log(`Current page: ${path}`); // Retained for useful information

  // Home Page Logic
  if (path === '/' || path.endsWith('/index.html')) {
    const cityInput = document.getElementById('cityInput');
    const submitBtn = document.getElementById('submitBtn');

    if (cityInput && submitBtn) {
      // Handle city submission
      submitBtn.addEventListener('click', () => {
        const city = cityInput.value.trim().toLowerCase();
        if (!city) {
          alert('Please enter a city name.');
          return;
        }

        // Fetch weather data from sample.json
        fetch('sample.json')
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to fetch weather data.');
            }
            return response.json();
          })
          .then(data => {
            const weatherData = data.find(
              item => item.cityName.toLowerCase() === city
            );
            if (weatherData) {
              // Save city data to localStorage
              localStorage.setItem('selectedCityData', JSON.stringify(weatherData));
              alert('City data loaded! Navigate to the desired page.');
            } else {
              alert('City not found. Please try a different city.');
            }
          })
          .catch(err => {
            alert('An error occurred while fetching weather data.');
          });
      });
    }
  }

  // Other Pages Logic
  else if (path.endsWith('/temperature.html') || 
           path.endsWith('/humidity.html') || 
           path.endsWith('/uvindex.html') || 
           path.endsWith('/windspeed.html')) {

    // Retrieve weather data from localStorage
    const weatherData = JSON.parse(localStorage.getItem('selectedCityData'));
    if (!weatherData) {
      alert('No weather data found. Please return to the home page and enter a city.');
      return; // Stop further processing
    }

    // Helper function to update icon color
    const updateIconColor = (iconElement, condition, colorClassTrue, colorClassFalse) => {
      if (iconElement) {
        iconElement.classList.remove(colorClassTrue, colorClassFalse);
        iconElement.classList.add(condition ? colorClassTrue : colorClassFalse);
      }
    };

    // Helper function to display weather data
    const displayWeatherData = (elementId, dataValue, fallbackMessage) => {
      const element = document.getElementById(elementId);
      if (element) {
        element.innerText = dataValue || fallbackMessage;
      }
    };

    // Temperature Page Logic
    if (path.endsWith('/temperature.html')) {
      const temperatureElement = document.getElementById('temperatureData');
      const toggleButton = document.getElementById('toggleTempBtn');
      const temperatureIcon = document.querySelector('.icon-container i');

      // Display temperature in Celsius by default
      let isCelsius = true;
      temperatureElement.innerText = `${weatherData.temperatureCelsius}°C`;

      // Update icon color for temperature
      updateIconColor(temperatureIcon, weatherData.temperatureCelsius >= 20, 'icon-yellow', 'icon-blue');

      // Toggle between Celsius and Fahrenheit
      toggleButton.addEventListener('click', () => {
        if (isCelsius) {
          const fahrenheit = (weatherData.temperatureCelsius * 9) / 5 + 32;
          temperatureElement.innerText = `${fahrenheit.toFixed(1)}°F`;
          toggleButton.innerText = 'Switch to Celsius';
        } else {
          temperatureElement.innerText = `${weatherData.temperatureCelsius}°C`;
          toggleButton.innerText = 'Switch to Fahrenheit';
        }
        isCelsius = !isCelsius;
      });
    }

    // Humidity Page Logic
    if (path.endsWith('/humidity.html')) {
      const humidityIcon = document.querySelector('.icon-container i');
      updateIconColor(humidityIcon, weatherData.humidity > 0.7, 'icon-blue', 'icon-green'); 
      displayWeatherData('humidityData', `${(weatherData.humidity * 100).toFixed(1)}%`, 'No data available.');
    }

    // UV Index Page Logic
    if (path.endsWith('/uvindex.html')) {
      const uvIcon = document.querySelector('.icon-container i');
      updateIconColor(uvIcon, weatherData.uvIndex > 5, 'icon-red', 'icon-yellow');
      displayWeatherData('uvData', `UV Index: ${weatherData.uvIndex}`, 'No data available.');
    }

    // Wind Speed Page Logic
    if (path.endsWith('/windspeed.html')) {
      const windIcon = document.querySelector('.icon-container i');
      updateIconColor(windIcon, weatherData.windSpeed > 20, 'icon-red', 'icon-green');
      displayWeatherData('windData', `${weatherData.windSpeed}km/h`, 'No data available.');
    }
  }
});
