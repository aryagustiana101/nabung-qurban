"use client";

import {
  PRODUCT_VARIANT_RULES_YEARS,
  type computePagination,
} from "@repo/common";
import { CheckIcon, ChevronsUpDownIcon, RotateCcwIcon } from "lucide-react";
import * as React from "react";
import { Combobox } from "~/components/combobox";
import {
  type RouterInput,
  type RouterOutput,
  api,
} from "~/components/provider";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";

type Category = NonNullable<
  RouterOutput["category"]["getMultiple"]["result"]
>["records"][number];

type Service = NonNullable<
  RouterOutput["service"]["getMultiple"]["result"]
>["records"][number];

type Entrant = NonNullable<
  RouterOutput["entrant"]["getMultiple"]["result"]
>["records"][number];

type Warehouse = NonNullable<
  RouterOutput["warehouse"]["getMultiple"]["result"]
>["records"][number];

type Attribute = NonNullable<
  RouterOutput["attribute"]["getMultiple"]["result"]
>["records"][number];

type Discount = NonNullable<
  RouterOutput["discount"]["getMultiple"]["result"]
>["records"][number];

export function CategorySelector({
  limit,
  children,
  onValueChange,
  value: _value,
  asChild = false,
  disabled = false,
}: React.PropsWithChildren<{
  limit?: number;
  asChild?: boolean;
  disabled?: boolean;
  value?: Category[] | null;
  onValueChange?: (value: Category[]) => void;
  filter?: Omit<
    RouterInput["category"]["getMultiple"],
    "cursor" | "page" | "limit" | "keyword" | "pagination"
  >;
}>) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(_value ?? []);
  const [keyword, setKeyword] = React.useState<string>();

  React.useEffect(() => {
    setValue(_value ?? []);
  }, [_value]);

  const query = api.category.getMultiple.useInfiniteQuery(
    { keyword, pagination: "cursor" },
    {
      initialCursor: 0,
      getNextPageParam: (page) => {
        return page?.result?.pagination?.cursor?.next ?? null;
      },
    },
  );

  const isSingleOption = limit && limit <= 1;

  return (
    <RecordSelector<Category>
      open={open}
      setOpen={setOpen}
      keyword={keyword}
      asChild={asChild}
      disabled={disabled}
      setKeyword={setKeyword}
      isError={query.isError}
      pages={query?.data?.pages}
      isLoading={query.isLoading}
      isFetching={query.isFetching}
      hasNextPage={query.hasNextPage}
      isFetchingNextPage={query.isFetchingNextPage}
      onLoadMoreClick={async () => {
        await query.fetchNextPage();
      }}
      getCurrentRecord={(record) => {
        return value.find((v) => v.id === record.id);
      }}
      getRecordLabel={(record) => {
        return <p className="line-clamp-1">{record.name}</p>;
      }}
      onRecordSelect={(record, current) => {
        const items = (
          current ? value.filter((v) => v.id !== record.id) : [record, ...value]
        ).slice(0, limit);

        setValue(items);
        onValueChange?.(items);
      }}
      getLabel={() => {
        return value.length > 0 ? (
          <span>
            {isSingleOption
              ? (value?.[0]?.name ?? "-")
              : `Selected ${value.length} ${value.length === 1 ? "record" : "records"}`}
          </span>
        ) : (
          <span className="text-muted-foreground">
            {isSingleOption ? "Select record" : "Select records"}
          </span>
        );
      }}
    >
      {children}
    </RecordSelector>
  );
}

