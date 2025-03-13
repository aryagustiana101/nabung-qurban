import { type Prisma, PrismaClient } from "@prisma/client";

const db = new PrismaClient({ log: ["error"] });

async function main() {
  const users: Prisma.UserCreateManyInput[] = [];

  const result = await db.$transaction(async (trx) => {
    return Promise.all([
      trx.user.createMany({ data: users, skipDuplicates: true }),
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
