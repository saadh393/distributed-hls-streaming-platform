import { queuedDir, tmpdir } from "./config/config";
import app from "./server";
import validateDir from "./utils/validate-dir";

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  await validateDir(tmpdir);
  await validateDir(queuedDir);

  console.log(`🚀 Upload Server is listening at http://localhost:${PORT}`);
});
