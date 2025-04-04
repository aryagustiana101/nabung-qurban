import type { Prisma } from "@prisma/client";
import {
  DATE_FORMAT,
  DISCOUNT_LEVELS,
  DISCOUNT_LEVEL_MAP,
  DISCOUNT_TYPES,
  DISCOUNT_TYPE_MAP,
  type Locale,
  PRODUCT_ATTRIBUTE_KEYS,
  PRODUCT_STATUSES,
  PRODUCT_STATUS_MAP,
  PRODUCT_VARIANT_STATUSES,
  PRODUCT_VARIANT_STATUS_MAP,
  SERVICE_CODES,
  SERVICE_LEVELS,
  SERVICE_LEVEL_MAP,
  SERVICE_STATUSES,
  SERVICE_STATUS_MAP,
  TOKEN_STATUSES,
  TOKEN_STATUS_MAP,
  type Timezone,
  USER_ACCOUNT_TYPES,
  USER_ACCOUNT_TYPE_MAP,
  USER_ADDRESS_TYPES,
  USER_ADDRESS_TYPE_MAP,
  USER_PASSWORD_RESET_SESSION_ACTIONS,
  USER_PASSWORD_RESET_SESSION_ACTION_MAP,
  USER_PASSWORD_RESET_SESSION_STATUSES,
  USER_PASSWORD_RESET_SESSION_STATUS_MAP,
  USER_STATUSES,
  USER_STATUS_MAP,
  USER_TYPES,
  USER_TYPE_MAP,
  formatDate,
  formatMoney,
  formatNumber,
} from "@repo/common";
import { z } from "zod";

export function parseUser({
  user,
  locale,
  timezone,
  defaultValue,
}: {
  locale: Locale;
  timezone: Timezone;
  defaultValue: { image: string };
  user: Prisma.UserGetPayload<object>;
}) {
  return {
    id: user.id,
    name: user.name,
    phoneNumber: user.phoneNumber,
    email: user.email,
    status: z.enum(USER_STATUSES).parse(user.status),
    type: z.enum(USER_TYPES).parse(user.type),
    username: user.username,
    password: user.password,
    image: user.image,
    verifiedAt: user.verifiedAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    fmt: {
      status: USER_STATUS_MAP[user.status],
      type: USER_TYPE_MAP[user.type],
      image: user.image ?? defaultValue.image,
      verifiedAt: user.verifiedAt
        ? formatDate(user.verifiedAt, DATE_FORMAT.NORMAL, locale, timezone)
        : "-",
      createdAt: formatDate(
        user.createdAt,
        DATE_FORMAT.NORMAL,
        locale,
        timezone,
      ),
      updatedAt: formatDate(
        user.updatedAt,
        DATE_FORMAT.NORMAL,
        locale,
        timezone,
      ),
    },
  };
}

export function parseUserAccount({
  locale,
  timezone,
  userAccount,
}: {
  locale: Locale;
  timezone: Timezone;
  userAccount: Prisma.UserAccountGetPayload<object>;
}) {
  return {
    id: userAccount.id,
    type: z.enum(USER_ACCOUNT_TYPES).parse(userAccount.type),
    createdAt: userAccount.createdAt,
    updatedAt: userAccount.updatedAt,
    fmt: {
      type: USER_ACCOUNT_TYPE_MAP[userAccount.type],
      createdAt: formatDate(
        userAccount.createdAt,
        DATE_FORMAT.NORMAL,
        locale,
        timezone,
      ),
      updatedAt: formatDate(
        userAccount.updatedAt,
        DATE_FORMAT.NORMAL,
        locale,
        timezone,
      ),
    },
  };
}

