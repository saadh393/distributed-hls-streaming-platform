import app from "./app";
import "./worker/index";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Server is running at http://localhost:" + PORT);
});
