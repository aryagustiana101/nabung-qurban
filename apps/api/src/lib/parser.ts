import { type Locale, type Timezone, computeDiscount } from "@repo/common";
import {
  type Prisma,
  parseAttribute,
  parseCategory,
  parseDiscount,
  parseEntrant,
  parseProduct,
  parseProductInventory,
  parseProductVariant,
  parseService,
  parseUser,
  parseUserAccount,
  parseUserAccountReferral,
  parseUserApplication,
  parseUserApplicationHistory,
  parseWarehouse,
} from "@repo/database";
import { env } from "~/env";

export type UserRecord = ReturnType<typeof parseUserRecord>;

export function parseUserRecord({
  record,
  locale,
  timezone,
  defaultValue,
}: {
  locale: Locale;
  timezone: Timezone;
  defaultValue: { image: string };
  record: Prisma.UserGetPayload<{
    include: {
      userAccounts: {
        include: {
          userAccountReferrals: true;
          userAccountApplication: { include: { userApplication: true } };
        };
      };
    };
  }>;
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
      const account = parseUserAccount({
        locale,
        timezone,
        userAccount,
      });

      const userApplication =
        userAccount?.userAccountApplication?.userApplication;

      return {
        id: account.id,
        type: account.type,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
        fmt: account.fmt,
        application: userApplication
          ? parseUserApplication({ locale, timezone, userApplication })
          : null,
        referrals: userAccount.userAccountReferrals.map(
          (userAccountReferral) => {
            const referral = parseUserAccountReferral({
              locale,
              timezone,
              userAccountReferral: userAccountReferral,
            });

            return {
              id: referral.id,
              code: referral.code,
              status: referral.status,
              createdAt: referral.createdAt,
              updatedAt: referral.updatedAt,
              fmt: {
                url: `${env.WEB_PUBLIC_URL}/register?ref=${referral.code}`,
                status: referral.fmt.status,
                createdAt: referral.fmt.createdAt,
                updatedAt: referral.fmt.updatedAt,
              },
            };
          },
        ),
      };
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
      productInventories: true;
      productEntrants: { include: { entrant: true } };
      productServices: { include: { service: true } };
      productCategories: { include: { category: true } };
      productWarehouses: { include: { warehouse: true } };
      productVariants: {
        include: {
          productVariantDiscounts: { include: { discount: true } };
          productVariantAttributes: { include: { attribute: true } };
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
    categories: record.productCategories.map((productCategory) => {
      return parseCategory({
        locale,
        timezone,
        category: productCategory.category,
      });
    }),
    inventories: record.productInventories.map((productInventory) => {
      return parseProductInventory({ locale, timezone, productInventory });
    }),
    warehouses: record.productWarehouses.map((productWarehouse) => {
      return parseWarehouse({
        locale,
        timezone,
        warehouse: productWarehouse.warehouse,
      });
    }),
    entrants: record.productEntrants.map((productEntrant) => {
      return parseEntrant({
        locale,
        timezone,
        entrant: productEntrant.entrant,
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
      productVariantAttributes: { include: { attribute: true } };
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
    createdAt: productVariant.createdAt,
    updatedAt: productVariant.updatedAt,
    fmt: productVariant.fmt,
    calculated: computeDiscount({ price: productVariant.price, discount }),
    discount,
    attributes: record.productVariantAttributes.map(
      (productVariantAttribute) => {
        return parseAttribute({
          locale,
          timezone,
          attribute: productVariantAttribute.attribute,
        });
      },
    ),
  };
}

export function parseUserApplicationRecord({
  record,
  locale,
  timezone,
}: {
  locale: Locale;
  timezone: Timezone;
  record: Prisma.UserApplicationGetPayload<{
    include: { userApplicationHistories: true };
  }>;
}) {
  const userApplication = parseUserApplication({
    locale,
    timezone,
    userApplication: record,
  });

  return {
    id: userApplication.id,
    type: userApplication.type,
    level: userApplication.level,
    status: userApplication.status,
    individual: userApplication.individual,
    institution: userApplication.institution,
    bank: userApplication.bank,
    jacket: userApplication.jacket,
    vehicle: userApplication.vehicle,
    remark: userApplication.remark,
    createdAt: userApplication.createdAt,
    updatedAt: userApplication.updatedAt,
    fmt: userApplication.fmt,
    histories: record.userApplicationHistories.map((userApplicationHistory) => {
      return parseUserApplicationHistory({
        locale,
        timezone,
        userApplicationHistory,
      });
    }),
  };
}