export function parseToken({
  token,
  locale,
  timezone,
}: {
  locale: Locale;
  timezone: Timezone;
  token: Prisma.TokenGetPayload<object>;
}) {
  return {
    id: token.id,
    key: token.key,
    status: z.enum(TOKEN_STATUSES).parse(token.status),
    secret: token.secret,
    abilities: z.string().array().safeParse(token.abilities)?.data ?? [],
    expiredAt: token.expiredAt,
    createdAt: token.createdAt,
    updatedAt: token.updatedAt,
    fmt: {
      status: TOKEN_STATUS_MAP[token.status],
      expiredAt: token.expiredAt
        ? formatDate(token.expiredAt, DATE_FORMAT.NORMAL, locale, timezone)
        : "-",
      createdAt: formatDate(
        token.createdAt,
        DATE_FORMAT.NORMAL,
        locale,
        timezone,
      ),
      updatedAt: formatDate(
        token.updatedAt,
        DATE_FORMAT.NORMAL,
        locale,
        timezone,
      ),
    },
  };
}

export function parseUserPasswordResetSession({
  locale,
  timezone,
  userPasswordResetSession,
}: {
  locale: Locale;
  timezone: Timezone;
  userPasswordResetSession: Prisma.UserPasswordResetSessionGetPayload<object>;
}) {
  return {
    id: userPasswordResetSession.id,
    key: userPasswordResetSession.key,
    action: z
      .enum(USER_PASSWORD_RESET_SESSION_ACTIONS)
      .parse(userPasswordResetSession.action),
    status: z
      .enum(USER_PASSWORD_RESET_SESSION_STATUSES)
      .parse(userPasswordResetSession.status),
    expiredAt: userPasswordResetSession.expiredAt,
    createdAt: userPasswordResetSession.createdAt,
    updatedAt: userPasswordResetSession.updatedAt,
    fmt: {
      action:
        USER_PASSWORD_RESET_SESSION_ACTION_MAP[userPasswordResetSession.action],
      status:
        USER_PASSWORD_RESET_SESSION_STATUS_MAP[userPasswordResetSession.status],
      expiredAt: formatDate(
        userPasswordResetSession.expiredAt,
        DATE_FORMAT.NORMAL,
        locale,
        timezone,
      ),
      createdAt: formatDate(
        userPasswordResetSession.createdAt,
        DATE_FORMAT.NORMAL,
        locale,
        timezone,
      ),
      updatedAt: formatDate(
        userPasswordResetSession.updatedAt,
        DATE_FORMAT.NORMAL,
        locale,
        timezone,
      ),
    },
  };
}

export function parseUserAddress({
  locale,
  timezone,
  userAddress,
}: {
  locale: Locale;
  timezone: Timezone;
  userAddress: Prisma.UserAddressGetPayload<object>;
}) {
  const location =
    z
      .object({
        name: z.string(),
        detail: z.string(),
        coordinates: z.object({
          latitude: z.string(),
          longitude: z.string(),
        }),
      })
      .safeParse(userAddress.location)?.data ?? null;

  return {
    id: userAddress.id,
    name: userAddress.name,
    type: z.enum(USER_ADDRESS_TYPES).parse(userAddress.type),
    contactName: userAddress.contactName,
    contactPhoneNumber: userAddress.contactPhoneNumber,
    location,
    detail: userAddress.detail,
    note: userAddress.note,
    createdAt: userAddress.createdAt,
    updatedAt: userAddress.updatedAt,
    fmt: {
      type: USER_ADDRESS_TYPE_MAP[userAddress.type],
      note: userAddress.note,
      createdAt: formatDate(
        userAddress.createdAt,
        DATE_FORMAT.NORMAL,
        locale,
        timezone,
      ),
      updatedAt: formatDate(
        userAddress.updatedAt,
        DATE_FORMAT.NORMAL,
        locale,
        timezone,
      ),
    },
  };
}

