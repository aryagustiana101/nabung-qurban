import { type Json, jsonSchema } from "@repo/common";
import { z } from "zod";
import { env } from "~/env";

export async function sendWhatsappBusinessMessageTemplate({
  to,
  meta,
  template,
}: {
  to: string;
  template: { name: string; language: string; components: Json };
  meta: {
    whatsAppBusiness: { phoneNumberId: string };
    api: { url: string; token: string; version: string };
  };
}) {
  const output = await fetch(
    `${meta.api.url}/${meta.api.version}/${meta.whatsAppBusiness.phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${meta.api.token}`,
      },
      body: JSON.stringify({
        to,
        type: "template",
        recipient_type: "individual",
        messaging_product: "whatsapp",
        template: {
          name: template.name,
          components: template.components,
          language: { code: template.language },
        },
      }),
    },
  );

  return z
    .object({
      messaging_product: z.string().nullish(),
      contacts: z
        .object({ input: z.string().nullish(), wa_id: z.string().nullish() })
        .array()
        .nullish(),
      messages: z
        .object({
          id: z.string().nullish(),
          message_status: z.string().nullish(),
        })
        .array()
        .nullish(),
    })
    .parse(await output.json());
}

export async function sendOtp({ to, code }: { to: string; code: string }) {
  return sendWhatsappBusinessMessageTemplate({
    to,
    template: {
      name: env.WHATSAPP_BUSINESS_OTP_MESSAGE_TEMPLATE_NAME,
      language: env.WHATSAPP_BUSINESS_OTP_MESSAGE_TEMPLATE_LANGUAGE,
      components:
        jsonSchema.safeParse(
          JSON.parse(
            env.WHATSAPP_BUSINESS_OTP_MESSAGE_TEMPLATE_COMPONENTS.replaceAll(
              "{BODY}",
              code,
            ),
          ),
        ).data ?? [],
    },
    meta: {
      whatsAppBusiness: {
        phoneNumberId: env.WHATSAPP_BUSINESS_PHONE_NUMBER_ID,
      },
      api: {
        url: env.META_API_URL,
        token: env.META_API_TOKEN,
        version: env.META_API_VERSION,
      },
    },
  });
}
