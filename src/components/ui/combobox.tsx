"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type ComboboxProps = React.HTMLAttributes<HTMLInputElement> & {
  items: readonly string[];
  onValueChange: (value: string) => void;
  value: string;
  onSearchChange: (value: string) => void;
};
const Combobox = React.forwardRef<ComboboxProps, ComboboxProps>(
  ({ value, items, onSearchChange, onValueChange, className }, ref) => {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState<string>("");

    const handleSearchValueChange = React.useCallback(
      (str: string) => {
        setSearch(str);
        if (str?.trim()) {
          onSearchChange(str);
        }
      },
      [onSearchChange]
    );

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between rounded-md", className)}>
            {value?.toUpperCase() || "Select..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput
              placeholder="Start typing..."
              value={search}
              onValueChange={handleSearchValueChange}
              onValueClear={() => {
                onValueChange("");
                setOpen(false);
              }}
            />
            <CommandEmpty>No items found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item}
                  value={item}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}>
                  <Check
                    className={cn("mr-2 h-4 w-4", value === item ? "opacity-100" : "opacity-0")}
                  />
                  {item}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);
Combobox.displayName = "Combobox";

export { Combobox };
