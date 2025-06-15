import { computePagination } from "@repo/common";
import { type Prisma, serializeProduct } from "@repo/database";
import { routerSchema } from "~/schemas/product-schema";
import { createTRPCRouter, protectedProcedure } from "~/trpc/init";

export const productRouter = createTRPCRouter({
  getMultiple: protectedProcedure
    .input(routerSchema.getMultiple)
    .query(async ({ input, ctx: { db, locale, timezone } }) => {
      const cursor = input.cursor;
      const page = input.page ?? 1;
      const limit = input.limit ?? 10;
      const pagination = input.pagination ?? "offset";

      const where: Prisma.ProductWhereInput = {
        scope:
          input.scopes && input.scopes.length > 0
            ? { in: input.scopes }
            : undefined,
        status:
          input.statuses && input.statuses.length > 0
            ? { in: input.statuses }
            : undefined,
        name:
          input.keyword && input.keyword.length > 0
            ? { contains: input.keyword }
            : undefined,
        productCategories:
          input.categories && input.categories.length > 0
            ? { some: { category: { code: { in: input.categories } } } }
            : undefined,
        productServices:
          input.services && input.services.length > 0
            ? { some: { service: { code: { in: input.services } } } }
            : undefined,
      };

      const records = await db.product.findMany({
        where,
        take: limit,
        orderBy: { id: "desc" },
        cursor:
          typeof cursor === "number" && pagination === "cursor"
            ? { id: cursor }
            : undefined,
        skip:
          typeof cursor === "number" && pagination === "cursor"
            ? 1
            : pagination === "offset"
              ? page * limit - limit
              : undefined,
        include: {
          productEntrants: { include: { entrant: true } },
          productInventories: { orderBy: { id: "desc" } },
          productServices: { include: { service: true } },
          productCategories: { include: { category: true } },
          productWarehouses: {
            orderBy: { id: "desc" },
            include: { warehouse: true },
          },
          productVariants: {
            include: {
              productVariantAttributes: { include: { attribute: true } },
              productVariantDiscounts: {
                orderBy: { id: "desc" },
                include: { discount: true },
              },
            },
          },
        },
      });

      const count = await db.product.count({ where });

      const next =
        pagination === "cursor" && records.length === limit
          ? (records.at(-1)?.id ?? null)
          : null;

      const last =
        pagination === "cursor" && limit <= 2
          ? ((
              await db.product.findFirst({
                where,
                take: 1,
                select: { id: true },
                orderBy: { id: "asc" },
              })
            )?.id ?? null)
          : null;

      return {
        success: true,
        message: null,
        result: {
          pagination: computePagination({
            page,
            limit,
            count,
            cursor,
            type: pagination,
            next: next !== last ? next : null,
          }),
          records: records.map((record) => {
            return serializeProduct({ record, locale, timezone });
          }),
        },
      };
    }),
  getSingle: protectedProcedure
    .input(routerSchema.getSingle)
    .query(async ({ input, ctx: { db, locale, timezone } }) => {
      const record = await db.product.findUnique({
        where: { id: input.id },
        include: {
          productEntrants: { include: { entrant: true } },
          productInventories: { orderBy: { id: "desc" } },
          productServices: { include: { service: true } },
          productCategories: { include: { category: true } },
          productWarehouses: {
            orderBy: { id: "desc" },
            include: { warehouse: true },
          },
          productVariants: {
            include: {
              productVariantAttributes: { include: { attribute: true } },
              productVariantDiscounts: {
                orderBy: { id: "desc" },
                include: { discount: true },
              },
            },
          },
        },
      });

      if (!record) {
        return { success: false, message: "Product not found", result: null };
      }

      return {
        success: true,
        message: null,
        result: serializeProduct({ record, locale, timezone }),
      };
    }),
  create: protectedProcedure
    .input(routerSchema.create)
    .mutation(async ({ input, ctx: { db } }) => {
      const product = await db.product.create({
        data: {
          name: input.name,
          scope: input.scope,
          status: input.status,
          thumbnail: input.thumbnail,
          images: input.images,
          attributes: input.attributes,
          productServices: {
            createMany: {
              skipDuplicates: true,
              data: input.services.map((service) => ({
                serviceId: service.id,
              })),
            },
          },
          productCategories: {
            createMany: {
              skipDuplicates: true,
              data: input.categories.map((category) => ({
                categoryId: category.id,
              })),
            },
          },
          productInventories: {
            createMany: {
              skipDuplicates: true,
              data: input.inventories.map((inventory) => ({
                sku: inventory.sku,
                stock: inventory.stock,
                weight: inventory.weight,
                tracker: inventory.tracker,
              })),
            },
          },
          productWarehouses: {
            createMany: {
              skipDuplicates: true,
              data: input.warehouses.map((warehouse) => ({
                warehouseId: warehouse.id,
              })),
            },
          },
          productEntrants: {
            createMany: {
              skipDuplicates: true,
              data: input.entrants.map((entrant) => ({
                entrantId: entrant.id,
              })),
            },
          },
        },
      });

      for (const variant of input.variants) {
        await db.productVariant.create({
          data: {
            name: variant.name,
            rule: variant.rule,
            label: variant.label,
            price: variant.price,
            status: variant.status,
            productId: product.id,
            productVariantAttributes: {
              createMany: {
                skipDuplicates: true,
                data: variant.attributes.map((attribute) => ({
                  attributeId: attribute.id,
                })),
              },
            },
            productVariantDiscounts: variant.discount
              ? { create: { discountId: variant.discount.id } }
              : undefined,
          },
        });
      }

      return { success: true, message: "Save product success", result: null };
    }),
  update: protectedProcedure
    .input(routerSchema.update)
    .mutation(async ({ input, ctx: { db } }) => {
      const product = await db.product.findUnique({
        where: { id: input.id },
      });

      if (!product) {
        return { success: false, message: "Product not found", result: null };
      }

      await db.product.update({
        where: { id: input.id },
        data: {
          name: input.name,
          scope: input.scope,
          status: input.status,
          thumbnail: input.thumbnail,
          images: input.images,
          attributes: input.attributes,
          productServices: input.services
            ? {
                upsert: input.services.map((service) => ({
                  update: {},
                  create: { serviceId: service.id },
                  where: {
                    identifier: {
                      productId: product.id,
                      serviceId: service.id,
                    },
                  },
                })),
              }
            : undefined,
          productCategories: input.categories
            ? {
                upsert: input.categories.map((category) => ({
                  update: {},
                  create: { categoryId: category.id },
                  where: {
                    identifier: {
                      productId: product.id,
                      categoryId: category.id,
                    },
                  },
                })),
              }
            : undefined,
          productInventories: input.inventories
            ? {
                updateMany: input.inventories.map((inventory) => ({
                  where: { productId: product.id },
                  data: {
                    sku: inventory.sku,
                    stock: inventory.stock,
                    weight: inventory.weight,
                    tracker: inventory.tracker,
                  },
                })),
              }
            : undefined,
          productWarehouses: input.warehouses
            ? {
                upsert: input.warehouses.map((warehouse) => ({
                  update: {},
                  create: { warehouseId: warehouse.id },
                  where: {
                    identifier: {
                      productId: product.id,
                      warehouseId: warehouse.id,
                    },
                  },
                })),
              }
            : undefined,
          productEntrants: input.entrants
            ? {
                upsert: input.entrants.map((entrant) => ({
                  update: {},
                  create: { entrantId: entrant.id },
                  where: {
                    identifier: {
                      productId: product.id,
                      entrantId: entrant.id,
                    },
                  },
                })),
              }
            : undefined,
        },
      });

      await db.productVariant.deleteMany({
        where: { productId: product.id },
      });

      for (const variant of input.variants ?? []) {
        await db.productVariant.create({
          data: {
            name: variant.name,
            rule: variant.rule,
            label: variant.label,
            price: variant.price,
            status: variant.status,
            productId: product.id,
            productVariantAttributes: {
              createMany: {
                skipDuplicates: true,
                data: variant.attributes.map((attribute) => ({
                  attributeId: attribute.id,
                })),
              },
            },
            productVariantDiscounts: variant.discount
              ? { create: { discountId: variant.discount.id } }
              : undefined,
          },
        });
      }

      return { success: true, message: "Save product success", result: null };
    }),
});
