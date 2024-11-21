// client.test.ts
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { req } from "./client"; // Adjust the import path as necessary

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