export function ServiceSelector({
  limit,
  filter,
  children,
  onValueChange,
  value: _value,
  asChild = false,
  disabled = false,
}: React.PropsWithChildren<{
  limit?: number;
  asChild?: boolean;
  disabled?: boolean;
  value?: Service[] | null;
  onValueChange?: (value: Service[]) => void;
  filter?: Omit<
    RouterInput["service"]["getMultiple"],
    "cursor" | "page" | "limit" | "keyword" | "pagination"
  >;
}>) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(_value ?? []);
  const [keyword, setKeyword] = React.useState<string>();

  React.useEffect(() => {
    setValue(_value ?? []);
  }, [_value]);

  const query = api.service.getMultiple.useInfiniteQuery(
    { ...(filter ?? {}), keyword, pagination: "cursor" },
    {
      initialCursor: 0,
      getNextPageParam: (page) => {
        return page?.result?.pagination?.cursor?.next ?? null;
      },
    },
  );

  const isSingleOption = limit && limit <= 1;

  return (
    <RecordSelector<Service>
      open={open}
      setOpen={setOpen}
      keyword={keyword}
      asChild={asChild}
      disabled={disabled}
      setKeyword={setKeyword}
      isError={query.isError}
      pages={query?.data?.pages}
      isLoading={query.isLoading}
      isFetching={query.isFetching}
      hasNextPage={query.hasNextPage}
      isFetchingNextPage={query.isFetchingNextPage}
      onLoadMoreClick={async () => {
        await query.fetchNextPage();
      }}
      getCurrentRecord={(record) => {
        return value.find((v) => v.id === record.id);
      }}
      getRecordLabel={(record) => {
        return <p className="line-clamp-1">{record.name}</p>;
      }}
      onRecordSelect={(record, current) => {
        const items = (
          current ? value.filter((v) => v.id !== record.id) : [record, ...value]
        ).slice(0, limit);

        setValue(items);
        onValueChange?.(items);
      }}
      getLabel={() => {
        return value.length > 0 ? (
          <span>
            {isSingleOption
              ? (value?.[0]?.name ?? "-")
              : `Selected ${value.length} ${value.length === 1 ? "record" : "records"}`}
          </span>
        ) : (
          <span className="text-muted-foreground">
            {isSingleOption ? "Select record" : "Select records"}
          </span>
        );
      }}
    >
      {children}
    </RecordSelector>
  );
}

export function WarehouseSelector({
  limit,
  filter,
  children,
  onValueChange,
  value: _value,
  asChild = false,
  disabled = false,
}: React.PropsWithChildren<{
  limit?: number;
  asChild?: boolean;
  disabled?: boolean;
  value?: Warehouse[] | null;
  onValueChange?: (value: Warehouse[]) => void;
  filter?: Omit<
    RouterInput["warehouse"]["getMultiple"],
    "cursor" | "page" | "limit" | "keyword" | "pagination"
  >;
}>) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(_value ?? []);
  const [keyword, setKeyword] = React.useState<string>();

  React.useEffect(() => {
    setValue(_value ?? []);
  }, [_value]);

  const query = api.warehouse.getMultiple.useInfiniteQuery(
    { ...(filter ?? {}), keyword, pagination: "cursor" },
    {
      initialCursor: 0,
      getNextPageParam: (page) => {
        return page?.result?.pagination?.cursor?.next ?? null;
      },
    },
  );

  const isSingleOption = limit && limit <= 1;

  return (
    <RecordSelector<Warehouse>
      open={open}
      setOpen={setOpen}
      keyword={keyword}
      asChild={asChild}
      disabled={disabled}
      setKeyword={setKeyword}
      isError={query.isError}
      pages={query?.data?.pages}
      isLoading={query.isLoading}
      isFetching={query.isFetching}
      hasNextPage={query.hasNextPage}
      isFetchingNextPage={query.isFetchingNextPage}
      onLoadMoreClick={async () => {
        await query.fetchNextPage();
      }}
      getCurrentRecord={(record) => {
        return value.find((v) => v.id === record.id);
      }}
      getRecordLabel={(record) => {
        return <p className="line-clamp-1">{record.name}</p>;
      }}
      onRecordSelect={(record, current) => {
        const items = (
          current ? value.filter((v) => v.id !== record.id) : [record, ...value]
        ).slice(0, limit);

        setValue(items);
        onValueChange?.(items);
      }}
      getLabel={() => {
        return value.length > 0 ? (
          <span>
            {isSingleOption
              ? (value?.[0]?.name ?? "-")
              : `Selected ${value.length} ${value.length === 1 ? "record" : "records"}`}
          </span>
        ) : (
          <span className="text-muted-foreground">
            {isSingleOption ? "Select record" : "Select records"}
          </span>
        );
      }}
    >
      {children}
    </RecordSelector>
  );
}

