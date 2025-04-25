import {
  getS3PublicUrl,
  getS3UploadPresignedUrl,
  makeS3Client,
} from "@repo/storage";
import { env } from "~/env";

export const s3 = makeS3Client({
  region: env.AWS_DEFAULT_REGION,
  endpoint: env.AWS_ENDPOINT_URL,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function getUploadPresignedUrl(
  file: string,
  opts?: { bucket?: string; expires?: number },
) {
  return await getS3UploadPresignedUrl({
    s3,
    file,
    expires: opts?.expires ?? 3600,
    bucket: opts?.bucket ?? env.AWS_BUCKET,
  });
}

export function getPublicUrl(file?: string, opts?: { bucket?: string }) {
  return getS3PublicUrl({
    file,
    url: new URL(env.AWS_ENDPOINT_URL),
    bucket: opts?.bucket ?? env.AWS_BUCKET,
  });
}
