// The Bucket Name of Transcoded Video
export const M3U8_BUCKET = process.env.M3U8_BUCKET as string;

// How long the signed url should be valid
export const EXPIRE_IN = 30000;

// NODE ENVIRONMENTS ;
export const PRODUCTION_ENV = "production";
export const DEVELOPMENT_ENV = "development";

export const NODE_ENV = process.env.NODE_ENV || DEVELOPMENT_ENV;
export const PORT = process.env.PORT || 3004;
export const IS_PROD = NODE_ENV === PRODUCTION_ENV;
