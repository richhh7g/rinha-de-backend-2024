import path from "path";

export const IS_TEST = process.env.NODE_ENV === "test";
export const IS_SERVER = ["development", "production"].includes(
  process.env.NODE_ENV as string
);

export const ROOT_PATH = path.resolve(__dirname, "..", "..", "..");
export const BASE_PATH = path.resolve(__dirname, "..", "..");
export const CORE_PATH = path.resolve(BASE_PATH, "core");
export const API_PATH = path.resolve(BASE_PATH, "api");
export const TEST_PATH = IS_TEST && path.resolve(BASE_PATH, "test");
