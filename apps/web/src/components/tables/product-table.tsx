"use client";

import {
  convertCase,
  PRODUCT_SCOPES,
  PRODUCT_STATUSES,
  qs,
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
  api,
  type RouterInput,
  type RouterOutput,
} from "~/components/provider";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
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
  scopes?: unknown;
  keyword?: unknown;
  statuses?: unknown;
  services?: unknown;
  categories?: unknown;
};

export function ProductTable({
  input,
  option,
}: {
  input: RouterInput["product"]["getMultiple"];
  option: {
    services: string[];
    categories: string[];
  };
}) {
  const query = api.product.getMultiple.useQuery(input);

  const columns: ColumnDef<Product>[] = React.useMemo(
    () => [
      { id: "scopes" },
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
        accessorKey: "fmt.scope",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Scope" />
        ),
        cell: ({ row }) => {
          return <Badge variant="outline">{row.original.fmt.scope}</Badge>;
        },
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
      id: "services",
      label: "Services",
      options: option.services
        .toSorted((a, b) => a.localeCompare(b))
        .map((value) => {
          return { value, label: convertCase(value) };
        }),
    },
    {
      id: "categories",
      label: "Categories",
      options: option.categories
        .toSorted((a, b) => a.localeCompare(b))
        .map((value) => {
          return { value, label: convertCase(value) };
        }),
    },
    {
      id: "scopes",
      label: "Scopes",
      options: PRODUCT_SCOPES.toSorted((a, b) => a.localeCompare(b)).map(
        (value) => {
          return { value, label: convertCase(value) };
        },
      ),
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
        scopes: false,
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline">
                  Create
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                {PRODUCT_SCOPES.map((scope, i) => {
                  return (
                    <DropdownMenuItem key={i} asChild>
                      <Link
                        href={`/dashboard/products/new?${qs.stringify({ scope })}`}
                      >
                        {convertCase(scope)}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </DataTableToolbar>
      </DataTable>
    </div>
  );
}
