import { renderHook, act } from "@testing-library/react";
import { req } from "../utils/client";
import { useState } from "react";

// Mock the req utility for API calls
jest.mock("../utils/client");
const mockReq = req as jest.Mock;

// Mock function: fetchMostListenedNearby
const fetchMostListenedNearby = async (
  markerPosition: [number, number] | null,
  radius: number,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setMostListenedNearby: React.Dispatch<React.SetStateAction<string[]>>
) => {
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
    const response = await req(requestUrl, "get", {});
    if (response.data?.tracks) {
      const trackLinks = response.data.tracks.map((track: { link: string }) => track.link);
      setMostListenedNearby(trackLinks);
    }
  } catch (error) {
    console.error("Error fetching most listened nearby songs:", error);
  } finally {
    setLoading(false);
  }
};

describe("fetchMostListenedNearby", () => {
  test("should fetch most listened nearby songs successfully", async () => {
    const setLoading = jest.fn();
    const setMostListenedNearby = jest.fn();

    const markerPosition: [number, number] = [41.08, 29.03];
    const radius = 10;

    // Mock the API response
    mockReq.mockResolvedValue({
      data: {
        tracks: [{ link: "https://open.spotify.com/track/12345" }],
      },
    });

    await fetchMostListenedNearby(markerPosition, radius, setLoading, setMostListenedNearby);

    expect(setLoading).toHaveBeenCalledWith(true);
    expect(mockReq).toHaveBeenCalledWith(
      "most-listened-nearby/?latitude=41.08&longitude=29.03&radius=10",
      "get",
      {}
    );
    expect(setMostListenedNearby).toHaveBeenCalledWith([
      "https://open.spotify.com/track/12345",
    ]);
    expect(setLoading).toHaveBeenCalledWith(false);
  });

  test("should handle errors gracefully", async () => {
    const setLoading = jest.fn();
    const setMostListenedNearby = jest.fn();
    const consoleErrorMock = jest.spyOn(console, "error").mockImplementation();

    const markerPosition: [number, number] = [41.08, 29.03];
    const radius = 10;

    // Mock API error
    mockReq.mockRejectedValue(new Error("API request failed"));

    await fetchMostListenedNearby(markerPosition, radius, setLoading, setMostListenedNearby);

    expect(setLoading).toHaveBeenCalledWith(true);
    expect(mockReq).toHaveBeenCalled();
    expect(consoleErrorMock).toHaveBeenCalledWith(
      "Error fetching most listened nearby songs:",
      expect.any(Error)
    );
    expect(setLoading).toHaveBeenCalledWith(false);

    consoleErrorMock.mockRestore();
  });


});
