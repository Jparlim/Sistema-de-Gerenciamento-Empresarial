import { SESClient } from "@aws-sdk/client-ses";
import "dotenv/config";

export const sesClient = new SESClient({
  region: process.env.AWS_REGION as string,
});
