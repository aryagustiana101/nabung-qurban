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
