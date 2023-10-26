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

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="ghost"
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Select Dates</span>
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