export function EntrantSelector({
  limit,
  children,
  onValueChange,
  value: _value,
  asChild = false,
  disabled = false,
}: React.PropsWithChildren<{
  limit?: number;
  asChild?: boolean;
  disabled?: boolean;
  value?: Entrant[] | null;
  onValueChange?: (value: Entrant[]) => void;
  filter?: Omit<
    RouterInput["entrant"]["getMultiple"],
    "cursor" | "page" | "limit" | "keyword" | "pagination"
  >;
}>) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(_value ?? []);
  const [keyword, setKeyword] = React.useState<string>();

  React.useEffect(() => {
    setValue(_value ?? []);
  }, [_value]);

  const query = api.entrant.getMultiple.useInfiniteQuery(
    { keyword, pagination: "cursor" },
    {
      initialCursor: 0,
      getNextPageParam: (page) => {
        return page?.result?.pagination?.cursor?.next ?? null;
      },
    },
  );

  const isSingleOption = limit && limit <= 1;

  return (
    <RecordSelector<Entrant>
      open={open}
      setOpen={setOpen}
      keyword={keyword}
      asChild={asChild}
      disabled={disabled}
      setKeyword={setKeyword}
      isError={query.isError}
      pages={query?.data?.pages}
      isLoading={query.isLoading}
      isFetching={query.isFetching}
      hasNextPage={query.hasNextPage}
      isFetchingNextPage={query.isFetchingNextPage}
      onLoadMoreClick={async () => {
        await query.fetchNextPage();
      }}
      getCurrentRecord={(record) => {
        return value.find((v) => v.id === record.id);
      }}
      getRecordLabel={(record) => {
        return <p className="line-clamp-1">{record.name}</p>;
      }}
      onRecordSelect={(record, current) => {
        const items = (
          current ? value.filter((v) => v.id !== record.id) : [record, ...value]
        ).slice(0, limit);

        setValue(items);
        onValueChange?.(items);
      }}
      getLabel={() => {
        return value.length > 0 ? (
          <span>
            {isSingleOption
              ? (value?.[0]?.name ?? "-")
              : `Selected ${value.length} ${value.length === 1 ? "record" : "records"}`}
          </span>
        ) : (
          <span className="text-muted-foreground">
            {isSingleOption ? "Select record" : "Select records"}
          </span>
        );
      }}
    >
      {children}
    </RecordSelector>
  );
}

export function ProductVariantRuleYearSelector({
  limit,
  children,
  value: _value,
  onValueChange,
  disabled = false,
}: React.PropsWithChildren<{
  limit?: number;
  disabled?: boolean;
  value?: { min: number | null; max: number | null }[];
  onValueChange?: (value: { min: number | null; max: number | null }[]) => void;
}>) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(_value ?? []);

  React.useEffect(() => {
    setValue(_value ?? []);
  }, [_value]);

  const isSingleOption = limit && limit <= 1;

  return (
    <Combobox
      open={open}
      setOpen={setOpen}
      disabled={disabled}
      records={PRODUCT_VARIANT_RULES_YEARS}
      getOptionCurrentRecord={(record) => {
        return value.find((v) => v.min === record.min && v.max === record.max);
      }}
      getOptionLabel={(record) => {
        return <p className="line-clamp-1">{record.max}</p>;
      }}
      onOptionSelect={(record, current) => {
        const items = (
          current
            ? value.filter((v) => v.min !== record.min || v.max !== record.max)
            : [record, ...value]
        ).slice(0, limit);

        setValue(items);
        onValueChange?.(items);
        setOpen(false);
      }}
      getLabel={() => {
        return value.length > 0 ? (
          <span>
            {isSingleOption
              ? (value?.[0]?.max ?? "-")
              : `Selected ${value.length} ${value.length === 1 ? "option" : "options"}`}
          </span>
        ) : (
          <span className="text-muted-foreground">
            {isSingleOption ? "Select option" : "Select options"}
          </span>
        );
      }}
    >
      {children}
    </Combobox>
  );
}

