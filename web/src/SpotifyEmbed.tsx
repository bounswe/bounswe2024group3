import React, { useEffect, useRef } from "react";

const SpotifyEmbed = ({ spotifyId }: { spotifyId: string }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    // Load the Spotify iFrame API
    const script = document.createElement("script");
    script.src = "https://open.spotify.com/embed/iframe-api/v1";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyIframeApiReady = (IFrameAPI) => {
      const options = {
        uri: spotifyId, // Append ?theme=0 for dark mode
        width: "100%",
        height: "80", // Adjusted height
        frameBorder: "0", // No frame border
        allow: "encrypted-media",
        className: "rounded-md shadow-lg", // Tailwind styling
      };

      IFrameAPI.createController(iframeRef.current, options, () => {});
    };
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <div
        className="bg-gray-800 p-4 rounded-lg"
        id="embed-iframe"
        ref={iframeRef}
      ></div>
    </div>
  );
};

export default SpotifyEmbed;
