// this file is responsible to call api

var fetchWeather = "/weather";

const weatherForm = document.querySelector("form");

const weatherIcon = document.querySelector(".weatherIcon i");
const weather_Icon = document.querySelector(".weather-icon");
const weatherCondition = document.querySelector(".weatherCondition");
const weatherLocation = document.getElementById("add");

const tempElement = document.querySelector(".temperature span");

const locationElement = document.querySelector(".place");
const description = document.querySelector(".description");

const dateElement = document.querySelector(".date");
const dayElement = document.querySelector(".day");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// here set a day name
let day = new Date().getDay();
dayElement.textContent = days[day];

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

dateElement.textContent =
  // getdate() gives only date in format
  new Date().getDate() +
  " , " +
  monthNames[new Date().getMonth()].substring(0, 3);

weatherForm.addEventListener("submit", (event) => {
  // to prevent default behavior of form
  event.preventDefault();

  locationElement.textContent = "Loading...";
  tempElement.textContent = "";
  weatherCondition.textContent = "";

  const locationApi = fetchWeather + "?address=" + weatherLocation.value;

  // to clear input value
  weatherLocation.value = "";

  fetch(locationApi).then((response) => {
    response.json().then((data) => {
      if (data.error) {
        description.style.width = "100%";
        locationElement.textContent = data.error;
        tempElement.textContent = "";
        weatherCondition.textContent = "";
        sunrise.textContent = "";
        sunset.textContent = "";
        set.textContent = "";
        rise.textContent = "";
      } else {
        // here changes the icon based on description
        if (data.description === "clear sky") {
          weather_Icon.src = "icons/clear.png";
        } else if (data.description.includes("clouds")) {
          weather_Icon.src = "icons/clouds.png";
        } else if (data.description.includes("rain")) {
          weather_Icon.src = "icons/rain.png";
        } else if (data.description.includes("snow")) {
          weather_Icon.src = "icons/snow.png";
        } else if (
          data.description === "mist" ||
          data.description === "haze" ||
          data.description === "smoke" ||
          data.description === "fog"
        ) {
          weather_Icon.src = "icons/mist.png";
        } else if (data.description.includes("thunderstorm")) {
          weather_Icon.src = "icons/drizzle.png";
        }

        locationElement.textContent = data.cityName + " , " + data.country;
        tempElement.textContent =
          (data.temperature - 273.5).toFixed(2) + String.fromCharCode(176);
        weatherCondition.textContent = data.description.toUpperCase();

        // here we set sunrise and sunset time
        const sunrise = document.getElementById("sunrise");
        const sunset = document.getElementById("sunset");
        const rise = document.getElementById("rise");
        const set = document.getElementById("set");
        rise.textContent = "Sunrise";
        set.textContent = "Sunset";

        let unix1 = data.sunrise;
        let date1 = new Date(unix1 * 1000);
        let hours1 = date1.getHours();
        hours1 = hours1 % 12 || 12;
        let min1 = date1.getMinutes();
        if (min1 < 10) {
          min1 = "0" + min1;
        }
        sunrise.textContent = hours1 + " : " + min1;

        let unix2 = data.sunset;
        let date2 = new Date(unix2 * 1000);
        let hours2 = date2.getHours();
        hours2 = hours2 % 12 || 12;
        let min2 = date2.getMinutes();
        if (min2 < 10) {
          min2 = "0" + min2;
        }
        sunset.textContent = hours2 + " : " + min2;
      }
    });
  });
});
