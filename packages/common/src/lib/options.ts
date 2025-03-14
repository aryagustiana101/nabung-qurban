export const USER_STATUSES = ["active", "inactive"] as const;

export const USER_STATUS_MAP = {
  active: "Active",
  inactive: "Inactive",
} as const;

export const USER_ACCOUNT_TYPES = [
  "antar_qurban",
  "pejuang_qurban",
  "shohibul_qurban",
] as const;

export const USER_ACCOUNT_TYPE_MAP = {
  antar_qurban: "Antar Qurban",
  pejuang_qurban: "Pejuang Qurban",
  shohibul_qurban: "Shohibul Qurban",
} as const;
