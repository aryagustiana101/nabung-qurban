export const USER_STATUSES = ["active", "inactive"] as const;
export const USER_STATUS_MAP = {
  active: "Active",
  inactive: "Inactive",
};

export const USER_TYPES = ["internal", "external"] as const;
export const USER_TYPE_MAP = {
  internal: "Internal",
  external: "External",
};

export const USER_ACCOUNT_TYPES = [
  "antar_qurban",
  "pejuang_qurban",
  "shohibul_qurban",
] as const;
export const USER_ACCOUNT_TYPE_MAP = {
  antar_qurban: "Antar Qurban",
  pejuang_qurban: "Pejuang Qurban",
  shohibul_qurban: "Shohibul Qurban",
};

export const USER_APPLICATION_TYPES = [
  "antar_qurban",
  "pejuang_qurban",
] as const;
export const USER_APPLICATION_TYPE_MAP = {
  antar_qurban: "Antar Qurban",
  pejuang_qurban: "Pejuang Qurban",
};

export const USER_APPLICATION_LEVELS = ["individual", "institution"] as const;
export const USER_APPLICATION_LEVEL_MAP = {
  individual: "Individual",
  institution: "Institution",
};

export const USER_APPLICATION_STATUSES = [
  "pending",
  "process",
  "approved",
  "rejected",
  "canceled",
] as const;
export const USER_APPLICATION_STATUS_MAP = {
  pending: "Pending",
  process: "Process",
  approved: "Approved",
  rejected: "Rejected",
  canceled: "Canceled",
};

export const USER_APPLICATION_JACKET_PICKUP_METHODS = [
  "pickup",
  "delivery",
] as const;
export const USER_APPLICATION_JACKET_PICKUP_METHOD_MAP = {
  pickup: "Pickup",
  delivery: "Delivery",
};

export const USER_APPLICATION_JACKET_PAYMENT_METHODS = [
  "payment_gateway",
  "cash_on_delivery",
] as const;
export const USER_APPLICATION_JACKET_PAYMENT_METHOD_MAP = {
  payment_gateway: "Payment Gateway",
  cash_on_delivery: "Cash on Delivery",
};

export const USER_APPLICATION_HISTORY_STATUSES = [
  "pending",
  "process",
  "approved",
  "rejected",
  "canceled",
] as const;
export const USER_APPLICATION_HISTORY_STATUS_MAP = {
  pending: "Pending",
  process: "Process",
  approved: "Approved",
  rejected: "Rejected",
  canceled: "Canceled",
};

export const USER_ACCOUNT_REFERRAL_STATUSES = ["active", "inactive"] as const;
export const USER_ACCOUNT_REFERRAL_STATUS_MAP = {
  active: "Active",
  inactive: "Inactive",
};

export const USER_PASSWORD_RESET_SESSION_ACTIONS = ["forgot_password"] as const;
export const USER_PASSWORD_RESET_SESSION_ACTION_MAP = {
  forgot_password: "Forgot Password",
};

export const USER_PASSWORD_RESET_SESSION_STATUSES = [
  "active",
  "inactive",
] as const;

export const USER_PASSWORD_RESET_SESSION_STATUS_MAP = {
  active: "Active",
  inactive: "Inactive",
};

export const USER_ADDRESS_TYPES = ["main", "alternative"] as const;
export const USER_ADDRESS_TYPE_MAP = {
  main: "Main",
  alternative: "Alternative",
};

export const TOKEN_STATUSES = ["active", "inactive"] as const;
export const TOKEN_STATUS_MAP = { active: "Active", inactive: "Inactive" };

export const SERVICE_STATUSES = ["active", "inactive"] as const;
export const SERVICE_STATUS_MAP = {
  active: "Active",
  inactive: "Inactive",
};

export const SERVICE_LEVELS = ["main", "alternative"] as const;
export const SERVICE_LEVEL_MAP = { main: "Main", alternative: "Alternative" };
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

export const PRODUCT_STATUSES = ["draft", "published", "archived"] as const;
export const PRODUCT_STATUS_MAP = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
};

export const PRODUCT_ATTRIBUTE_KEYS = [
  "pricing_info",
  "transaction_info",
  "delivery_info",
  "additional_info",
  "detail_product",
  "important_info",
] as const;

export const PRODUCT_VARIANT_STATUSES = ["active", "inactive"] as const;
export const PRODUCT_VARIANT_STATUS_MAP = {
  active: "Active",
  inactive: "Inactive",
};

export const PRODUCT_INVENTORY_TRACKERS = ["active", "inactive"] as const;
export const PRODUCT_INVENTORY_TRACKER_MAP = {
  active: "Active",
  inactive: "Inactive",
};

export const DISCOUNT_LEVELS = ["product_variant"] as const;
export const DISCOUNT_LEVEL_MAP = { product_variant: "Product Variant" };

export const DISCOUNT_TYPES = ["flat", "percentage"] as const;
export const DISCOUNT_TYPE_MAP = { flat: "Flat", percentage: "Percentage" };

export const WAREHOUSE_STATUSES = ["active", "inactive"] as const;
export const WAREHOUSE_STATUS_MAP = { active: "Active", inactive: "Inactive" };

export const ENTRANT_TYPES = ["individual", "institution"] as const;
export const SCHEDULE_OPTION_KEYS = [
  "morning",
  "afternoon",
  "evening",
] as const;
