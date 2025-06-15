"use client";

import type { computePagination } from "@repo/common";
import { CheckIcon, ChevronsUpDownIcon, RotateCcwIcon } from "lucide-react";
import * as React from "react";
import { type RouterOutput, api } from "~/components/provider";
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
  children,
  scopes,
  onValueChange,
  value: _value,
  asChild = false,
  disabled = false,
}: React.PropsWithChildren<{
  limit?: number;
  asChild?: boolean;
  disabled?: boolean;
  value?: Service[] | null;
  scopes?: Service["scopes"];
  onValueChange?: (value: Service[]) => void;
}>) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(_value ?? []);
  const [keyword, setKeyword] = React.useState<string>();

  React.useEffect(() => {
    setValue(_value ?? []);
  }, [_value]);

  const query = api.service.getMultiple.useInfiniteQuery(
    {
      scopes,
      keyword,
      levels: ["main"],
      pagination: "cursor",
      statuses: ["active"],
    },
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
}>) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(_value ?? []);
  const [keyword, setKeyword] = React.useState<string>();

  React.useEffect(() => {
    setValue(_value ?? []);
  }, [_value]);

  const query = api.warehouse.getMultiple.useInfiniteQuery(
    { keyword, pagination: "cursor", statuses: ["active"] },
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
          setKeyword("");
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
