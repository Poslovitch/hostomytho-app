import { Theme } from "models/Theme";
import api from "./index";

export const getAllThemes = async (): Promise<Theme[]> => {
  try {
    return await api.get("/themes");
  } catch (error) {
    console.error(error);
    throw error;
  }
};