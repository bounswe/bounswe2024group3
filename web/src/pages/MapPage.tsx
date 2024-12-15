import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from "react-leaflet";
import L from "leaflet";
import RecommendationItem from "../components/RecommendationItem";
import { parseSpotifyLink, req } from "../utils/client";

// Fix Leaflet marker icon issue
import "leaflet/dist/leaflet.css";
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

interface Track {
  link: string;
  count: number;
}

const MapPage: React.FC = () => {
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
  const [radius, setRadius] = useState<number>(10); // Radius in kilometers
  const [mostListenedNearby, setMostListenedNearby] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [mostSharedNearby, setMostSharedNearby] = useState<string[]>([]);
  const [loadingShared, setLoadingShared] = useState(false);

  // Custom map events handler
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkerPosition([lat, lng]);
        console.log("Tagged Position:", { latitude: lat, longitude: lng });
      },
    });
    return markerPosition ? <Marker position={markerPosition} /> : null;
  };
  const fetchMostSharedNearby = async () => {
    if (!markerPosition) {
      alert("Please click on the map to select a point.");
      return;
    }

    setLoadingShared(true);
    setMostSharedNearby([]);
    try {
      const [latitude, longitude] = markerPosition;
      const queryParams = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        radius: radius.toString(),
      });
      const requestUrl = `most-shared-nearby-things/?${queryParams.toString()}`;

      const response = await req(requestUrl, "get", {});
      if (response.data?.songs) {
        const trackLinks = response.data.songs.map((track: Track) => track.link);
        setMostSharedNearby(trackLinks);
      }
    } catch (error) {
      console.error("Error fetching most shared nearby things:", error);
    } finally {
      setLoadingShared(false);
    }
  };

  // Function to fetch most listened nearby songs
  const fetchMostListenedNearby = async () => {
    if (!markerPosition) {
      alert("Please click on the map to select a point.");
      return;
    }

    setLoading(true);
    setMostListenedNearby([]);
    try {
      const [latitude, longitude] = markerPosition;
      const queryParams = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        radius: radius.toString(),
      });
      const requestUrl = `most-listened-nearby/?${queryParams.toString()}`;
      console.log("Requesting:", requestUrl);

      const response = await req(requestUrl, "get", {});
      
      if (!response.data || !response.data.tracks) {
        console.warn("No tracks data found in response");
        return [];
      }
      if (response.data?.tracks) {
        const trackLinks = response.data.tracks.map((track: Track) => track.link);
        setMostListenedNearby(trackLinks);
        console.log("Most listened tracks:", response.data.tracks);
      }
    } catch (error) {
      console.error("Error fetching most listened nearby songs:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Find Most Listened Nearby Songs</h1>

      {/* Map Container */}
      <MapContainer
        center={[0, 0]} // Initial map center
        zoom={2} // Initial zoom level
        style={{ height: "500px", width: "100%" }}
      >
        {/* Base Map */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker />
        {/* Radius Circle */}
        {markerPosition && (
          <Circle
            center={markerPosition}
            radius={radius * 1000} // Convert kilometers to meters
            color="blue"
            fillOpacity={0.3}
          />
        )}
      </MapContainer>

      {/* Radius Input */}
      <div className="mt-4 flex items-center">
        <label htmlFor="radius" className="mr-2">
          Radius (kilometers):
        </label>
        <input
          id="radius"
          type="number"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="input input-bordered w-32"
          min={1}
          max={50}
        />
      </div>

      {/* Fetch Button */}
      <div className="mt-4">
        <button
          onClick={fetchMostListenedNearby}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Fetching..." : "Fetch Most Listened Nearby"}
        </button>
      </div>
      <div className="mt-4">
        <button
          onClick={fetchMostSharedNearby}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-300"
          disabled={loading}
        >
          {loading ? "Fetching..." : "Fetch Most Shared Nearby"}
        </button>
      </div>
      

      {/* Most Listened Nearby Results */}
      {mostListenedNearby.length > 0 && (<>

      <h2 className="text-xl font-semibold mt-6">Most Listened Songs</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

  {mostListenedNearby.slice(0, 10).map((rec:string,i) => (
    <div
      className="flex items-center gap-4 p-4 bg-base-100 rounded-lg shadow hover:shadow-lg transition duration-300"
    >   <div className="text-3xl font-bold text-base-700 w-8 text-right">
    {i + 1}.
  </div>

      {/* RecommendationItem */}
      <RecommendationItem key={parseSpotifyLink(rec).id}
          rec={{
            type: parseSpotifyLink(rec).type,
            spotifyId: parseSpotifyLink(rec).id,
          }}/>
    </div>




  ))}
</div> </>)}
  {/* Most Shared Nearby Results */}
  {mostSharedNearby.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mt-6">Most Shared Things</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {mostSharedNearby.slice(0, 10).map((rec: string, i) => (
                <div
                  key={`shared-${i}`}
                  className="flex items-center gap-4 p-4 bg-base-100 rounded-lg shadow hover:shadow-lg transition duration-300"
                >
              <div className="text-3xl font-bold text-base-700 w-8 text-right">
                  {i + 1}.
                </div>                  <RecommendationItem
                    rec={{
                      type: parseSpotifyLink(rec).type,
                      spotifyId: parseSpotifyLink(rec).id,
                    }}
                  />
                </div>
              ))}
            </div>
          </>
        )}
        

    </div>
    
  );
};

export default MapPage;