export function parseService({
  locale,
  service,
  timezone,
}: {
  locale: Locale;
  timezone: Timezone;
  service: Prisma.ServiceGetPayload<object>;
}) {
  return {
    id: service.id,
    code: z.enum(SERVICE_CODES).parse(service.code),
    name: service.name,
    status: z.enum(SERVICE_STATUSES).parse(service.status),
    level: z.enum(SERVICE_LEVELS).parse(service.level),
    description: service.description,
    image: service.image,
    createdAt: service.createdAt,
    updatedAt: service.updatedAt,
    fmt: {
      status: SERVICE_STATUS_MAP[service.status],
      level: SERVICE_LEVEL_MAP[service.level],
      description: service.description ?? "-",
      createdAt: formatDate(
        service.createdAt,
        DATE_FORMAT.NORMAL,
        locale,
        timezone,
      ),
      updatedAt: formatDate(
        service.updatedAt,
        DATE_FORMAT.NORMAL,
        locale,
        timezone,
      ),
    },
  };
}

export function parseProductCategory({
  locale,
  timezone,
  productCategory,
}: {
  locale: Locale;
  timezone: Timezone;
  productCategory: Prisma.ProductCategoryGetPayload<object>;
}) {
  return {
    id: productCategory.id,
    code: productCategory.code,
    name: productCategory.name,
    createdAt: productCategory.createdAt,
    updatedAt: productCategory.updatedAt,
    fmt: {
      createdAt: formatDate(
        productCategory.createdAt,
        DATE_FORMAT.NORMAL,
        locale,
        timezone,
      ),
      updatedAt: formatDate(
        productCategory.updatedAt,
        DATE_FORMAT.NORMAL,
        locale,
        timezone,
      ),
    },
  };
}

export function parseProduct({
  locale,
  product,
  timezone,
}: {
  locale: Locale;
  timezone: Timezone;
  product: Prisma.ProductGetPayload<object>;
}) {
  return {
    id: product.id,
    name: product.name,
    status: z.enum(PRODUCT_STATUSES).parse(product.status),
    thumbnail: product.thumbnail,
    images: parseProductImages({ product, locale, timezone }),
    attributes: parseProductAttributes({ product, locale, timezone }),
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    fmt: {
      status: PRODUCT_STATUS_MAP[product.status],
      createdAt: formatDate(
        product.createdAt,
        DATE_FORMAT.NORMAL,
        locale,
        timezone,
      ),
      updatedAt: formatDate(
        product.updatedAt,
        DATE_FORMAT.NORMAL,
        locale,
        timezone,
      ),
    },
  };
}

export function parseProductImages({
  product,
}: {
  locale: Locale;
  timezone: Timezone;
  product: Prisma.ProductGetPayload<object>;
}) {
  return z.string().array().safeParse(product.images).data ?? [];
}

export function parseProductAttributes({
  product,
}: {
  locale: Locale;
  timezone: Timezone;
  product: Prisma.ProductGetPayload<object>;
}) {
  return (
    z
      .object({
        key: z.enum(PRODUCT_ATTRIBUTE_KEYS),
        title: z.string(),
        value: z.string(),
      })
      .array()
      .safeParse(product.attributes)?.data ?? []
  );
}

export function parseProductVariantAttribute({
  locale,
  timezone,
  productVariantAttribute,
}: {
  locale: Locale;
  timezone: Timezone;
  productVariantAttribute: Prisma.ProductVariantAttributeGetPayload<object>;
}) {
  return {
    id: productVariantAttribute.id,
    code: productVariantAttribute.code,
    name: productVariantAttribute.name,
    rule: parseProductVariantAttributeRule({
      locale,
      timezone,
      productVariantAttribute,
    }),
    createdAt: productVariantAttribute.createdAt,
    updatedAt: productVariantAttribute.updatedAt,
    fmt: {
      createdAt: formatDate(
        productVariantAttribute.createdAt,
        DATE_FORMAT.NORMAL,
        locale,
        timezone,
      ),
      updatedAt: formatDate(
        productVariantAttribute.updatedAt,
        DATE_FORMAT.NORMAL,
        locale,
        timezone,
      ),
    },
  };
}

