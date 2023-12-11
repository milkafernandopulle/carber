"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { addDays, format } from "date-fns";
import { DateRange, Matcher } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useMemo } from "react";
import { enGB } from "date-fns/locale";

export type DateRangePickerProps = {
  value: DateRange | undefined;
  onChange: (value: DateRange | undefined) => void;
  disableRanges?: Matcher[];
};

function DateRangePicker({ value, onChange, disableRanges }: DateRangePickerProps) {
  return <DatePickerWithRange value={value} onChange={onChange} disableRanges={disableRanges} />;
}

export { DateRangePicker };

type DatePickerWithRangeProps = {
  className?: string;
  value: DateRange | undefined;
  onChange: (value: DateRange | undefined) => void;
  disableRanges?: Matcher[];
};
export function DatePickerWithRange({
  className,
  value,
  onChange,
  disableRanges,
}: DatePickerWithRangeProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(value);

  useEffect(() => {
    if (JSON.stringify(date) !== JSON.stringify(value)) {
      onChange(date);
    }
  }, [onChange, date, value]);

  useEffect(() => {
    setDate(value);
  }, [value]);

  const disableDates = useMemo(
    () => [{ before: addDays(new Date(), 1) }, ...(disableRanges || [])],
    [disableRanges]
  );

  const handleOpenChange = (open: boolean) => {
    console.log(date);
    if (!open) {
      if (!date?.from || !date?.to) {
        setDate(undefined);
      }
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-left rounded-md font-normal border border-input !bg-white !border-gray-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
              !date && "text-muted-foreground"
            )}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y", {
                    locale: enGB,
                  })}{" "}
                  -{" "}
                  {format(date.to, "LLL dd, y", {
                    locale: enGB,
                  })}
                </>
              ) : (
                format(date.from, "LLL dd, y", {
                  locale: enGB,
                })
              )
            ) : (
              <span>Add date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            disabled={disableDates}
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
