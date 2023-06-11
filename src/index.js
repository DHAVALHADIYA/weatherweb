// here start point of our application

const express = require("express");
const hbs = require("hbs");
const path = require("path");
const app = express();

const port = process.env.PORT || 7000;

const weatherDataAPI = require("../utils/weatherData");
const weatherDataApi = require("../utils/weatherData");

const errorpage = path.join(__dirname, "../templates/views/error.hbs");

// here this var is tell to express that this folder contain static data or file which is render autometically....
const publicStaticDirPath = path.join(__dirname, "../public");
app.use(express.static(publicStaticDirPath));

const viewsPath = path.join(__dirname, "../templates/views");

const partialsPath = path.join(__dirname, "../templates/partials");

// to give infor to express app that the template engine is hbs
app.set("view engine", "hbs");
// here views folder is render into view
app.set("views", viewsPath);

// using handlebars we give a partials path
hbs.registerPartials(partialsPath);

app.get("/", (req, res) => {
  // dont need to write .hbs bcz we already give a express app  a path of view dir
  res.render("index", {
    title: "Weather : Show Globle Weather",
  });
});

// here this endpoint is used for call api and fetch data from api here
app.get("/weather", (req, res) => {
  const address = req.query.address;

  if (!address) {
    return res.send({
      error: "Enter City In Search Bar",
    });
  }

  weatherDataApi(
    address,
    (
      error,
      { temperature, description, cityName, country, sunrise, sunset } = {}
    ) => {
      if (error) {
        return res.send({
          error,
        });
      }
      console.log(temperature, description, cityName, country, sunrise, sunset);
      res.send({
        temperature,
        description,
        cityName,
        country,
        sunrise,
        sunset,
      });
    }
  );
});

app.get("*", (req, res) => {
  res.render(errorpage);
});

app.listen(port, () => {
  console.log(`Server Listening On Port http://localhost:${port}`);
});