export function parseProductVariantAttributeRule({
  productVariantAttribute,
}: {
  locale: Locale;
  timezone: Timezone;
  productVariantAttribute: Prisma.ProductVariantAttributeGetPayload<object>;
}) {
  const rule = z
    .object({
      quantity: z
        .object({ min: z.number().nullish(), max: z.number().nullish() })
        .nullish(),
      participant: z
        .object({ min: z.number().nullish(), max: z.number().nullish() })
        .nullish(),
    })
    .safeParse(productVariantAttribute.rule).data;

  return {
    quantity: {
      min: rule?.quantity?.min ?? null,
      max: rule?.quantity?.max ?? null,
    },
    participant: {
      min: rule?.participant?.min ?? null,
      max: rule?.participant?.max ?? null,
    },
  };
}

export function parseProductVariant({
  locale,
  timezone,
  productVariant,
}: {
  locale: Locale;
  timezone: Timezone;
  productVariant: Prisma.ProductVariantGetPayload<object>;
}) {
  return {
    id: productVariant.id,
    name: productVariant.name,
    status: z.enum(PRODUCT_VARIANT_STATUSES).parse(productVariant.status),
    price: productVariant.price,
    sku: productVariant.sku,
    stock: productVariant.stock,
    weight: productVariant.weight,
    location: productVariant.location,
    createdAt: productVariant.createdAt,
    updatedAt: productVariant.updatedAt,
    fmt: {
      status: PRODUCT_VARIANT_STATUS_MAP[productVariant.status],
      price: formatMoney(productVariant.price),
      sku: productVariant.sku ?? "-",
      stock: productVariant.stock
        ? formatNumber(productVariant.stock, locale)
        : "-",
      weight: productVariant.weight
        ? formatNumber(productVariant.weight, locale)
        : "-",
      location: productVariant.location ?? "-",
      createdAt: formatDate(
        productVariant.createdAt,
        DATE_FORMAT.NORMAL,
        locale,
        timezone,
      ),
      updatedAt: formatDate(
        productVariant.updatedAt,
        DATE_FORMAT.NORMAL,
        locale,
        timezone,
      ),
    },
  };
}

export function parseDiscount({
  locale,
  timezone,
  discount,
}: {
  locale: Locale;
  timezone: Timezone;
  discount: Prisma.DiscountGetPayload<object>;
}) {
  return {
    id: discount.id,
    name: discount.name,
    level: z.enum(DISCOUNT_LEVELS).parse(discount.level),
    type: z.enum(DISCOUNT_TYPES).parse(discount.type),
    value: discount.value,
    rule: parseDiscountRule({ discount, locale, timezone }),
    createdAt: discount.createdAt,
    updatedAt: discount.updatedAt,
    fmt: {
      level: DISCOUNT_LEVEL_MAP[discount.level],
      type: DISCOUNT_TYPE_MAP[discount.type],
      value:
        discount.type === "percentage"
          ? `${discount.value}%`
          : formatMoney(discount.value),
      createdAt: formatDate(
        discount.createdAt,
        DATE_FORMAT.NORMAL,
        locale,
        timezone,
      ),
      updatedAt: formatDate(
        discount.updatedAt,
        DATE_FORMAT.NORMAL,
        locale,
        timezone,
      ),
    },
  };
}

export function parseDiscountRule({
  discount,
}: {
  locale: Locale;
  timezone: Timezone;
  discount: Prisma.DiscountGetPayload<object>;
}) {
  const rule = z
    .object({
      quantity: z
        .object({ min: z.number().nullish(), max: z.number().nullish() })
        .nullish(),
    })
    .safeParse(discount.rule).data;

  return {
    quantity: {
      min: rule?.quantity?.min ?? null,
      max: rule?.quantity?.max ?? null,
    },
  };
}
