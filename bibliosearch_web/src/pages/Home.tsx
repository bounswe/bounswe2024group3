import React from "react";

const Home = () => {
  return (
    <div>
      <h1>Home</h1>
      <button
        className="btn btn-primary"
        onClick={() => {
          alert("Hello, world!");
        }}
      >
        One
      </button>
    </div>
  );
};

export default Home;
