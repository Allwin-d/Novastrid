import { useEffect, useState } from "react";
import API_KEY from "./api";

type Weather = {
  id: number;
  main: string;
  description: string;
  icon: string;
};

type WeatherResponse = {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Weather[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  rain?: {
    "1h"?: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
};

const WeatherDetails = () => {
  const [data, setData] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const [city, setCity] = useState(""); // ✅ city to be searched

  useEffect(() => {
    const fetchData = async () => {
      if (city.trim() === "") return;

      try {
        setLoading(true);
        setError(false);
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
        );
        if (!response.ok) throw new Error("Failed to fetch");
        const rawdata: WeatherResponse = await response.json();
        setData(rawdata);
      } catch (err) {
        setError(true);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [city]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
  }

  function handleSubmit() {
    if (query.trim() !== "") {
      setCity(query); // ✅ only sets the city to trigger fetch
      setQuery("");
    }
  }

  if (loading) return <h2>Loading......</h2>;
  if (error) return <h2>Failed To Fetch Details ......</h2>;

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="w-3/4 min-h-[400px] bg-cyan-200 border-2 border-solid rounded-lg p-4 space-y-6">
        <div className="flex justify-center">
          <h1 className="font-bold text-2xl text-black">
            Search your City here....!!!!
          </h1>
        </div>
        <div className="flex flex-row justify-center space-x-4 mt-4">
          <input
            type="text"
            className="p-4 font-bold ring-2 ring-black"
            onChange={handleChange}
            value={query}
          />
          <button
            onClick={handleSubmit}
            className="cursor-pointer bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 font-semibold"
          >
            Search
          </button>
        </div>

        {data && (
          <div className="mt-6 text-center text-black space-y-2">
            <h2 className="text-xl font-bold">
              {data.name}, {data.sys.country}
            </h2>
            <p>Temperature: {data.main.temp} K</p>
            <p>
              Weather: {data.weather[0].main} - {data.weather[0].description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherDetails;
