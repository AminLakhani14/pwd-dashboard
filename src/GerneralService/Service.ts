import axios from "axios";

export function GetService(url: string) {
  return axios.get(url, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });
}

export function PostService(url: string, body: any, isUrlEncoded?: boolean) {
  return axios.post(url, body, {
    headers: {
      'Content-Type': isUrlEncoded ? 'application/x-www-form-urlencoded' : 'application/json',
      'Accept': 'application/json',
    },
  });
}