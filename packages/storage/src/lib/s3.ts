import {
  PutObjectCommand,
  S3Client,
  type S3ClientConfig,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export function makeS3Client(config: S3ClientConfig) {
  return new S3Client(config);
}

export async function getS3UploadPresignedUrl({
  s3,
  file,
  bucket,
  expires = 3600,
}: {
  file: string;
  s3: S3Client;
  bucket: string;
  expires?: number;
}) {
  return await getSignedUrl(
    s3,
    new PutObjectCommand({ Key: file, ACL: "public-read", Bucket: bucket }),
    { expiresIn: expires },
  );
}

export function getS3PublicUrl({
  url,
  file,
  bucket,
}: {
  url: URL;
  file?: string;
  bucket?: string;
}) {
  return `${url.protocol}//${bucket}.${url.hostname}${file ? `/${file}` : ""}`;
}