export function AttributeSelector({
  limit,
  filter,
  children,
  onValueChange,
  value: _value,
  asChild = false,
  disabled = false,
}: React.PropsWithChildren<{
  limit?: number;
  asChild?: boolean;
  disabled?: boolean;
  value?: Attribute[] | null;
  onValueChange?: (value: Attribute[]) => void;
  filter?: Omit<
    RouterInput["attribute"]["getMultiple"],
    "cursor" | "page" | "limit" | "keyword" | "pagination"
  >;
}>) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(_value ?? []);
  const [keyword, setKeyword] = React.useState<string>();

  React.useEffect(() => {
    setValue(_value ?? []);
  }, [_value]);

  const query = api.attribute.getMultiple.useInfiniteQuery(
    { ...(filter ?? {}), keyword, pagination: "cursor" },
    {
      initialCursor: 0,
      getNextPageParam: (page) => {
        return page?.result?.pagination?.cursor?.next ?? null;
      },
    },
  );

  const isSingleOption = limit && limit <= 1;

  return (
    <RecordSelector<Attribute>
      open={open}
      setOpen={setOpen}
      keyword={keyword}
      asChild={asChild}
      disabled={disabled}
      setKeyword={setKeyword}
      isError={query.isError}
      pages={query?.data?.pages}
      isLoading={query.isLoading}
      isFetching={query.isFetching}
      hasNextPage={query.hasNextPage}
      isFetchingNextPage={query.isFetchingNextPage}
      onLoadMoreClick={async () => {
        await query.fetchNextPage();
      }}
      getCurrentRecord={(record) => {
        return value.find((v) => v.id === record.id);
      }}
      getRecordLabel={(record) => {
        return <p className="line-clamp-1">{record.name}</p>;
      }}
      onRecordSelect={(record, current) => {
        const items = (
          current ? value.filter((v) => v.id !== record.id) : [record, ...value]
        ).slice(0, limit);

        setValue(items);
        onValueChange?.(items);
      }}
      getLabel={() => {
        return value.length > 0 ? (
          <span>
            {isSingleOption
              ? (value?.[0]?.name ?? "-")
              : `Selected ${value.length} ${value.length === 1 ? "record" : "records"}`}
          </span>
        ) : (
          <span className="text-muted-foreground">
            {isSingleOption ? "Select record" : "Select records"}
          </span>
        );
      }}
    >
      {children}
    </RecordSelector>
  );
}

export function DiscountSelector({
  limit,
  filter,
  children,
  onValueChange,
  value: _value,
  asChild = false,
  disabled = false,
}: React.PropsWithChildren<{
  limit?: number;
  asChild?: boolean;
  disabled?: boolean;
  value?: Discount[] | null;
  onValueChange?: (value: Discount[]) => void;
  filter?: Omit<
    RouterInput["discount"]["getMultiple"],
    "cursor" | "page" | "limit" | "keyword" | "pagination"
  >;
}>) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(_value ?? []);
  const [keyword, setKeyword] = React.useState<string>();

  React.useEffect(() => {
    setValue(_value ?? []);
  }, [_value]);

  const query = api.discount.getMultiple.useInfiniteQuery(
    { ...(filter ?? {}), keyword, pagination: "cursor" },
    {
      initialCursor: 0,
      getNextPageParam: (page) => {
        return page?.result?.pagination?.cursor?.next ?? null;
      },
    },
  );

  const isSingleOption = limit && limit <= 1;

  return (
    <RecordSelector<Discount>
      open={open}
      setOpen={setOpen}
      keyword={keyword}
      asChild={asChild}
      disabled={disabled}
      setKeyword={setKeyword}
      isError={query.isError}
      pages={query?.data?.pages}
      isLoading={query.isLoading}
      isFetching={query.isFetching}
      hasNextPage={query.hasNextPage}
      isFetchingNextPage={query.isFetchingNextPage}
      onLoadMoreClick={async () => {
        await query.fetchNextPage();
      }}
      getCurrentRecord={(record) => {
        return value.find((v) => v.id === record.id);
      }}
      getRecordLabel={(record) => {
        return <p className="line-clamp-1">{record.name}</p>;
      }}
      onRecordSelect={(record, current) => {
        const items = (
          current ? value.filter((v) => v.id !== record.id) : [record, ...value]
        ).slice(0, limit);

        setValue(items);
        onValueChange?.(items);
      }}
      getLabel={() => {
        return value.length > 0 ? (
          <span>
            {isSingleOption
              ? (value?.[0]?.name ?? "-")
              : `Selected ${value.length} ${value.length === 1 ? "record" : "records"}`}
          </span>
        ) : (
          <span className="text-muted-foreground">
            {isSingleOption ? "Select record" : "Select records"}
          </span>
        );
      }}
    >
      {children}
    </RecordSelector>
  );
}

