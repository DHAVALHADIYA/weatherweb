const requests = require("requests");
const fs = require("fs");
const express = require("express");
const app = express();

const port = 8000;

const weatherfile = fs.readFileSync("weather.html", "utf-8");
const errorfile = fs.readFileSync("errorpage.html", "utf-8");

const replaceval = (tempval, realval) => {
  let temp = tempval.replace("{%city%}", realval.name);
  temp = temp.replace("{%temp%}", Math.round(realval.main.temp - 273.15));
  temp = temp.replace("{%cloud%}", realval.weather[0].description);
  temp = temp.replace("{%con%}", realval.sys.country);
  temp = temp.replace("{%high%}", Math.round(realval.main.temp_max - 273.15));
  temp = temp.replace("{%min%}", Math.round(realval.main.temp_min - 273.15));
  temp = temp.replace("{%wind%}", realval.wind.speed);
  temp = temp.replace("{%rise%}", realval.sys.sunrise);
  temp = temp.replace("{%set%}", realval.sys.sunset);
  temp = temp.replace("{%humidity%}", realval.main.humidity);
  temp = temp.replace("{%img%}", realval.weather[0].icon);
  return temp;
};

app.get("/", (req, res) => {
  requests(
    `https://api.openweathermap.org/data/2.5/weather?q=pune&appid=79d90526ee53e519cf00e9b7158e389b`
  )
    .on("data", function (chunk) {
      let objdata = JSON.parse(chunk);
      let arrdata = [objdata];

      const realdata = arrdata
        .map((val) => replaceval(weatherfile, val))
        .join("");
      res.write(realdata);
    })
    .on("end", function (error) {
      if (error) return console.log("connection is close due to error", error);
      // res.sendFile("index.html");
      res.end();
    });
});

app.get("/search", (req, res) => {
  let city = req.query.search;

  async function weather() {
    let weatherdata = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=79d90526ee53e519cf00e9b7158e389b`
    );
    let oridata = await weatherdata.json();
    return oridata;
  }
  let data = weather();

  data
    .then((weatherofcity) => {
      let arrdata = [weatherofcity];

      const realdata = arrdata
        .map((val) => replaceval(weatherfile, val))
        .join("");
      res.write(realdata);
      res.end();
    })
    .catch(() => {
      res.statusCode = 404;
      res.send(errorfile);
      res.end();
    });
});

app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
