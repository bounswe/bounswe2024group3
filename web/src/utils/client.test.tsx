// client.test.ts
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { req } from "./client"; // Adjust the import path as necessary
import { parseSpotifyLink } from './client';

describe("req utility function", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    // Set up Axios mock adapter
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    // Reset Axios mock adapter
    mock.reset();
    mock.restore();
  });

  it("should make a POST request and return the response", async () => {
    const mockUrl = "test";
    const mockData = { key: "value" };
    const backendUrl = "http://example.com/";

    // Mock environment variable
    process.env.REACT_APP_BACKEND_URL = backendUrl;

    // Mock Axios response
    mock.onPost(`${backendUrl}${mockUrl}/`).reply(200, { success: true });

    const result = await req(mockUrl, "post", mockData);

    expect(result.data).toEqual({ success: true });
  });

  it("should make a GET request and return the response", async () => {
    const mockUrl = "test";
    const backendUrl = "http://example.com/";

    process.env.REACT_APP_BACKEND_URL = backendUrl;

    mock.onGet(`${backendUrl}${mockUrl}`).reply(200, { success: true });

    const result = await req(mockUrl, "get", null);

    expect(result.data).toEqual({ success: true });
  });

  it("should throw an error for status 403", async () => {
    const mockUrl = "test";
    const backendUrl = "http://example.com/";

    process.env.REACT_APP_BACKEND_URL = backendUrl;

    mock.onPost(`${backendUrl}${mockUrl}/`).reply(403);

    await expect(req(mockUrl, "post", {})).rejects.toThrow(
      "Request failed with status code 403"
    );
  });

  it("should throw an error if response data contains an error", async () => {
    const mockUrl = "test";
    const backendUrl = "http://example.com/";

    process.env.REACT_APP_BACKEND_URL = backendUrl;

    mock.onPost(`${backendUrl}${mockUrl}/`).reply(200, { error: "Some error" });

    await expect(req(mockUrl, "post", {})).rejects.toThrow("Some error");
  });
});


describe('parseSpotifyLink', () => {
  it('should return the correct id and type for a valid track URL', () => {
    const url = "https://open.spotify.com/track/7x76RN4ZCsw5DxT8LOmexq?si=abc123";
    const result = parseSpotifyLink(url);
    expect(result).toEqual({ id: "7x76RN4ZCsw5DxT8LOmexq", type: "track" });
  });

  it('should return the correct id and type for a valid playlist URL', () => {
    const url = "https://open.spotify.com/playlist/3oAH9FsuQGzqP5hAHiEcFD";
    const result = parseSpotifyLink(url);
    expect(result).toEqual({ id: "3oAH9FsuQGzqP5hAHiEcFD", type: "playlist" });
  });

  it('should return the correct id and type for a valid album URL', () => {
    const url = "https://open.spotify.com/album/6RFizmJ3VitZBr8kwo62Kq";
    const result = parseSpotifyLink(url);
    expect(result).toEqual({ id: "6RFizmJ3VitZBr8kwo62Kq", type: "album" });
  });

  it('should remove query parameters and return the correct id and type', () => {
    const url = "https://open.spotify.com/track/52ojopYMUzeNcudsoz7O9D?utm_source=share";
    const result = parseSpotifyLink(url);
    expect(result).toEqual({ id: "52ojopYMUzeNcudsoz7O9D", type: "track" });
  });

  it('should throw an error for an invalid Spotify link', () => {
    const url = "https://example.com/not-a-spotify-link";
    expect(() => parseSpotifyLink(url)).toThrow("Invalid Spotify link");
  });

  it('should throw an error if the URL does not contain a Spotify domain', () => {
    const url = "https://someotherwebsite.com/track/52ojopYMUzeNcudsoz7O9D";
    expect(() => parseSpotifyLink(url)).toThrow("Invalid Spotify link");
  });
});
