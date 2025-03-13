import { env } from "~/env";

export const APP_TZ = env.NEXT_PUBLIC_APP_TZ;
export const APP_URL = env.NEXT_PUBLIC_APP_URL;
export const APP_ENV = env.NEXT_PUBLIC_APP_ENV;

export const site = {
  name: "Nabung Qurban",
  description: "Qurban mudah, aman, dan terpercaya",
  url: APP_URL,
};
