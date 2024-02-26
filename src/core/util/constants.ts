export const IS_TEST = process.env.NODE_ENV === "test";
export const IS_SERVER = ["development", "production"].includes(
  process.env.NODE_ENV as string
);
