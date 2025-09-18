import axios from "axios";

export function GetService(Method: string, URL?: string,) {
  return axios.get(URL + Method, {
     headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    // validateStatus: function (status) {
    //   return (status >= 200 && status < 300) || status == 404; // Resolve only if the status code is 200 or less than 300
    // }
  });
}

export function PostService(Method: string, Body: any, URL?: string, isUrlEncoded?: boolean) {
  return axios.post(URL + Method, Body, {
     headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });
}