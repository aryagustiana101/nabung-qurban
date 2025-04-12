import type { ProductAttributeKey } from "@repo/common";
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
      name: "Root",
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

  const productAttributes: {
    title: string;
    value: string;
    key: ProductAttributeKey;
  }[] = [
    {
      title: "",
      key: "pricing_info",
      value: "Harga belum termasuk biaya Admin dan pengiriman",
    },
    {
      title: "",
      key: "transaction_info",
      value:
        "Pembayaran Mulai Rp 5.000.000\nMaks. pelunasan H-7 sebelum Idul Adha",
    },
    {
      title: "",
      key: "delivery_info",
      value: "Qurban dikirim H-3",
    },
    {
      title: "",
      key: "additional_info",
      value: "Gambar hewan qurban hanya display",
    },
    {
      key: "detail_product",
      title: "Detail Qurban",
      value:
        "Tahun Qurban dan jenis hewan qurban mempengaruhi harga qurban per-ekornya",
    },
    {
      key: "important_info",
      title: "Informasi Penting",
      value:
        "Untuk pembelian menggunakan DP, pelunasan hanya bisa dilakukan maksimal 90 % (atau sesuai parameter dari NQ), jika  bobot hewan yang didistribusikan lebih berat dari bobot yang dipesan pembeli harus membayar kelebihannya, sedangkan jika kondisi bobot kurang dari bobot pesanan maka  kelebihan pembayaran akan masuk ke saldo shohibul qurban.",
    },
  ];

  const products: Prisma.ProductCreateManyInput[] = [
    {
      id: 1,
      status: "published",
      attributes: productAttributes,
      name: "Sapi premium 450 Kg",
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
      status: "published",
      attributes: productAttributes,
      name: "Kambing premium 40 Kg",
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
      status: "published",
      attributes: productAttributes,
      name: "Sapi Bali premium super 700 Kg",
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
      status: "published",
      attributes: productAttributes,
      name: "Sapi Bali premium super 280 Kg",
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
      status: "published",
      name: "Voucher Kambing",
      thumbnail:
        "https://nabung-qurban.sgp1.vultrobjects.com/mock/product-6-thumbnail.png",
      images: [
        "https://nabung-qurban.sgp1.vultrobjects.com/mock/product-6-image-1.png",
      ],
      attributes: [
        {
          title: "",
          key: "pricing_info",
          value: "Harga belum termasuk biaya Admin",
        },
        {
          title: "",
          key: "transaction_info",
          value: "Maks. pelunasan H-7 sebelum Idul Adha",
        },
        {
          title: "",
          key: "additional_info",
          value: "Gambar hewan qurban hanya display",
        },
        {
          key: "detail_product",
          title: "Detail Voucher Qurban",
          value:
            "Tahun Qurban dan variasi voucher hewan qurban mempengaruhi harga",
        },
        {
          key: "important_info",
          title: "Informasi Penting",
          value:
            "Untuk pembelian menggunakan DP, pelunasan hanya bisa dilakukan maksimal 90 % (atau sesuai parameter dari NQ), jika  bobot hewan yang didistribusikan lebih berat dari bobot yang dipesan pembeli harus membayar kelebihannya, sedangkan jika kondisi bobot kurang dari bobot pesanan maka  kelebihan pembayaran akan masuk ke saldo shohibul qurban.",
        },
      ],
    },
    {
      id: 6,
      status: "published",
      name: "Voucher Qurban 1/7 Sapi",
      thumbnail:
        "https://nabung-qurban.sgp1.vultrobjects.com/mock/product-5-thumbnail.png",
      images: [
        "https://nabung-qurban.sgp1.vultrobjects.com/mock/product-5-image-1.png",
      ],
      attributes: [
        {
          title: "",
          key: "pricing_info",
          value: "Harga belum termasuk biaya Admin",
        },
        {
          title: "",
          key: "transaction_info",
          value: "Maks. pelunasan H-7 sebelum Idul Adha",
        },
        {
          title: "",
          key: "additional_info",
          value: "Gambar hewan qurban hanya display",
        },
        {
          key: "detail_product",
          title: "Detail Voucher Qurban",
          value:
            "Tahun Qurban dan variasi voucher hewan qurban mempengaruhi harga",
        },
        {
          key: "important_info",
          title: "Informasi Penting",
          value:
            "Untuk pembelian menggunakan DP, pelunasan hanya bisa dilakukan maksimal 90 % (atau sesuai parameter dari NQ), jika  bobot hewan yang didistribusikan lebih berat dari bobot yang dipesan pembeli harus membayar kelebihannya, sedangkan jika kondisi bobot kurang dari bobot pesanan maka  kelebihan pembayaran akan masuk ke saldo shohibul qurban.",
        },
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
      rule: {
        quantity: { min: 1, max: null },
        participant: { min: 1, max: null },
      },
    },
    {
      id: 2,
      code: "1-unta",
      name: "1 Unta",
      rule: {
        quantity: { min: 1, max: null },
        participant: { min: 1, max: null },
      },
    },
    {
      id: 3,
      code: "1-7-unta",
      name: "1/7 Unta",
      rule: { quantity: { min: 1, max: 1 }, participant: { min: 7, max: 7 } },
    },
    {
      id: 4,
      code: "1-10-unta",
      name: "1/10 Unta",
      rule: {
        quantity: { min: 1, max: 1 },
        participant: { min: 10, max: 10 },
      },
    },
    {
      id: 5,
      code: "1-kambing",
      name: "1 Kambing",
      rule: {
        quantity: { min: 1, max: null },
        participant: { min: 1, max: null },
      },
    },
    {
      id: 6,
      code: "1-sapi",
      name: "1 Sapi",
      rule: {
        quantity: { min: 1, max: null },
        participant: { min: 1, max: null },
      },
    },
    {
      id: 7,
      code: "1-7-sapi",
      name: "1/7 Sapi",
      rule: { quantity: { min: 1, max: 1 }, participant: { min: 7, max: 7 } },
    },
    {
      id: 8,
      code: "1446-H-2025",
      name: "1446 H/2025",
      rule: {
        quantity: { min: 1, max: null },
        participant: { min: 1, max: null },
      },
    },
    {
      id: 9,
      code: "1447-H-2026",
      name: "1447 H/2026",
      rule: {
        quantity: { min: 1, max: null },
        participant: { min: 1, max: null },
      },
    },
    {
      id: 10,
      code: "1448-H-2027",
      name: "1448 H/2027",
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
    },
    {
      id: 2,
      productId: 2,
      status: "active",
      price: 5_000_000,
      name: "1446 H/2025",
    },
    {
      id: 3,
      productId: 2,
      status: "active",
      price: 4_000_000,
      name: "1447 H/2026",
    },
    {
      id: 4,
      productId: 3,
      status: "active",
      price: 70_000_000,
      name: "1446 H/2025",
    },
    {
      id: 5,
      productId: 3,
      status: "active",
      price: 65_000_000,
      name: "1447 H/2026",
    },
    {
      id: 6,
      productId: 3,
      status: "active",
      price: 55_000_000,
      name: "1448 H/2027",
    },
    {
      id: 7,
      productId: 4,
      status: "active",
      price: 25_000_000,
      name: "1446 H/2025",
    },
    {
      id: 8,
      productId: 4,
      status: "active",
      price: 20_000_000,
      name: "1447 H/2026",
    },
    {
      id: 9,
      productId: 5,
      status: "active",
      price: 1_300_000,
      name: "Kambing tipe 1",
    },
    {
      id: 10,
      productId: 5,
      status: "active",
      price: 1_500_000,
      name: "Kambing tipe 2",
    },
    {
      id: 11,
      productId: 6,
      status: "active",
      price: 3_600_000,
      name: "Sapi tipe 1",
    },
    {
      id: 12,
      productId: 6,
      status: "active",
      price: 3_400_000,
      name: "Sapi tipe 2",
    },
    {
      id: 13,
      productId: 6,
      status: "active",
      price: 2_600_000,
      name: "Sapi tipe 3",
    },
    {
      id: 14,
      productId: 6,
      status: "active",
      price: 2_400_000,
      name: "Sapi tipe 4",
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
      stock: 0,
      sku: null,
      weight: 450,
      productId: 1,
      tracker: "inactive",
    },
    {
      id: 2,
      stock: 0,
      sku: null,
      weight: 40,
      productId: 2,
      tracker: "inactive",
    },
    {
      id: 3,
      stock: 0,
      sku: null,
      weight: 700,
      productId: 3,
      tracker: "inactive",
    },
    {
      id: 4,
      stock: 0,
      sku: null,
      weight: 280,
      productId: 4,
      tracker: "inactive",
    },
    {
      id: 5,
      stock: 0,
      sku: null,
      weight: 40,
      productId: 5,
      tracker: "inactive",
    },
    {
      id: 6,
      stock: 0,
      sku: null,
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
      trx.warehouse.createMany({
        skipDuplicates: true,
        data: warehouses,
      }),
      trx.productWarehouse.createMany({
        skipDuplicates: true,
        data: productWarehouses,
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
