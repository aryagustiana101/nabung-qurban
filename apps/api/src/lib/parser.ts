import { type Locale, type Timezone, computeDiscount } from "@repo/common";
import {
  type Prisma,
  parseDiscount,
  parseProduct,
  parseProductCategory,
  parseProductVariant,
  parseProductVariantAttribute,
  parseService,
  type parseToken,
  parseUser,
  parseUserAccount,
} from "@repo/database";

export type UserRecord = ReturnType<typeof parseUser>;

export type TokenRecord = ReturnType<typeof parseToken>;

export function parseUserRecord({
  record,
  locale,
  timezone,
  defaultValue,
}: {
  locale: Locale;
  timezone: Timezone;
  defaultValue: { image: string };
  record: Prisma.UserGetPayload<{ include: { userAccounts: true } }>;
}) {
  const user = parseUser({ user: record, locale, timezone, defaultValue });

  return {
    id: user.id,
    name: user.name,
    phoneNumber: user.phoneNumber,
    email: user.email,
    status: user.status,
    type: user.type,
    username: user.username,
    password: user.password,
    image: user.image,
    verifiedAt: user.verifiedAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    fmt: user.fmt,
    accounts: record.userAccounts.map((userAccount) => {
      return parseUserAccount({ userAccount, locale, timezone });
    }),
  };
}

export function parseProductRecord({
  record,
  locale,
  timezone,
}: {
  locale: Locale;
  timezone: Timezone;
  record: Prisma.ProductGetPayload<{
    include: {
      productServices: { include: { service: true } };
      productCategoryEntries: { include: { productCategory: true } };
      productVariants: {
        include: {
          productVariantDiscounts: { include: { discount: true } };
          productVariantAttributeEntries: {
            include: { productVariantAttribute: true };
          };
        };
      };
    };
  }>;
}) {
  const product = parseProduct({ locale, timezone, product: record });

  return {
    id: product.id,
    name: product.name,
    status: product.status,
    thumbnail: product.thumbnail,
    images: product.images,
    attributes: product.attributes,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    fmt: product.fmt,
    services: record.productServices.map((productService) => {
      return parseService({
        locale,
        timezone,
        service: productService.service,
      });
    }),
    categories: record.productCategoryEntries.map((productCategoryEntry) => {
      return parseProductCategory({
        locale,
        timezone,
        productCategory: productCategoryEntry.productCategory,
      });
    }),
    variants: record.productVariants.map((productVariant) => {
      return parseProductVariantRecord({
        locale,
        timezone,
        record: productVariant,
      });
    }),
  };
}

export function parseProductVariantRecord({
  record,
  locale,
  timezone,
}: {
  locale: Locale;
  timezone: Timezone;
  record: Prisma.ProductVariantGetPayload<{
    include: {
      productVariantDiscounts: { include: { discount: true } };
      productVariantAttributeEntries: {
        include: { productVariantAttribute: true };
      };
    };
  }>;
}) {
  const productVariant = parseProductVariant({
    locale,
    timezone,
    productVariant: record,
  });

  const _discount = record.productVariantDiscounts[0]?.discount;
  const discount = _discount
    ? parseDiscount({ discount: _discount, locale, timezone })
    : null;

  return {
    id: productVariant.id,
    name: productVariant.name,
    status: productVariant.status,
    price: productVariant.price,
    sku: productVariant.sku,
    stock: productVariant.stock,
    weight: productVariant.weight,
    location: productVariant.location,
    createdAt: productVariant.createdAt,
    updatedAt: productVariant.updatedAt,
    fmt: productVariant.fmt,
    calculated: computeDiscount({ price: productVariant.price, discount }),
    discount,
    attributes: record.productVariantAttributeEntries.map(
      (productVariantAttributeEntry) => {
        return parseProductVariantAttribute({
          locale,
          timezone,
          productVariantAttribute:
            productVariantAttributeEntry.productVariantAttribute,
        });
      },
    ),
  };
}
