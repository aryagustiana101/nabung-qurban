import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "~/env";

export const s3 = new S3Client({
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
  const expires = opts?.expires ?? 3600;
  const bucket = opts?.bucket ?? env.AWS_BUCKET;

  return await getSignedUrl(
    s3,
    new PutObjectCommand({ Key: file, ACL: "public-read", Bucket: bucket }),
    { expiresIn: expires },
  );
}

export function getPublicUrl(file?: string) {
  const endpoint = new URL(env.AWS_ENDPOINT_URL);
  return `${endpoint.protocol}//${env.AWS_BUCKET}.${endpoint.hostname}${file ? `/${file}` : ""}`;
}
