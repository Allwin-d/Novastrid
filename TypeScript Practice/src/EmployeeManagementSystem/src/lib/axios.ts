// src/lib/axios.ts
import axios from "axios";

const instance = axios.create({
  baseURL: "https://684fd153e7c42cfd179617fb.mockapi.io", //
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
