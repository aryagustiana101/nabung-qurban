import {
  COUPON_PRODUCT_ATTRIBUTES,
  LIVESTOCK_PRODUCT_ATTRIBUTES,
  PRODUCT_VARIANT_RULES_YEARS,
} from "@repo/common";
import { type Prisma, PrismaClient } from "@repo/database/client";
import { env } from "@repo/database/env";
import { addMonths } from "date-fns";

const db = new PrismaClient({
  log: ["error"],
  datasources: { db: { url: env.DATABASE_URL } },
  transactionOptions: { maxWait: 10_000, timeout: 20_000 },
});

async function main() {
  const users: Prisma.UserCreateManyInput[] = [
    {
      id: 1,
      name: "Admin",
      type: "internal",
      username: "root",
      status: "active",
      verifiedAt: new Date(),
      password: env.DB_SEED_ROOT_PASSWORD,
      phoneNumber: env.DB_SEED_USER_PHONE_NUMBER,
    },
    {
      id: 2,
      type: "external",
      status: "active",
      verifiedAt: new Date(),
      name: env.DB_SEED_USER_NAME,
      email: env.DB_SEED_USER_EMAIL,
      password: env.DB_SEED_USER_PASSWORD,
      username: env.DB_SEED_USER_USERNAME,
      phoneNumber: env.DB_SEED_USER_PHONE_NUMBER,
    },
  ];

  const userAccounts: Prisma.UserAccountCreateManyInput[] = [
    { id: 1, userId: 2, type: "shohibul_qurban" },
    { id: 2, userId: 2, type: "pejuang_qurban" },
    { id: 3, userId: 2, type: "antar_qurban" },
  ];

  const userApplications: Prisma.UserApplicationCreateManyInput[] = [
    {
      id: 1,
      userId: 2,
      code: "000000000000",
      status: "approved",
      level: "individual",
      type: "pejuang_qurban",
      name: env.DB_SEED_USER_NAME,
      phoneNumber: env.DB_SEED_USER_PHONE_NUMBER,
      email: env.DB_SEED_USER_EMAIL,
      address: env.DB_SEED_USER_ADDRESS,
      bankName: "Bank BCA",
      bankAccountNumber: "1234567890",
      jacketSize: "3XL",
      jacketPickupMethod: "delivery",
      jacketPaymentMethod: "payment_gateway",
      identityCardImage:
        "https://nabung-qurban.sgp1.vultrobjects.com/static/placeholder.png",
      selfieImage:
        "https://nabung-qurban.sgp1.vultrobjects.com/static/placeholder.png",
      institutionName: "",
      institutionDeedEstablishment: "",
      institutionOfficeImage: "",
      vehiclePlateNumber: "",
      vehicleFleetType: "",
      vehicleCarryingWeight: 0,
      vehicleRegistrationImage: "",
      remark: null,
    },
    {
      id: 2,
      userId: 2,
      code: "000000000001",
      status: "approved",
      level: "individual",
      type: "antar_qurban",
      name: env.DB_SEED_USER_NAME,
      phoneNumber: env.DB_SEED_USER_PHONE_NUMBER,
      email: env.DB_SEED_USER_EMAIL,
      address: env.DB_SEED_USER_ADDRESS,
      bankName: "",
      bankAccountNumber: "",
      jacketSize: "3XL",
      jacketPickupMethod: "pickup",
      jacketPaymentMethod: "cash_on_delivery",
      identityCardImage:
        "https://nabung-qurban.sgp1.vultrobjects.com/static/placeholder.png",
      selfieImage:
        "https://nabung-qurban.sgp1.vultrobjects.com/static/placeholder.png",
      institutionName: "",
      institutionDeedEstablishment: "",
      institutionOfficeImage: "",
      vehiclePlateNumber: "B 1001 ZZZ",
      vehicleFleetType: "Truck",
      vehicleCarryingWeight: 1200,
      vehicleRegistrationImage:
        "https://nabung-qurban.sgp1.vultrobjects.com/static/placeholder.png",
      remark: null,
    },
  ];

  const userApplicationHistories: Prisma.UserApplicationHistoryCreateManyInput[] =
    [
      {
        id: 1,
        status: "pending",
        userApplicationId: 1,
        createdAt: new Date(2025, 2, 1),
      },
      {
        id: 2,
        status: "process",
        userApplicationId: 1,
        createdAt: new Date(2025, 2, 2),
      },
      {
        id: 3,
        status: "approved",
        userApplicationId: 1,
        createdAt: new Date(2025, 2, 3),
      },
      {
        id: 4,
        status: "pending",
        userApplicationId: 2,
        createdAt: new Date(2025, 3, 1),
      },
      {
        id: 5,
        status: "process",
        userApplicationId: 2,
        createdAt: new Date(2025, 3, 2),
      },
      {
        id: 6,
        status: "approved",
        userApplicationId: 2,
        createdAt: new Date(2025, 3, 3),
      },
    ];

  const userAccountApplications: Prisma.UserAccountApplicationCreateManyInput[] =
    [
      { id: 1, userAccountId: 2, userApplicationId: 1 },
      { id: 2, userAccountId: 3, userApplicationId: 2 },
    ];

  const userAccountReferrals: Prisma.UserAccountReferralCreateManyInput[] = [
    {
      id: 1,
      code: "00000000",
      status: "active",
      userAccountId: 2,
    },
  ];

  const tokens: Prisma.TokenCreateManyInput[] = [
    {
      id: 1,
      abilities: [],
      key: env.DB_SEED_USER_TOKEN_KEY,
      expiredAt: addMonths(new Date(), 12),
      secret: env.DB_SEED_USER_TOKEN_SECRET,
    },
  ];

  const userTokens: Prisma.UserTokenCreateManyInput[] = [
    { id: 1, tokenId: 1, userId: 2 },
  ];

  const userAddresses: Prisma.UserAddressCreateManyInput[] = [
    {
      id: 1,
      userId: 2,
      type: "main",
      name: "Home",
      note: "Family home",
      contactName: env.DB_SEED_USER_NAME,
      contactPhoneNumber: env.DB_SEED_USER_PHONE_NUMBER,
      detail:
        "KP. Waluran Lebak, RT.01/RW.05, Sukalaksana, Kec. Samarang, Kabupaten Garut, Jawa Barat 44161",
      location: {
        name: "Warung Teh Sri",
        detail:
          "KP. Waluran Lebak, RT.01/RW.05, Sukalaksana, Kec. Samarang, Kabupaten Garut, Jawa Barat 44161",
        coordinates: {
          latitude: "-7.208804454103096",
          longitude: "107.81188569325376",
        },
      },
    },
    {
      id: 2,
      userId: 2,
      name: "Apartment",
      type: "alternative",
      note: "Secondary place",
      contactName: env.DB_SEED_USER_NAME,
      contactPhoneNumber: env.DB_SEED_USER_PHONE_NUMBER,
      detail:
        "Jl. Cibiru Indah No.4, Cibiru Wetan, Kec. Cileunyi, Kabupaten Bandung, Jawa Barat 40625",
      location: {
        name: "Kost Pondok Priangan 2 / Tipe B",
        detail:
          "Jl. Cibiru Indah No.4, Cibiru Wetan, Kec. Cileunyi, Kabupaten Bandung, Jawa Barat 40625",
        coordinates: {
          latitude: "-6.9385845988586645",
          longitude: "107.72529316722083",
        },
      },
    },
  ];

  const services: Prisma.ServiceCreateManyInput[] = [
    {
      id: 1,
      scopes: [],
      status: "active",
      description: null,
      level: "alternative",
      code: "daftar-antar-qurban",
      name: "Daftar Antar Qurban",
      image:
        "https://nabung-qurban.sgp1.vultrobjects.com/static/daftar-antar-qurban-icon.png",
    },
    {
      id: 2,
      scopes: [],
      status: "active",
      description: null,
      level: "alternative",
      code: "daftar-pejuang-qurban",
      name: "Daftar Pejuang Qurban",
      image:
        "https://nabung-qurban.sgp1.vultrobjects.com/static/daftar-pejuang-qurban-icon.png",
    },
    {
      id: 3,
      scopes: [],
      code: "ppob",
      name: "PPOB",
      level: "main",
      description: null,
      status: "inactive",
      image: "https://nabung-qurban.sgp1.vultrobjects.com/static/ppob-icon.png",
    },
    {
      id: 4,
      level: "main",
      status: "active",
      scopes: ["livestock"],
      code: "cicilan-qurban",
      name: "Cicilan Qurban",
      description:
        "Pembelian Qurban yang dibayarkan secara cicllan dan Qurban dikirimkan ke Anda",
      image:
        "https://nabung-qurban.sgp1.vultrobjects.com/static/cicilan-qurban-icon.png",
    },
    {
      id: 5,
      level: "main",
      status: "active",
      scopes: ["livestock"],
      code: "beli-qurban-tunai",
      name: "Beli Qurban Tunai",
      description:
        "Pembelian Qurban yang dibayarkan secara tunai dan Qurban dikirimkan ke Anda",
      image:
        "https://nabung-qurban.sgp1.vultrobjects.com/static/beli-qurban-tunai-icon.png",
    },
    {
      id: 6,
      level: "main",
      status: "active",
      scopes: ["coupon"],
      code: "tebar-qurban-voucher-cicilan",
      name: "Tebar Qurban Voucher Cicilan",
      description: null,
      image:
        "https://nabung-qurban.sgp1.vultrobjects.com/static/tebar-qurban-voucher-cicilan-icon.png",
    },
    {
      id: 7,
      level: "main",
      status: "active",
      scopes: ["coupon"],
      code: "tebar-qurban-voucher-beli",
      name: "Tebar Qurban Voucher Beli",
      description: null,
      image:
        "https://nabung-qurban.sgp1.vultrobjects.com/static/tebar-qurban-voucher-beli-icon.png",
    },
    {
      id: 8,
      level: "main",
      status: "active",
      scopes: ["livestock"],
      code: "tebar-qurban-cicilan",
      name: "Tebar Qurban Cicilan",
      description:
        "Pembelian Qurban yang dibayarkan secara cicllan dan Qurban didistribusikan oleh NQ",
      image:
        "https://nabung-qurban.sgp1.vultrobjects.com/static/tebar-qurban-cicilan-icon.png",
    },
    {
      id: 9,
      level: "main",
      status: "active",
      scopes: ["livestock"],
      code: "tebar-qurban-pembelian",
      name: "Tebar Qurban Pembelian",
      description:
        "Pembelian Qurban yang dibayarkan secara tunai dan Qurban didistribusIkan oleh NQ",
      image:
        "https://nabung-qurban.sgp1.vultrobjects.com/static/tebar-qurban-pembelian-icon.png",
    },
  ];

  const categories: Prisma.CategoryCreateManyInput[] = [
    { id: 1, code: "domba", name: "Domba" },
    { id: 2, code: "unta", name: "Unta" },
    { id: 3, code: "kambing", name: "Kambing" },
    { id: 4, code: "sapi", name: "Sapi" },
  ];

  const products: Prisma.ProductCreateManyInput[] = [
    {
      id: 1,
      scope: "livestock",
      status: "published",
      name: "Sapi premium 450 Kg",
      attributes: LIVESTOCK_PRODUCT_ATTRIBUTES,
      thumbnail:
        "https://nabung-qurban.sgp1.vultrobjects.com/mock/product-4-thumbnail.png",
      images: [
        "https://nabung-qurban.sgp1.vultrobjects.com/mock/product-4-image-1.png",
        "https://nabung-qurban.sgp1.vultrobjects.com/mock/product-4-image-2.png",
        "https://nabung-qurban.sgp1.vultrobjects.com/mock/product-4-image-3.png",
      ],
    },
    {
      id: 2,
      scope: "livestock",
      status: "published",
      name: "Kambing premium 40 Kg",
      attributes: LIVESTOCK_PRODUCT_ATTRIBUTES,
      thumbnail:
        "https://nabung-qurban.sgp1.vultrobjects.com/mock/product-3-thumbnail.png",
      images: [
        "https://nabung-qurban.sgp1.vultrobjects.com/mock/product-3-image-1.png",
        "https://nabung-qurban.sgp1.vultrobjects.com/mock/product-3-image-2.png",
        "https://nabung-qurban.sgp1.vultrobjects.com/mock/product-3-image-3.png",
      ],
    },
    {
      id: 3,
      scope: "livestock",
      status: "published",
      name: "Sapi Bali premium super 700 Kg",
      attributes: LIVESTOCK_PRODUCT_ATTRIBUTES,
      thumbnail:
        "https://nabung-qurban.sgp1.vultrobjects.com/mock/product-2-thumbnail.png",
      images: [
        "https://nabung-qurban.sgp1.vultrobjects.com/mock/product-2-image-1.png",
        "https://nabung-qurban.sgp1.vultrobjects.com/mock/product-2-image-2.png",
        "https://nabung-qurban.sgp1.vultrobjects.com/mock/product-2-image-3.png",
      ],
    },
    {
      id: 4,
      scope: "livestock",
      status: "published",
      name: "Sapi Bali premium super 280 Kg",
      attributes: LIVESTOCK_PRODUCT_ATTRIBUTES,
      thumbnail:
        "https://nabung-qurban.sgp1.vultrobjects.com/mock/product-1-thumbnail.png",
      images: [
        "https://nabung-qurban.sgp1.vultrobjects.com/mock/product-1-image-1.png",
        "https://nabung-qurban.sgp1.vultrobjects.com/mock/product-1-image-2.png",
        "https://nabung-qurban.sgp1.vultrobjects.com/mock/product-1-image-3.png",
      ],
    },
    {
      id: 5,
      scope: "coupon",
      status: "published",
      name: "Voucher Kambing",
      attributes: COUPON_PRODUCT_ATTRIBUTES,
      thumbnail:
        "https://nabung-qurban.sgp1.vultrobjects.com/mock/product-6-thumbnail.png",
      images: [
        "https://nabung-qurban.sgp1.vultrobjects.com/mock/product-6-image-1.png",
      ],
    },
    {
      id: 6,
      scope: "coupon",
      status: "published",
      name: "Voucher Qurban 1/7 Sapi",
      attributes: COUPON_PRODUCT_ATTRIBUTES,
      thumbnail:
        "https://nabung-qurban.sgp1.vultrobjects.com/mock/product-5-thumbnail.png",
      images: [
        "https://nabung-qurban.sgp1.vultrobjects.com/mock/product-5-image-1.png",
      ],
    },
  ];

  const productServices: Prisma.ProductServiceCreateManyInput[] = [
    { id: 1, serviceId: 5, productId: 1 },
    { id: 2, serviceId: 4, productId: 1 },
    { id: 3, serviceId: 9, productId: 1 },
    { id: 4, serviceId: 8, productId: 1 },
    { id: 5, serviceId: 5, productId: 2 },
    { id: 6, serviceId: 4, productId: 2 },
    { id: 7, serviceId: 9, productId: 2 },
    { id: 8, serviceId: 8, productId: 2 },
    { id: 9, serviceId: 5, productId: 3 },
    { id: 10, serviceId: 4, productId: 3 },
    { id: 11, serviceId: 9, productId: 3 },
    { id: 12, serviceId: 8, productId: 3 },
    { id: 13, serviceId: 5, productId: 4 },
    { id: 14, serviceId: 4, productId: 4 },
    { id: 15, serviceId: 9, productId: 4 },
    { id: 16, serviceId: 8, productId: 4 },
    { id: 17, serviceId: 7, productId: 5 },
    { id: 18, serviceId: 6, productId: 5 },
    { id: 19, serviceId: 7, productId: 6 },
    { id: 20, serviceId: 6, productId: 6 },
  ];

  const productCategories: Prisma.ProductCategoryCreateManyInput[] = [
    { id: 1, productId: 1, categoryId: 4 },
    { id: 2, productId: 2, categoryId: 4 },
    { id: 3, productId: 3, categoryId: 3 },
    { id: 4, productId: 4, categoryId: 4 },
    { id: 5, productId: 5, categoryId: 3 },
    { id: 6, productId: 6, categoryId: 4 },
  ];

  const attributes: Prisma.AttributeCreateManyInput[] = [
    {
      id: 1,
      code: "1-domba",
      name: "1 Domba",
      status: "active",
      scopes: ["livestock"],
      label: "Jenis Hewan Qurban",
      rule: {
        quantity: { min: 1, max: null },
        participant: { min: 1, max: null },
      },
    },
    {
      id: 2,
      code: "1-unta",
      name: "1 Unta",
      status: "active",
      scopes: ["livestock"],
      label: "Jenis Hewan Qurban",
      rule: {
        quantity: { min: 1, max: null },
        participant: { min: 1, max: null },
      },
    },
    {
      id: 3,
      code: "1-7-unta",
      name: "1/7 Unta",
      status: "active",
      scopes: ["livestock"],
      label: "Jenis Hewan Qurban",
      rule: { quantity: { min: 1, max: 1 }, participant: { min: 7, max: 7 } },
    },
    {
      id: 4,
      status: "active",
      code: "1-10-unta",
      name: "1/10 Unta",
      scopes: ["livestock"],
      label: "Jenis Hewan Qurban",
      rule: {
        quantity: { min: 1, max: 1 },
        participant: { min: 10, max: 10 },
      },
    },
    {
      id: 5,
      status: "active",
      code: "1-kambing",
      name: "1 Kambing",
      scopes: ["livestock"],
      label: "Jenis Hewan Qurban",
      rule: {
        quantity: { min: 1, max: null },
        participant: { min: 1, max: null },
      },
    },
    {
      id: 6,
      code: "1-sapi",
      name: "1 Sapi",
      status: "active",
      scopes: ["livestock"],
      label: "Jenis Hewan Qurban",
      rule: {
        quantity: { min: 1, max: null },
        participant: { min: 1, max: null },
      },
    },
    {
      id: 7,
      status: "active",
      code: "1-7-sapi",
      name: "1/7 Sapi",
      scopes: ["livestock"],
      label: "Jenis Hewan Qurban",
      rule: { quantity: { min: 1, max: 1 }, participant: { min: 7, max: 7 } },
    },
    {
      id: 8,
      status: "active",
      scopes: ["coupon"],
      code: "1446-H-2025",
      name: "1446 H/2025",
      label: "Tahun Qurban",
      rule: {
        quantity: { min: 1, max: null },
        participant: { min: 1, max: null },
      },
    },
    {
      id: 9,
      status: "active",
      scopes: ["coupon"],
      code: "1447-H-2026",
      name: "1447 H/2026",
      label: "Tahun Qurban",
      rule: {
        quantity: { min: 1, max: null },
        participant: { min: 1, max: null },
      },
    },
    {
      id: 10,
      status: "active",
      scopes: ["coupon"],
      code: "1448-H-2027",
      name: "1448 H/2027",
      label: "Tahun Qurban",
      rule: {
        quantity: { min: 1, max: null },
        participant: { min: 1, max: null },
      },
    },
  ];

  const productVariants: Prisma.ProductVariantCreateManyInput[] = [
    {
      id: 1,
      productId: 1,
      status: "active",
      price: 30_000_000,
      name: "1446 H/2025",
      label: "Tahun Qurban",
      rule: { year: PRODUCT_VARIANT_RULES_YEARS[0] },
    },
    {
      id: 2,
      productId: 2,
      status: "active",
      price: 5_000_000,
      name: "1446 H/2025",
      label: "Tahun Qurban",
      rule: { year: PRODUCT_VARIANT_RULES_YEARS[0] },
    },
    {
      id: 3,
      productId: 2,
      status: "active",
      price: 4_000_000,
      name: "1447 H/2026",
      label: "Tahun Qurban",
      rule: { year: PRODUCT_VARIANT_RULES_YEARS[1] },
    },
    {
      id: 4,
      productId: 3,
      status: "active",
      price: 70_000_000,
      name: "1446 H/2025",
      label: "Tahun Qurban",
      rule: { year: PRODUCT_VARIANT_RULES_YEARS[0] },
    },
    {
      id: 5,
      productId: 3,
      status: "active",
      price: 65_000_000,
      name: "1447 H/2026",
      label: "Tahun Qurban",
      rule: { year: PRODUCT_VARIANT_RULES_YEARS[1] },
    },
    {
      id: 6,
      productId: 3,
      status: "active",
      price: 55_000_000,
      name: "1448 H/2027",
      label: "Tahun Qurban",
      rule: { year: PRODUCT_VARIANT_RULES_YEARS[2] },
    },
    {
      id: 7,
      productId: 4,
      status: "active",
      price: 25_000_000,
      name: "1446 H/2025",
      label: "Tahun Qurban",
      rule: { year: PRODUCT_VARIANT_RULES_YEARS[0] },
    },
    {
      id: 8,
      productId: 4,
      status: "active",
      price: 20_000_000,
      name: "1447 H/2026",
      label: "Tahun Qurban",
      rule: { year: PRODUCT_VARIANT_RULES_YEARS[1] },
    },
    {
      id: 9,
      productId: 5,
      status: "active",
      price: 1_300_000,
      name: "Kambing tipe 1",
      label: "Jenis Hewan Qurban",
      rule: { year: PRODUCT_VARIANT_RULES_YEARS[0] },
    },
    {
      id: 10,
      productId: 5,
      status: "active",
      price: 1_500_000,
      name: "Kambing tipe 2",
      label: "Jenis Hewan Qurban",
      rule: { year: PRODUCT_VARIANT_RULES_YEARS[0] },
    },
    {
      id: 11,
      productId: 6,
      status: "active",
      price: 3_600_000,
      name: "Sapi tipe 1",
      label: "Jenis Hewan Qurban",
      rule: { year: PRODUCT_VARIANT_RULES_YEARS[0] },
    },
    {
      id: 12,
      productId: 6,
      status: "active",
      price: 3_400_000,
      name: "Sapi tipe 2",
      label: "Jenis Hewan Qurban",
      rule: { year: PRODUCT_VARIANT_RULES_YEARS[0] },
    },
    {
      id: 13,
      productId: 6,
      status: "active",
      price: 2_600_000,
      name: "Sapi tipe 3",
      label: "Jenis Hewan Qurban",
      rule: { year: PRODUCT_VARIANT_RULES_YEARS[0] },
    },
    {
      id: 14,
      productId: 6,
      status: "active",
      price: 2_400_000,
      name: "Sapi tipe 4",
      label: "Jenis Hewan Qurban",
      rule: { year: PRODUCT_VARIANT_RULES_YEARS[0] },
    },
  ];

  const productVariantAttributes: Prisma.ProductVariantAttributeCreateManyInput[] =
    [
      { id: 1, productVariantId: 1, attributeId: 6 },
      { id: 2, productVariantId: 1, attributeId: 7 },
      { id: 3, productVariantId: 2, attributeId: 5 },
      { id: 4, productVariantId: 3, attributeId: 5 },
      { id: 5, productVariantId: 4, attributeId: 6 },
      { id: 6, productVariantId: 4, attributeId: 7 },
      { id: 7, productVariantId: 5, attributeId: 6 },
      { id: 8, productVariantId: 5, attributeId: 7 },
      { id: 9, productVariantId: 6, attributeId: 6 },
      { id: 10, productVariantId: 6, attributeId: 7 },
      { id: 11, productVariantId: 7, attributeId: 6 },
      { id: 12, productVariantId: 7, attributeId: 7 },
      { id: 13, productVariantId: 8, attributeId: 6 },
      { id: 14, productVariantId: 8, attributeId: 7 },
      { id: 15, productVariantId: 9, attributeId: 8 },
      { id: 16, productVariantId: 9, attributeId: 9 },
      { id: 17, productVariantId: 10, attributeId: 8 },
      { id: 18, productVariantId: 10, attributeId: 9 },
      { id: 19, productVariantId: 11, attributeId: 8 },
      { id: 20, productVariantId: 11, attributeId: 9 },
      { id: 21, productVariantId: 11, attributeId: 10 },
      { id: 22, productVariantId: 12, attributeId: 8 },
      { id: 23, productVariantId: 12, attributeId: 9 },
      { id: 24, productVariantId: 12, attributeId: 10 },
      { id: 25, productVariantId: 13, attributeId: 8 },
      { id: 26, productVariantId: 13, attributeId: 9 },
      { id: 27, productVariantId: 14, attributeId: 8 },
      { id: 28, productVariantId: 14, attributeId: 9 },
    ];

  const discounts: Prisma.DiscountCreateManyInput[] = [
    {
      id: 1,
      type: "flat",
      value: 500_000,
      name: "500k Off",
      level: "product_variant",
      rule: { quantity: { min: 1, max: null } },
    },
    {
      id: 2,
      value: 10,
      name: "10% Off",
      type: "percentage",
      level: "product_variant",
      rule: { quantity: { min: 1, max: null } },
    },
    {
      id: 3,
      value: 20,
      name: "20% Off",
      type: "percentage",
      level: "product_variant",
      rule: { quantity: { min: 1, max: null } },
    },
    {
      id: 4,
      value: 30,
      name: "30% Off",
      type: "percentage",
      level: "product_variant",
      rule: { quantity: { min: 1, max: null } },
    },
  ];

  const productVariantDiscounts: Prisma.ProductVariantDiscountCreateManyInput[] =
    [
      { id: 1, discountId: 2, productVariantId: 1 },
      { id: 2, discountId: 1, productVariantId: 2 },
      { id: 3, discountId: 1, productVariantId: 3 },
      { id: 4, discountId: 4, productVariantId: 4 },
      { id: 5, discountId: 3, productVariantId: 7 },
      { id: 6, discountId: 3, productVariantId: 8 },
      { id: 7, discountId: 3, productVariantId: 9 },
      { id: 8, discountId: 3, productVariantId: 10 },
      { id: 9, discountId: 4, productVariantId: 11 },
      { id: 10, discountId: 3, productVariantId: 13 },
    ];

  const productInventories: Prisma.ProductInventoryCreateManyInput[] = [
    {
      id: 1,
      sku: "",
      stock: 0,
      weight: 450,
      productId: 1,
      tracker: "inactive",
    },
    {
      id: 2,
      sku: "",
      stock: 0,
      weight: 40,
      productId: 2,
      tracker: "inactive",
    },
    {
      id: 3,
      sku: "",
      stock: 0,
      weight: 700,
      productId: 3,
      tracker: "inactive",
    },
    {
      id: 4,
      sku: "",
      stock: 0,
      weight: 280,
      productId: 4,
      tracker: "inactive",
    },
    {
      id: 5,
      sku: "",
      stock: 0,
      weight: 40,
      productId: 5,
      tracker: "inactive",
    },
    {
      id: 6,
      sku: "",
      stock: 0,
      weight: 700,
      productId: 6,
      tracker: "inactive",
    },
  ];

  const warehouses: Prisma.WarehouseCreateManyInput[] = [
    {
      id: 1,
      status: "active",
      postalCode: "40791",
      district: "Lembang",
      province: "Jawa Barat",
      code: "kandang-nq-lembang",
      name: "Kandang NQ Lembang",
      city: "Kabupaten Bandung Barat",
      address:
        "Jalan Raya Lembang Nomor 165, Gudangkahuripan, Lembang, Kabupaten Bandung Barat, Jawa Barat",
    },
    {
      id: 2,
      status: "active",
      postalCode: "12920",
      district: "Setiabudi",
      code: "kandang-nq-jakarta",
      name: "Kandang NQ Jakarta",
      city: "Kota Jakarta Selatan",
      province: "Daerah Khusus Ibukota Jakarta",
      address:
        "Gedung Wira Usaha, Jl. H. R. Rasuna Said No.Kav.C Lantai 1 Unit 104, RW.5, Karet, Kecamatan Setiabudi, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12920",
    },
    {
      id: 3,
      status: "active",
      province: "Bali",
      postalCode: "80361",
      district: "Kuta Utara",
      code: "kandang-nq-bali",
      name: "Kandang NQ Bali",
      city: "Kabupaten Badung",
      address:
        "Jl. Pantai Berawa No.88, Tibubeneng, Kec. Kuta Utara, Kabupaten Badung, Bali 80361",
    },
  ];

  const productWarehouses: Prisma.ProductWarehouseCreateManyInput[] = [
    { id: 1, productId: 1, warehouseId: 1 },
    { id: 2, productId: 2, warehouseId: 1 },
    { id: 3, productId: 3, warehouseId: 2 },
    { id: 4, productId: 4, warehouseId: 3 },
    { id: 5, productId: 5, warehouseId: 2 },
    { id: 6, productId: 6, warehouseId: 3 },
  ];

  const entrants: Prisma.EntrantCreateManyInput[] = [
    {
      id: 1,
      name: "Lembaga",
      label: "Lembaga",
      code: "institution",
      description:
        "Pembelian oleh lembaga misal masjid, yayasan, dan sejenisnya.",
    },
    {
      id: 2,
      label: "Individu",
      code: "individual",
      name: "Individu/Perseorangan",
      description: "Untuk pembelian oleh  satu atau beberapa individu",
    },
  ];

  const productEntrants: Prisma.ProductEntrantCreateManyInput[] = [
    { id: 1, productId: 1, entrantId: 2 },
    { id: 2, productId: 1, entrantId: 1 },
    { id: 3, productId: 2, entrantId: 2 },
    { id: 4, productId: 2, entrantId: 1 },
    { id: 5, productId: 3, entrantId: 2 },
    { id: 6, productId: 3, entrantId: 1 },
    { id: 7, productId: 4, entrantId: 2 },
    { id: 8, productId: 4, entrantId: 1 },
    { id: 9, productId: 5, entrantId: 2 },
    { id: 10, productId: 5, entrantId: 1 },
    { id: 11, productId: 6, entrantId: 2 },
    { id: 12, productId: 6, entrantId: 1 },
  ];

  const schedules: Prisma.ScheduleCreateManyInput[] = [
    {
      id: 1,
      status: "active",
      label: "13 Mei 2027",
      type: "order_delivery",
      date: new Date(2027, 4, 13),
      options: [
        {
          key: "morning",
          range: "06:00 - 12:00",
          label: "Pagi (06:00 - 12:00)",
        },
        {
          key: "afternoon",
          range: "13:00 - 18:00",
          label: "Siang (13:00 - 18:00)",
        },
        {
          key: "evening",
          range: "19:00 - 24:00",
          label: "Malam (19:00 - 24:00)",
        },
      ],
    },
    {
      id: 2,
      status: "active",
      label: "12 Mei 2027",
      type: "order_delivery",
      date: new Date(2027, 4, 12),
      options: [
        {
          key: "morning",
          range: "06:00 - 12:00",
          label: "Pagi (06:00 - 12:00)",
        },
        {
          key: "afternoon",
          range: "13:00 - 18:00",
          label: "Siang (13:00 - 18:00)",
        },
        {
          key: "evening",
          range: "19:00 - 24:00",
          label: "Malam (19:00 - 24:00)",
        },
      ],
    },
    {
      id: 3,
      status: "active",
      label: "11 Mei 2027",
      type: "order_delivery",
      date: new Date(2027, 4, 11),
      options: [
        {
          key: "morning",
          range: "06:00 - 12:00",
          label: "Pagi (06:00 - 12:00)",
        },
        {
          key: "afternoon",
          range: "13:00 - 18:00",
          label: "Siang (13:00 - 18:00)",
        },
        {
          key: "evening",
          range: "19:00 - 24:00",
          label: "Malam (19:00 - 24:00)",
        },
      ],
    },
    {
      id: 4,
      status: "active",
      label: "23 Mei 2026",
      type: "order_delivery",
      date: new Date(2026, 4, 23),
      options: [
        {
          key: "morning",
          range: "06:00 - 12:00",
          label: "Pagi (06:00 - 12:00)",
        },
        {
          key: "afternoon",
          range: "13:00 - 18:00",
          label: "Siang (13:00 - 18:00)",
        },
        {
          key: "evening",
          range: "19:00 - 24:00",
          label: "Malam (19:00 - 24:00)",
        },
      ],
    },
    {
      id: 5,
      status: "active",
      label: "22 Mei 2026",
      type: "order_delivery",
      date: new Date(2026, 4, 22),
      options: [
        {
          key: "morning",
          range: "06:00 - 12:00",
          label: "Pagi (06:00 - 12:00)",
        },
        {
          key: "afternoon",
          range: "13:00 - 18:00",
          label: "Siang (13:00 - 18:00)",
        },
        {
          key: "evening",
          range: "19:00 - 24:00",
          label: "Malam (19:00 - 24:00)",
        },
      ],
    },
    {
      id: 6,
      status: "active",
      label: "21 Mei 2026",
      type: "order_delivery",
      date: new Date(2026, 4, 21),
      options: [
        {
          key: "morning",
          range: "06:00 - 12:00",
          label: "Pagi (06:00 - 12:00)",
        },
        {
          key: "afternoon",
          range: "13:00 - 18:00",
          label: "Siang (13:00 - 18:00)",
        },
        {
          key: "evening",
          range: "19:00 - 24:00",
          label: "Malam (19:00 - 24:00)",
        },
      ],
    },
    {
      id: 7,
      status: "active",
      label: "3 Juni 2025",
      type: "order_delivery",
      date: new Date(2025, 5, 3),
      options: [
        {
          key: "morning",
          range: "06:00 - 12:00",
          label: "Pagi (06:00 - 12:00)",
        },
        {
          key: "afternoon",
          range: "13:00 - 18:00",
          label: "Siang (13:00 - 18:00)",
        },
        {
          key: "evening",
          range: "19:00 - 24:00",
          label: "Malam (19:00 - 24:00)",
        },
      ],
    },
    {
      id: 8,
      status: "active",
      label: "2 Juni 2025",
      type: "order_delivery",
      date: new Date(2025, 5, 2),
      options: [
        {
          key: "morning",
          range: "06:00 - 12:00",
          label: "Pagi (06:00 - 12:00)",
        },
        {
          key: "afternoon",
          range: "13:00 - 18:00",
          label: "Siang (13:00 - 18:00)",
        },
        {
          key: "evening",
          range: "19:00 - 24:00",
          label: "Malam (19:00 - 24:00)",
        },
      ],
    },
    {
      id: 9,
      status: "active",
      label: "1 Juni 2025",
      type: "order_delivery",
      date: new Date(2025, 5, 1),
      options: [
        {
          key: "morning",
          range: "06:00 - 12:00",
          label: "Pagi (06:00 - 12:00)",
        },
        {
          key: "afternoon",
          range: "13:00 - 18:00",
          label: "Siang (13:00 - 18:00)",
        },
        {
          key: "evening",
          range: "19:00 - 24:00",
          label: "Malam (19:00 - 24:00)",
        },
      ],
    },
  ];

  const paymentOptions: Prisma.PaymentOptionCreateManyInput[] = [
    {
      id: 1,
      name: "Cicilan",
      code: "instalment",
      rule: {
        initial: {
          default: { value: 15, type: "percentage" },
          terms: [
            {
              attributes: ["1-domba", "1-kambing"],
              quantity: { min: 1, max: 10 },
              min: { value: 15, type: "percentage" },
              max: null,
            },
            {
              attributes: ["1-domba", "1-kambing"],
              quantity: { min: 10, max: null },
              min: { value: 25, type: "percentage" },
              max: null,
            },
            {
              attributes: [
                "1-unta",
                "1-7-unta",
                "1-10-unta",
                "1-sapi",
                "1-7-sapi",
              ],
              quantity: { min: 1, max: 10 },
              min: { value: 20, type: "percentage" },
              max: null,
            },
            {
              attributes: ["1-unta", "1-sapi"],
              quantity: { min: 10, max: null },
              min: { value: 35, type: "percentage" },
              max: null,
            },
          ],
        },
        settelement: {
          terms: [
            {
              attributes: ["1-domba", "1-kambing"],
              quantity: { min: 1, max: 50 },
              min: null,
              max: { day: 7 },
            },
            {
              attributes: ["1-domba", "1-kambing"],
              quantity: { min: 10, max: null },
              min: null,
              max: { day: 14 },
            },
            {
              attributes: [
                "1-unta",
                "1-7-unta",
                "1-10-unta",
                "1-sapi",
                "1-7-sapi",
              ],
              quantity: { min: 1, max: 10 },
              min: null,
              max: { day: 7 },
            },
            {
              attributes: ["1-unta", "1-sapi"],
              quantity: { min: 11, max: 50 },
              min: null,
              max: { day: 14 },
            },
            {
              attributes: ["1-unta", "1-sapi"],
              quantity: { min: 50, max: null },
              min: null,
              max: { day: 21 },
            },
          ],
        },
      },
    },
    {
      id: 2,
      name: "DP dan Pelunasan",
      code: "down_payment_and_settlement",
      rule: {
        initial: {
          default: { value: 15, type: "percentage" },
          terms: [
            {
              attributes: ["1-domba", "1-kambing"],
              quantity: { min: 1, max: 10 },
              min: { value: 15, type: "percentage" },
              max: null,
            },
            {
              attributes: ["1-domba", "1-kambing"],
              quantity: { min: 10, max: null },
              min: { value: 25, type: "percentage" },
              max: null,
            },
            {
              attributes: [
                "1-unta",
                "1-7-unta",
                "1-10-unta",
                "1-sapi",
                "1-7-sapi",
              ],
              quantity: { min: 1, max: 10 },
              min: { value: 20, type: "percentage" },
              max: null,
            },
            {
              attributes: ["1-unta", "1-sapi"],
              quantity: { min: 10, max: null },
              min: { value: 35, type: "percentage" },
              max: null,
            },
          ],
        },
      },
    },
    {
      id: 3,
      code: "full_payment",
      name: "Langsung Lunas",
      rule: {
        settelement: {
          terms: [
            {
              attributes: ["1-domba", "1-kambing"],
              quantity: { min: 1, max: 50 },
              min: null,
              max: { day: 7 },
            },
            {
              attributes: ["1-domba", "1-kambing"],
              quantity: { min: 10, max: null },
              min: null,
              max: { day: 14 },
            },
            {
              attributes: [
                "1-unta",
                "1-7-unta",
                "1-10-unta",
                "1-sapi",
                "1-7-sapi",
              ],
              quantity: { min: 1, max: 10 },
              min: null,
              max: { day: 7 },
            },
            {
              attributes: ["1-unta", "1-sapi"],
              quantity: { min: 11, max: 50 },
              min: null,
              max: { day: 14 },
            },
            {
              attributes: ["1-unta", "1-sapi"],
              quantity: { min: 50, max: null },
              min: null,
              max: { day: 21 },
            },
          ],
        },
      },
    },
  ];

  const result = await db.$transaction(async (trx) => {
    return Promise.all([
      trx.user.createMany({ data: users, skipDuplicates: true }),
      trx.userAccount.createMany({
        data: userAccounts,
        skipDuplicates: true,
      }),
      trx.token.createMany({ data: tokens, skipDuplicates: true }),
      trx.userToken.createMany({ data: userTokens, skipDuplicates: true }),
      trx.userAddress.createMany({
        data: userAddresses,
        skipDuplicates: true,
      }),
      trx.service.createMany({ data: services, skipDuplicates: true }),
      trx.category.createMany({ data: categories, skipDuplicates: true }),
      trx.product.createMany({ data: products, skipDuplicates: true }),
      trx.productService.createMany({
        skipDuplicates: true,
        data: productServices,
      }),
      trx.productCategory.createMany({
        skipDuplicates: true,
        data: productCategories,
      }),
      trx.attribute.createMany({ data: attributes, skipDuplicates: true }),
      trx.productVariant.createMany({
        skipDuplicates: true,
        data: productVariants,
      }),
      trx.productVariantAttribute.createMany({
        skipDuplicates: true,
        data: productVariantAttributes,
      }),
      trx.discount.createMany({ data: discounts, skipDuplicates: true }),
      trx.productVariantDiscount.createMany({
        skipDuplicates: true,
        data: productVariantDiscounts,
      }),
      trx.productInventory.createMany({
        skipDuplicates: true,
        data: productInventories,
      }),
      trx.warehouse.createMany({ data: warehouses, skipDuplicates: true }),
      trx.productWarehouse.createMany({
        skipDuplicates: true,
        data: productWarehouses,
      }),
      trx.entrant.createMany({ data: entrants, skipDuplicates: true }),
      trx.productEntrant.createMany({
        skipDuplicates: true,
        data: productEntrants,
      }),
      trx.schedule.createMany({ data: schedules, skipDuplicates: true }),
      trx.paymentOption.createMany({
        data: paymentOptions,
        skipDuplicates: true,
      }),
      trx.userAccountReferral.createMany({
        skipDuplicates: true,
        data: userAccountReferrals,
      }),
      trx.userApplication.createMany({
        skipDuplicates: true,
        data: userApplications,
      }),
      trx.userAccountApplication.createMany({
        skipDuplicates: true,
        data: userAccountApplications,
      }),
      trx.userApplicationHistory.createMany({
        skipDuplicates: true,
        data: userApplicationHistories,
      }),
    ]);
  });

  console.info(
    `\n🔢 Total inserted ${result.reduce((acc, curr) => acc + curr.count, 0)}`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
    process.exit(0);
  });
