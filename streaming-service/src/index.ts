import dotenv from "dotenv";
dotenv.config();

import app from "./app";

const port = process.env.PORT || 3004;

app.listen(port, () => {
  console.log("Streaming service is running at port - ", port);
});
