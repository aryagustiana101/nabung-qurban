import { env } from "~/env";

export async function importKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret.padEnd(32, "0").slice(0, 32)),
    { name: "AES-CBC" },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function encrypt(value: string) {
  const iv = crypto.getRandomValues(new Uint8Array(16));

  const cipher = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv },
    await importKey(env.ENCRYPTION_SECRET_KEY),
    new TextEncoder().encode(value),
  );

  return `${Buffer.from(iv).toString("hex")}:${Buffer.from(cipher).toString("hex")}`;
}

export async function decrypt(value: string) {
  const words = value.split(":");

  return new TextDecoder().decode(
    await crypto.subtle.decrypt(
      { name: "AES-CBC", iv: Buffer.from(words[0], "hex") },
      await importKey(env.ENCRYPTION_SECRET_KEY),
      Buffer.from(words[1], "hex"),
    ),
  );
}
