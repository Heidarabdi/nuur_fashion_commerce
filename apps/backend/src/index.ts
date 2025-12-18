import app from "./app";
import { env } from "./config";

const port = env.PORT;

console.log(`Server is running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
