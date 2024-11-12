// LocationFetcher.tsx
import React, { useEffect } from 'react';

const LocationFetcher: React.FC = () => {
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchCityName(latitude, longitude);
        },
        (error) => {
          console.error("Error obtaining location: ", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const fetchCityName = async (latitude: number, longitude: number) => {
    const apiKey = "YOUR_API_KEY"; // Replace with your API key
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`
      );
      const data = await response.json();

      if (data && data.results && data.results.length > 0) {
        const city = data.results[0].components.city || data.results[0].components.town || data.results[0].components.village || "Unknown City";
        console.log("City:", city); // Log city to console
      } else {
        console.error("City not found");
      }
    } catch (error) {
      console.error("Error fetching city name:", error);
    }
  };

  return null; // Does not render anything
};

export default LocationFetcher;
