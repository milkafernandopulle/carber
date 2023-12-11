"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarDaysIcon } from "@heroicons/react/20/solid";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect } from "react";
import { enGB } from "date-fns/locale";

export interface DatePickerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "value"> {
  value?: Date;
}

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, value: date, onChange, ...props }, ref) => {
    const handleOnSelect = (date?: Date) => {
      if (onChange) {
        onChange({
          target: {
            value: date,
          },
        } as any);
      }
    };

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal border border-input !bg-white !border-gray-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 rounded-md",
              !date && "text-muted-foreground"
            )}>
            <CalendarDaysIcon className="mr-2 h-4 w-4" />
            {date ? (
              format(date, "P", {
                locale: enGB,
              })
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={date} onSelect={handleOnSelect} initialFocus />
        </PopoverContent>
      </Popover>
    );
  }
);
DatePicker.displayName = "DatePicker";

export { DatePicker };
