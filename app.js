import express from "express";
import axios from "axios";

const port = 3000;
const app = express();

app.use(express.static("Public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const API_KEY = "bc4f8859729489703f54d6871cff3639";
const DILY_API = `https://api.openweathermap.org/data/2.5/weather?q=Mansehra&appid=${API_KEY}`;

app.get("/", async (req, res) => {
  // Axios try and catch block for error handling
  try {
    const result = await axios.get(DILY_API);

    // Extract weather icon and construct the URL
    const iconCode = result.data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    // Create object with current weather data
    const currentData = {
      Location: result.data.name,
      Temprature: Math.floor(result.data.main.temp - 273.15),
      Icon: iconUrl,
      Desc: result.data.weather[0].description,
      Wind: result.data.wind.speed,
      Gust: result.data.wind.gust,
      Feel: Math.floor(result.data.main.feels_like - 273.15),
    };

    res.render("index.ejs", currentData);
  } catch (error) {
    res.status(501);
  }
});

app.post("/", async (req, res) => {
  const city = req.body["city"];

  if (!city) {
    res.status(404).send("City not provided");
    return;
  }

  try {
    const result = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
    );

    // Extract weather icon and construct the URL
    const iconCode = result.data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    // Create object with current weather data
    const currentData = {
      Location: result.data.name,
      Temprature: Math.floor(result.data.main.temp - 273.15),
      Icon: iconUrl,
      Desc: result.data.weather[0].description,
      Wind: result.data.wind.speed,
      Gust: result.data.wind.gust,
      Feel: Math.floor(result.data.main.feels_like - 273.15),
    };

    res.render("index", currentData);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