export function RecordSelector<T>({
  open,
  pages,
  setOpen,
  keyword,
  asChild,
  isError,
  children,
  disabled,
  getLabel,
  isLoading,
  isFetching,
  setKeyword,
  hasNextPage,
  getRecordLabel,
  onRecordSelect,
  onLoadMoreClick,
  isFetchingNextPage,
  getCurrentRecord,
}: React.PropsWithChildren<{
  open: boolean;
  isError: boolean;
  asChild?: boolean;
  disabled: boolean;
  isLoading: boolean;
  isFetching: boolean;
  hasNextPage: boolean;
  keyword: string | undefined;
  isFetchingNextPage: boolean;
  getLabel: () => React.ReactNode;
  onLoadMoreClick: () => Promise<void>;
  getRecordLabel: (record: T) => React.ReactNode;
  getCurrentRecord: (record: T) => T | undefined;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onRecordSelect: (record: T, current: T | undefined) => void;
  setKeyword: React.Dispatch<React.SetStateAction<string | undefined>>;
  pages?: {
    success: boolean;
    message: string | null;
    result: {
      pagination: ReturnType<typeof computePagination>;
      records: T[];
    } | null;
  }[];
}>) {
  return (
    <Popover
      modal={true}
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) {
          setKeyword(undefined);
        }
      }}
    >
      <PopoverTrigger asChild disabled={disabled}>
        {asChild ? (
          children
        ) : (
          <Button
            variant="outline"
            className="w-full flex-1 justify-between font-normal text-sm"
          >
            {getLabel()}
            <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-full min-w-[var(--radix-popover-trigger-width)] p-0"
      >
        <Command shouldFilter={false}>
          <CommandList className="max-h-48">
            <CommandInput
              value={keyword}
              onValueChange={setKeyword}
              isLoading={isFetching || isLoading}
              placeholder="Type keyword to search record"
            />
            <CommandGroup>
              {isLoading && (
                <div className="py-4 text-center text-sm">
                  Searching record...
                </div>
              )}
              {!isError &&
              !isLoading &&
              (pages?.[0]?.result?.records?.length ?? 0) <= 0 ? (
                <div className="py-4 text-center text-sm">Record not found</div>
              ) : null}
              {isError ? (
                <div className="py-4 text-center text-sm">
                  Failed to load record
                </div>
              ) : null}
              {!isError &&
                !isLoading &&
                pages?.map((page, i) => (
                  <React.Fragment key={String(i)}>
                    {page?.result?.records?.map((record, j) => {
                      const current = getCurrentRecord(record);

                      return (
                        <CommandItem
                          key={String(j)}
                          onSelect={() => {
                            onRecordSelect(record, current);
                          }}
                        >
                          <div className="max-w-[var(--radix-popover-trigger-width)]">
                            {getRecordLabel(record)}
                          </div>
                          <CheckIcon
                            className={cn(
                              "ml-auto size-4",
                              current ? "opacity-100" : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      );
                    })}
                  </React.Fragment>
                ))}
            </CommandGroup>
            <CommandSeparator />
            {hasNextPage ? (
              <CommandGroup>
                <CommandItem
                  className="text-muted-foreground"
                  disabled={disabled || !hasNextPage || isFetchingNextPage}
                  onSelect={async () => {
                    await onLoadMoreClick();
                  }}
                >
                  <RotateCcwIcon
                    className={cn(
                      "mr-2 size-4",
                      isFetchingNextPage ? "animate-spin" : "animate-none",
                    )}
                  />
                  Load more
                </CommandItem>
              </CommandGroup>
            ) : null}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
