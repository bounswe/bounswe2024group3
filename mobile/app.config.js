// app.config.js
import 'dotenv/config';

export default {
  expo: {
    name: "SpotOn",
    slug: "spoton",
    version: "1.0.0",
    sdkVersion: "51.0.0", // Replace with your Expo SDK version
    // ... other Expo configurations
    extra: {
      REACT_APP_BACKEND_URL: process.env.REACT_APP_BACKEND_URL,
      // Add more variables as needed
    },
  },
};
