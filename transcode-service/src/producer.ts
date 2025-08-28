// Goal -
// 1 - Test function of Duration Extraction
// 2 - Test function of Thumbnail Generation

import { uploadTranscodedFiles } from "./service/storage-service";

// downloadFile(UPLOADS_BUCKET, "CF2a18b6JP", "CF2a18b6JP.mov");

async function main() {
  // const time = await getDurationInSecond("/app/tmp/CF2a18b6JP.mov");
  // makeHeroThumbnail("/app/tmp/CF2a18b6JP.mov", "/app/tmp/CF2a18b6JP.webp", time);
  uploadTranscodedFiles("oBjf7f43wa", "/app/transcoded/");
}

main();
