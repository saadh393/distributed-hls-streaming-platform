import { GetObjectCommandOutput } from "@aws-sdk/client-s3";

export type PlaylistResponse = {
  data: string;
} & GetObjectCommandOutput;
