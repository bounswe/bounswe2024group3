import axios from "axios";
import Cookies from "js-cookie";

export const req = async (url: string, method: string, data: any) => {
  if (!Cookies.get("csrftoken")) {
    await axios.get(process.env.REACT_APP_BACKEND_URL + "getToken/");
  }
  if (method === "post" && url[url.length - 1] !== "/") {
    url += "/";
  }
  if (method === "get" && url[url.length - 1] === "/") {
    url = url.slice(0, -1);
  }
  const axiosParams = {
    method: method,
    url: process.env.REACT_APP_BACKEND_URL + url,
    data: data,
    withCredentials: true,
    withXSRFToken: true,
    xsrfCookieName: "csrftoken",
    xsrfHeaderName: "X-CSRFToken",
    validateStatus: () => true,
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
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
