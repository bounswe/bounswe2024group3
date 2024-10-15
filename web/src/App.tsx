import SpotifyEmbed from "./SpotifyEmbed";

function App() {
  return (
    <>
      <h1 className="text-3xl font-bold underline text-red-600">
        Simple React Typescript Tailwind Sample
      </h1>
      <SpotifyEmbed spotifyId="spotify:track:2LETLpcnlbL2d5IbnNYLf8?theme=0" />
      <button className="btn btn-primary">Primary</button>
    </>
  );
}

export default App;
