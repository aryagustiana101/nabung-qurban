import type { ProductAttributeKey } from "@repo/common/types";

export const USER_STATUSES = ["active", "inactive"] as const;

export const USER_TYPES = ["internal", "external"] as const;

export const USER_ACCOUNT_TYPES = [
  "antar_qurban",
  "pejuang_qurban",
  "shohibul_qurban",
] as const;

export const USER_APPLICATION_TYPES = [
  "antar_qurban",
  "pejuang_qurban",
] as const;

export const USER_APPLICATION_LEVELS = ["individual", "institution"] as const;

export const USER_APPLICATION_STATUSES = [
  "pending",
  "process",
  "approved",
  "rejected",
  "canceled",
] as const;

export const USER_APPLICATION_JACKET_PICKUP_METHODS = [
  "pickup",
  "delivery",
] as const;

export const USER_APPLICATION_JACKET_PAYMENT_METHODS = [
  "payment_gateway",
  "cash_on_delivery",
] as const;

export const USER_APPLICATION_HISTORY_STATUSES = [
  "pending",
  "process",
  "approved",
  "rejected",
  "canceled",
] as const;

export const USER_ACCOUNT_REFERRAL_STATUSES = ["active", "inactive"] as const;

export const USER_PASSWORD_RESET_SESSION_ACTIONS = ["forgot_password"] as const;

export const USER_PASSWORD_RESET_SESSION_STATUSES = [
  "active",
  "inactive",
] as const;

export const USER_ADDRESS_TYPES = ["main", "alternative"] as const;

export const TOKEN_STATUSES = ["active", "inactive"] as const;

export const SERVICE_STATUSES = ["active", "inactive"] as const;

export const SERVICE_LEVELS = ["main", "alternative"] as const;

export const SERVICE_SCOPES = ["coupon", "livestock"] as const;

export const SERVICE_CODES = [
  "daftar-antar-qurban",
  "daftar-pejuang-qurban",
  "ppob",
  "cicilan-qurban",
  "beli-qurban-tunai",
  "tebar-qurban-voucher-cicilan",
  "tebar-qurban-voucher-beli",
  "tebar-qurban-cicilan",
  "tebar-qurban-pembelian",
] as const;

export const ACTIVE_MAIN_SERVICE_CODES = [
  "cicilan-qurban",
  "beli-qurban-tunai",
  "tebar-qurban-voucher-cicilan",
  "tebar-qurban-voucher-beli",
  "tebar-qurban-cicilan",
  "tebar-qurban-pembelian",
] as const;

export const PRODUCT_SCOPES = ["coupon", "livestock"] as const;

export const PRODUCT_STATUSES = ["draft", "published", "archived"] as const;

export const PRODUCT_ATTRIBUTE_KEYS = [
  "pricing_info",
  "transaction_info",
  "delivery_info",
  "additional_info",
  "detail_product",
  "important_info",
] as const;

export const PRODUCT_VARIANT_STATUSES = ["active", "inactive"] as const;

export const PRODUCT_INVENTORY_TRACKERS = ["active", "inactive"] as const;

export const DISCOUNT_LEVELS = ["product_variant"] as const;

export const DISCOUNT_TYPES = ["flat", "percentage"] as const;

export const WAREHOUSE_STATUSES = ["active", "inactive"] as const;

export const ENTRANT_CODES = ["individual", "institution"] as const;

export const SCHEDULE_OPTION_KEYS = [
  "morning",
  "afternoon",
  "evening",
] as const;

export const LIVESTOCK_PRODUCT_ATTRIBUTES: {
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

export const COUPON_PRODUCT_ATTRIBUTES: {
  title: string;
  value: string;
  key: ProductAttributeKey;
}[] = [
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
    value: "Tahun Qurban dan variasi voucher hewan qurban mempengaruhi harga",
  },
  {
    key: "important_info",
    title: "Informasi Penting",
    value:
      "Untuk pembelian menggunakan DP, pelunasan hanya bisa dilakukan maksimal 90 % (atau sesuai parameter dari NQ), jika  bobot hewan yang didistribusikan lebih berat dari bobot yang dipesan pembeli harus membayar kelebihannya, sedangkan jika kondisi bobot kurang dari bobot pesanan maka  kelebihan pembayaran akan masuk ke saldo shohibul qurban.",
  },
];
