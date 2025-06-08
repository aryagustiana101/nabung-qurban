"use client";

import {
  ACTIVE_MAIN_SERVICE_CODES,
  PRODUCT_STATUSES,
  convertCase,
} from "@repo/common";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import {
  DataTable,
  DataTableColumnHeader,
  type DataTableFilterField,
  DataTableToolbar,
} from "~/components/data-table";
import {
  type RouterInput,
  type RouterOutput,
  api,
} from "~/components/provider";
import { Badge } from "~/components/ui/badge";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useDataTable } from "~/hooks/use-data-table";

type Product = NonNullable<
  RouterOutput["product"]["getMultiple"]["result"]
>["records"][number] & {
  keyword?: unknown;
  statuses?: unknown;
  services?: unknown;
  categories?: unknown;
};

export function ProductTable({
  input,
  categories,
}: { categories: string[]; input: RouterInput["product"]["getMultiple"] }) {
  const query = api.product.getMultiple.useQuery(input);

  const columns: ColumnDef<Product>[] = React.useMemo(
    () => [
      { id: "keyword" },
      { id: "statuses" },
      { id: "services" },
      { id: "categories" },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Name" />
        ),
      },
      {
        accessorKey: "fmt.status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
          return <Badge variant="outline">{row.original.fmt.status}</Badge>;
        },
      },
      {
        accessorKey: "category",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Categories" />
        ),
        cell: ({ row }) => {
          return (
            <div className="flex w-full flex-wrap gap-2">
              {row.original.categories.map((category, i) => (
                <Badge key={i} variant="outline">
                  {category.name}
                </Badge>
              ))}
            </div>
          );
        },
      },
      {
        accessorKey: "service",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Services" />
        ),
        cell: ({ row }) => {
          return (
            <div className="flex w-full flex-wrap gap-2">
              {row.original.services.map((service, i) => (
                <Badge key={i} variant="outline">
                  {service.name}
                </Badge>
              ))}
            </div>
          );
        },
      },
      {
        size: 40,
        id: "actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex size-8 p-0 data-[state=open]:bg-muted"
              >
                <MoreHorizontalIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem asChild>
                <Link
                  href={`/dashboard/products/${row.original.id}`}
                  className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                >
                  Detail
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [],
  );

  const filterFields: DataTableFilterField<Product>[] = [
    { id: "keyword", label: "Keyword", placeholder: "Filter Keyword" },
    {
      id: "categories",
      label: "Categories",
      options: categories
        .toSorted((a, b) => a.localeCompare(b))
        .map((value) => {
          return { value, label: convertCase(value) };
        }),
    },
    {
      id: "services",
      label: "Services",
      options: ACTIVE_MAIN_SERVICE_CODES.toSorted((a, b) =>
        a.localeCompare(b),
      ).map((v) => {
        return { value: v, label: convertCase(v) };
      }),
    },
    {
      id: "statuses",
      label: "Statuses",
      options: PRODUCT_STATUSES.toSorted((a, b) => a.localeCompare(b)).map(
        (value) => {
          return { value, label: convertCase(value) };
        },
      ),
    },
  ];

  const { table } = useDataTable({
    columns,
    filterFields,
    enableHiding: false,
    clearOnDefault: true,
    enableSorting: false,
    data: query?.data?.result?.records ?? [],
    pageCount: query?.data?.result?.pagination?.offset?.pageCount ?? 0,
    initialState: {
      columnVisibility: {
        keyword: false,
        statuses: false,
        services: false,
        categories: false,
      },
    },
  });

  return (
    <div className="grid">
      <DataTable table={table}>
        <DataTableToolbar
          table={table}
          enableViewOptions={false}
          filterFields={filterFields}
        >
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/products/new"
              className={buttonVariants({ size: "sm", variant: "outline" })}
            >
              Create
            </Link>
          </div>
        </DataTableToolbar>
      </DataTable>
    </div>
  );
}
