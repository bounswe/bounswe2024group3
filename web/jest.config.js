module.exports = {
    preset: "ts-jest",
    transformIgnorePatterns: [
      "/node_modules/(?!axios)/", // Allow Jest to transform axios
    ],
  };
  