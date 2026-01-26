//Weather Page Backend which use for fetching Weather from open weather
const express = require("express");
const axios = require("axios");
const router = express.Router();

// LIVE WEATHER
router.get("/current", async(req, res) => {
    try {
        const city = req.query.city || "Ludhiana";
        const apiKey = process.env.WEATHER_API_KEY;

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const { data } = await axios.get(url);

        const temperature = Math.round(data.main.temp);
        const humidity = data.main.humidity;
        const wind = data.wind.speed;
        const condition = data.weather[0].description;

        // ✔ FIXED Optional Chaining — No Error
        const rainChance = data.rain ? 80 : 20;

        // ✔ Risk Score
        const riskScore = Math.min(
            100,
            Math.floor(
                humidity * 0.3 +
                wind * 3 +
                rainChance * 0.6
            )
        );

        let riskLabel = "Low Risk";
        if (riskScore > 70) riskLabel = "High Risk";
        else if (riskScore > 40) riskLabel = "Moderate Risk";

        const advisory =
            riskScore > 70 ?
            "⚠️ Avoid field work. High chances of rainfall or storms." :
            riskScore > 40 ?
            "⚠️ Proceed with caution. Weather is slightly unstable." :
            "✅ Weather is stable for farm operations.";

        res.json({
            city,
            temperature,
            humidity,
            wind,
            condition,
            rainChance,
            riskScore,
            riskLabel,
            advisory,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Weather API error", error: err.message });
    }
});


// 5-DAY FORECAST
router.get("/forecast", async(req, res) => {
    try {
        const city = req.query.city || "Ludhiana";
        const apiKey = process.env.WEATHER_API_KEY;

        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
        const { data } = await axios.get(url);

        const days = data.list.filter((i) => i.dt_txt.includes("12:00:00"));

        res.json(days);
    } catch (err) {
        res.status(500).json({ msg: "Forecast API error", error: err.message });
    }
});

module.exports = router;
