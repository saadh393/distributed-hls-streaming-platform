interface MissingChunksResult extends Array<number> {}

export default function missingChunks(totalChunk: number, recievedChunk: number[]): MissingChunksResult {
  const fullRange: Array<number> = Array.from({ length: totalChunk }, (_, i: number) => i);
  const recievedChunkSet = new Set(recievedChunk);

  console.log(fullRange);
  console.log(recievedChunkSet);

  return fullRange.filter((x) => !recievedChunkSet.has(x));
}
