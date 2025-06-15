"use client";

import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import * as React from "react";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";

export function Combobox<T>({
  open,
  setOpen,
  asChild,
  records,
  children,
  disabled,
  getLabel,
  getOptionLabel,
  onOptionSelect,
  getOptionCurrentRecord,
}: React.PropsWithChildren<{
  open: boolean;
  records: T[];
  disabled?: boolean;
  asChild?: boolean;
  getLabel: () => React.ReactNode;
  getOptionLabel: (record: T) => React.ReactNode;
  getOptionCurrentRecord: (record: T) => T | undefined;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onOptionSelect: (record: T, current: T | undefined) => void;
}>) {
  return (
    <Popover modal open={open} onOpenChange={setOpen}>
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
        <Command>
          <CommandInput placeholder="Type keyword to search option" />
          <CommandList className="max-h-48">
            <CommandEmpty>No option found</CommandEmpty>
            <CommandGroup>
              {records.map((record, i) => {
                const current = getOptionCurrentRecord(record);

                return (
                  <CommandItem
                    key={i}
                    onSelect={() => {
                      onOptionSelect(record, current);
                    }}
                  >
                    <div className="max-w-[var(--radix-popover-trigger-width)]">
                      {getOptionLabel(record)}
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
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
