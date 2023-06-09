// utils folder contain data which is reused in another function  //// all reusedable function here

const request = require("request");
const URL = require("../URL");

// encodeURIComponent is build in function which is validate that text string is valid or not
// call back function return data
const weatherDataApi = (address, callback) => {
  // here url is create for call it
  const url =
    URL.openWeatherMap.BASE_URL +
    encodeURIComponent(address) +
    "&appid=" +
    URL.openWeatherMap.SECRET_KEY;

  // here for weatherdata url is request
  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Cannot fetch data from openweathermap api ", undefined);
    } else if (
      !body.main ||
      !body.main.temp ||
      !body.name ||
      !body.weather ||
      !body.sys.country ||
      !body.sys.sunrise ||
      !body.sys.sunset
    ) {
      callback("City Is Not Found , Try Another One Again", undefined);
    } else {
      callback(undefined, {
        temperature: body.main.temp,
        description: body.weather[0].description,
        cityName: body.name,
        country: body.sys.country,
        sunrise: body.sys.sunrise,
        sunset: body.sys.sunset,
      });
    }
  });
};

module.exports = weatherDataApi;
