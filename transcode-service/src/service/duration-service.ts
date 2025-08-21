import { execFile } from "child_process";
import { promisify } from "util";
const pExec = promisify(execFile);

export default async function getDurationInSecond(input: string): Promise<number> {
  const { stdout } = await pExec("ffprobe", [
    "-v",
    "error",
    "-show_entries",
    "format=duration",
    "-of",
    "default=nw=1:nk=1",
    input,
  ]);
  return Math.max(0, Math.floor(parseFloat(stdout)));
}
