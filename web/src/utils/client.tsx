import axios, { Method } from "axios";

export const req = async (url: string, method: string, data: any) => {
  if (method === "post" && url[url.length - 1] !== "/") {
    url += "/";
  }
  if (method === "get" && url[url.length - 1] === "/") {
    url = url.slice(0, -1);
  }
  const axiosParams = {
    method: method as Method,
    url: process.env.REACT_APP_BACKEND_URL + url,
    data: data,
    withCredentials: true,
  };
  console.log("REQ>", axiosParams);
  const resp = await axios(axiosParams);
  if (resp.status === 403) {
    throw new Error("You are not authorized to perform this action");
  }
  if (resp.data.error) {
    throw new Error(resp.data.error);
  }
  return resp;
};

/// Returns the id and type of a Spotify link
export const parseSpotifyLink = (url: string) => {
  if (url.includes("spotify.com")) {
    // Remove query parameters if they exist
    const cleanedUrl = url.split("?")[0];
    const parts = cleanedUrl.split("/");
    const id = parts[parts.length - 1];
    const type = parts[parts.length - 2];
    return { id, type };
  }
  throw new Error("Invalid Spotify link");
};

/// Returns a Spotify link from the given id and type
export const createSpotifyLink = ({
  type,
  id,
}: {
  type: string;
  id: string;
}): string => {
  if (!type || !id) {
    throw new Error("Invalid type or id");
  }
  return `https://open.spotify.com/${type}/${id}`;
};
