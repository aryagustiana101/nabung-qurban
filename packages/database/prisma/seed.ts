import { type Prisma, PrismaClient } from "@prisma/client";
import { env } from "@repo/database/env";
import { addMonths } from "date-fns";

const db = new PrismaClient({ log: ["error"] });

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

  const result = await db.$transaction(async (trx) => {
    return Promise.all([
      trx.user.createMany({ data: users, skipDuplicates: true }),
      trx.userAccount.createMany({ data: userAccounts, skipDuplicates: true }),
      trx.token.createMany({ data: tokens, skipDuplicates: true }),
      trx.userToken.createMany({ data: userTokens, skipDuplicates: true }),
      trx.userAddress.createMany({ data: userAddresses, skipDuplicates: true }),
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
