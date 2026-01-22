//Weather Plan For Farming for farmer to see how it is good or not for any location
import React, { useState, useEffect } from "react";
import { CloudRain, Wind, Droplets, Thermometer, AlertTriangle, Calendar } from "lucide-react";
import axios from "axios";

const WeatherPage = () => {
  const [city, setCity] = useState("Ludhiana");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);

  // Fetch current weather on Weather APi
  const loadWeather = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/weather/current?city=${city}`
      );
      setWeather(res.data);
    } catch (err) {
      alert("Failed to fetch weather");
    }
  };

  // Fetch forecast For 5 Days
  const loadForecast = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/weather/forecast?city=${city}`
      );
      setForecast(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = () => {
    loadWeather();
    loadForecast();
  };

  useEffect(() => {
    loadWeather();
    loadForecast();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">🌤️ Weather Intelligence</h1>
          <p className="text-slate-500">Live weather, risks & 5-day forecast.</p>
        </div>

        <div className="flex gap-2">
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="px-4 py-2 border rounded-lg"
            placeholder="Enter city"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Search
          </button>
        </div>
      </div>

      {/* LIVE WEATHER */}
      {weather && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* MAIN WEATHER CARD */}
          <div className="lg:col-span-2 bg-gradient-to-br from-blue-500 to-blue-700 text-white p-8 rounded-3xl shadow-xl">
            <h2 className="text-7xl font-bold">{weather.temperature}°</h2>
            <p className="capitalize text-xl mt-1">{weather.condition}</p>

            <p className="text-sm opacity-80">
              Wind {weather.wind} km/h • Humidity {weather.humidity}%
            </p>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white/20 p-4 rounded-xl">
                <p className="text-xs opacity-80">Rain Chance</p>
                <p className="text-2xl font-bold">{weather.rainChance}%</p>
              </div>

              <div className="bg-white/20 p-4 rounded-xl">
                <p className="text-xs opacity-80">Feels Like</p>
                <p className="text-2xl font-bold">{weather.temperature + 2}°</p>
              </div>
            </div>
          </div>

          {/* RISK METER */}
          <div className="bg-white p-6 rounded-3xl border shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="text-orange-500" /> Risk Meter
            </h3>

            {/* BAR */}
            <div className="relative w-full h-4 rounded-full overflow-hidden flex mb-4">
              <div className="w-1/3 bg-green-500"></div>
              <div className="w-1/3 bg-yellow-500"></div>
              <div className="w-1/3 bg-red-500"></div>

              {/* POINTER */}
              <div
                className="absolute -top-2 transition-all duration-500"
                style={{ left: `${weather.riskScore}%` }}
              >
                <div className="w-0 h-0 border-l-8 border-r-8 border-l-transparent border-r-transparent border-b-8 border-b-black"></div>
              </div>
            </div>

            <p className="text-lg font-bold text-slate-800">
              {weather.riskLabel} ({weather.riskScore}%)
            </p>
            <p className="text-slate-600 mt-1">{weather.advisory}</p>
          </div>

        </div>
      )}

      {/* FORECAST SECTION */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Calendar size={22} className="text-blue-600" /> 5-Day Forecast
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {forecast.map((d, i) => (
            <div key={i} className="bg-slate-50 p-4 rounded-xl border">
              <p className="text-slate-600 font-semibold">
                {d.dt_txt.split(" ")[0]}
              </p>
              <p className="text-2xl font-bold mt-2">{Math.round(d.main.temp)}°</p>
              <p className="text-sm text-slate-500 capitalize">
                {d.weather[0].description}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default WeatherPage;
