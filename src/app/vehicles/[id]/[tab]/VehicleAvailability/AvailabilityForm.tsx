"use client";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import { UpdateVehicleAvailabilityParams } from "./actions";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Path, useFieldArray, useForm } from "react-hook-form";
import { faker } from "@faker-js/faker";
import { Button } from "@/components/ui/button";
import { Vehicle, VehicleAvailability } from "@prisma/client";
import clsx from "clsx";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { addDays } from "date-fns";
import { DateRange, Matcher } from "react-day-picker";
import { useCallback, useEffect, useRef, useState } from "react";
import { Calendar } from "@/components/ui/calendar";

const formSchema = z.object({
  vehicleId: z.number().min(1),
  availabilities: z.array(
    z.object({
      from: z.date(),
      to: z.date(),
    })
  ),
});

type FormSchemaType = z.infer<typeof formSchema>;

type AvailabilityFormProps = {
  vehicle: Vehicle & { availabilities: VehicleAvailability[] };
  onSubmit: (values: UpdateVehicleAvailabilityParams) => void;
};
export default function AvailabilityForm({ vehicle, onSubmit }: AvailabilityFormProps) {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: { vehicleId: vehicle.id, availabilities: vehicle.availabilities },
  });

  const { handleSubmit, watch } = form;

  useEffect(() => {
    const subscription = watch((values) => {
      if (values.vehicleId) {
        onSubmit({
          vehicleId: values.vehicleId,
          availabilities:
            values.availabilities?.reduce<any>((acc, cur) => {
              if (cur?.from && cur?.to) {
                acc.push({ from: cur?.from, to: cur?.to });
              }
              return acc;
            }, []) || [],
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [handleSubmit, watch, onSubmit]);

  const lastAvailabilitiesCount = useRef<number>();
  const availabilities = watch("availabilities");

  useEffect(() => {
    if (availabilities.length === 0 && lastAvailabilitiesCount.current === 1) {
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } else if (availabilities.length === 1 && lastAvailabilitiesCount.current === 0) {
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    }
    lastAvailabilitiesCount.current = availabilities.length;
  }, [availabilities.length]);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit as any)}>
          <div>
            <FormField
              control={form.control}
              name="availabilities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available Dates</FormLabel>
                  <FormDescription>
                    Select dates of availability for your vehicle. You can select multiple ranges.
                  </FormDescription>
                  <FormControl>
                    <DateListInput value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </>
  );
}

type DateRangeWithId = { id: number; date?: DateRange };
type DateListInputProps = {
  value?: DateRange[];
  onChange: (value: DateRange[]) => void;
};
function DateListInput({ value, onChange }: DateListInputProps) {
  const [dateList, setDateList] = useState<DateRangeWithId[]>([{ id: Math.random() }]);

  useEffect(() => {
    if (dateList.length < 1 || dateList?.at(-1)?.date !== undefined) {
      setDateList((prev) => [...prev, { id: Math.random() }]);
    }
  }, [dateList]);

  useEffect(() => {
    if (dateList) {
      onChange(dateList.map(({ date }) => date).filter(Boolean) as DateRange[]);
    }
  }, [onChange, dateList]);

  useEffect(() => {
    setDateList((prev) => {
      if (JSON.stringify(value) === JSON.stringify(prev.map(({ date }) => date).filter(Boolean))) {
        return prev;
      }

      return value?.map((date) => ({ id: Math.random(), date })) || [];
    });
  }, [value]);

  const handleChange = useCallback(
    (itemId: number) => (date?: DateRange) => {
      if (!date?.from || !date?.to) {
        return;
      }
      setDateList((prev) => {
        let newDateList = prev?.map((item, i) => {
          if (item.id === itemId) {
            return { ...item, date };
          }
          return item;
        });
        return newDateList;
      });
    },
    [setDateList]
  );

  const disableDates = (itemId: number) => {
    const dates = (
      (dateList || [])
        ?.filter((item) => item.id !== itemId)
        .map(({ date }) => date)
        .filter(Boolean) as DateRange[]
    )
      .filter((date) => date.from && date.to)
      .map((date) => ({
        after: addDays(date.from as Date, -1),
        before: addDays(date.to as Date, 1),
      }));
    return dates as Matcher[];
  };

  const handleRemoveRange = useCallback(
    (itemId: number) => () => {
      setDateList((prev) => {
        const newDateList = prev?.filter(({ id }) => id !== itemId);
        return newDateList;
      });
    },
    [setDateList]
  );

  return (
    <>
      <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200">
        {dateList?.map(({ id, date }) => {
          return (
            <>
              <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                <div className="flex w-0 flex-1 items-center">
                  <DateRangePicker
                    key={JSON.stringify(date)}
                    onChange={handleChange(id)}
                    value={date}
                    disableRanges={disableDates(id)}
                  />
                </div>
                <div className="ml-4 flex-shrink-0">
                  {date && (
                    <Button onClick={handleRemoveRange(id)} variant="link">
                      Remove
                    </Button>
                  )}
                </div>
              </li>
            </>
          );
        })}
      </ul>
    </>
  );
}
