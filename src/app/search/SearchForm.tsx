"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Form,
  FormControl,
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
import { Path, useForm } from "react-hook-form";
import { faker } from "@faker-js/faker";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import DatePickerField from "@/components/atoms/forms/DatePickerField";
import SelectField from "@/components/atoms/forms/SelectField";
import { addDays, format, parse } from "date-fns";
import TextInputField from "@/components/atoms/forms/TextInputField";

const formSchema = z.object({
  startDate: z.date(),
  startTime: z.string(),
  endDate: z.date(),
  endTime: z.string(),
  make: z.string().optional(),
  model: z.string().optional(),
  fuel: z.string().optional(),
  transmission: z.string().optional(),
  vehicleType: z.string().optional(),
  seats: z.number().optional(),
  year: z.number().optional(),
  postcode: z.string().optional(),
  distance: z.number().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

type SearchFormProps = {
  searchMetaData: {
    makeAndModel: { [make: string]: string[] };
    year: number[];
    transmission: string[];
    vehicleType: string[];
    seats: number[];
  };
};
export default function SearchForm({ searchMetaData }: SearchFormProps) {
  const { onSubmit, search } = useSearch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: search,
  });

  const makes = Object.keys(searchMetaData.makeAndModel);

  const models = searchMetaData.makeAndModel[form.watch("make") || ""];

  const { handleSubmit, watch } = form;

  useEffect(() => {
    const subscription = watch((values) => {
      onSubmit({
        startDate: values.startDate || new Date(),
        startTime: values.startTime || "10.00AM",
        endDate: values.endDate || new Date(),
        endTime: values.endTime || "10.00AM",
        make: values.make === "-" ? undefined : values.make,
        model: values.model === "-" ? undefined : values.model,
        year: values.year?.toString() === "-" ? undefined : values.year,
        transmission: values.transmission === "-" ? undefined : values.transmission,
        vehicleType: values.vehicleType === "-" ? undefined : values.vehicleType,
        seats: values.seats?.toString() === "-" ? undefined : values.seats,
        postcode: values.postcode?.toString() === "-" ? undefined : values.postcode,
        distance: values.distance?.toString() === "-" ? undefined : values.distance,
      });
    });
    return () => subscription.unsubscribe();
  }, [handleSubmit, watch, onSubmit]);

  function SelectFormField({
    name,
    label,
    items,
    placeholder,
  }: {
    name: Path<z.infer<typeof formSchema>>;
    label: string;
    items: readonly (string | number)[];
    placeholder: string;
  }) {
    return (
      <FormField
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="overflow-y-auto max-h-[10rem]">
                <SelectItem value={"-"}>Any</SelectItem>
                {items.map((item) => (
                  <SelectItem key={item} value={item.toString()}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  return (
    <>
      <Form {...form}>
        <Card>
          <CardContent className="py-6 px-6">
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 border-b border-black/10 pb-6">
              <div className="sm:col-span-1">
                <TextInputField label="Postcode" name="postcode" placeholder="Enter Postcode" />
              </div>
              <div className="sm:col-span-1">
                <SelectField items={distances} label="nearby (miles)" name="distance" />
              </div>
              <div className="sm:col-span-1">
                <DatePickerField label="Start Date" name="startDate" placeholder="" />
              </div>
              <div className="sm:col-span-1">
                <SelectField items={times} label="Start Time" name="startTime" />
              </div>
              <div className="sm:col-span-1">
                <DatePickerField label="End Date" name="endDate" placeholder="" />
              </div>
              <div className="sm:col-span-1">
                <SelectField items={times} label="End Time" name="endTime" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6  pt-4">
              <div className="sm:col-span-1">
                <SelectFormField items={makes || []} label="Make" name="make" placeholder="" />
              </div>
              <div className="sm:col-span-1">
                <SelectFormField items={models || []} label="Model" name="model" placeholder="" />
              </div>
              <div className="sm:col-span-1">
                <SelectFormField
                  items={searchMetaData.year || []}
                  label="Year"
                  name="year"
                  placeholder=""
                />
              </div>
              <div className="sm:col-span-1">
                <SelectFormField
                  items={searchMetaData.transmission || []}
                  label="Transmission"
                  name="transmission"
                  placeholder=""
                />
              </div>
              <div className="sm:col-span-1">
                <SelectFormField
                  items={searchMetaData.vehicleType || []}
                  label="Body Type"
                  name="vehicleType"
                  placeholder=""
                />
              </div>
              <div className="sm:col-span-1">
                <SelectFormField
                  items={searchMetaData.seats || []}
                  label="Seats"
                  name="seats"
                  placeholder=""
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </Form>
    </>
  );
}

function useSearch() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const startDateParam = searchParams.get("startDate");
  const endDateParam = searchParams.get("endDate");

  const search = {
    startDate: startDateParam
      ? parse(startDateParam, "yyyy-MM-dd", new Date())
      : addDays(new Date(), 1),
    startTime: searchParams.get("startTime") || "10.00AM",
    endDate: endDateParam ? parse(endDateParam, "yyyy-MM-dd", new Date()) : addDays(new Date(), 1),
    endTime: searchParams.get("endTime") || "10.00AM",
    make: searchParams.get("make") || "-",
    model: searchParams.get("model") || "-",
    fuel: searchParams.get("fuel") || "-",
    transmission: searchParams.get("transmission") || "-",
    vehicleType: searchParams.get("vehicleType") || "-",
    seats: searchParams.get("seats") || ("-" as unknown as number),
    year: searchParams.get("year") || ("-" as unknown as number),
    distance: searchParams.get("distance") || (10 as unknown as number),
    postcode: searchParams.get("postcode") || ("" as unknown as string),
  } as FormSchema;

  const onSubmit = (values: FormSchema) => {
    const formattedValues = {
      startDate: format(values.startDate, "yyyy-MM-dd"),
      startTime: searchParams.get("startTime") || "10.00AM",
      endDate: format(values.endDate, "yyyy-MM-dd"),
      endTime: searchParams.get("endTime") || "10.00AM",
      make: values.make || "",
      model: values.model || "",
      fuel: values.fuel || "",
      transmission: values.transmission || "",
      vehicleType: values.vehicleType || "",
      seats: values.seats?.toString() || "",
      year: values.year?.toString() || "",
      postcode: values.postcode?.toString() || "",
      distance: values.distance || "",
    };
    const params = new URLSearchParams(
      Object.keys(formattedValues).reduce((acc: any, cur: any) => {
        if (formattedValues[cur as keyof FormSchema]) {
          acc[cur] = formattedValues[cur as keyof FormSchema];
        }
        return acc;
      }, {})
    );
    router.push("/search?" + params.toString());
  };

  return { search, onSubmit };
}

const distances = [1, 2, 5, 10, 15, 20, 30, 40, 50, 100, 500];

const times = [
  "12.00AM",
  "12.30AM",
  "01.00AM",
  "01.30AM",
  "02.00AM",
  "02.30AM",
  "03.00AM",
  "03.30AM",
  "04.00AM",
  "04.30AM",
  "05.00AM",
  "05.30AM",
  "06.00AM",
  "06.30AM",
  "07.00AM",
  "07.30AM",
  "08.00AM",
  "08.30AM",
  "09.00AM",
  "09.30AM",
  "10.00AM",
  "10.30AM",
  "11.00AM",
  "11.30AM",
  "12.00PM",
  "12.30PM",
  "01.00PM",
  "01.30PM",
  "02.00PM",
  "02.30PM",
  "03.00PM",
  "03.30PM",
  "04.00PM",
  "04.30PM",
  "05.00PM",
  "05.30PM",
  "06.00PM",
  "06.30PM",
  "07.00PM",
  "07.30PM",
  "08.00PM",
  "08.30PM",
  "09.00PM",
  "09.30PM",
  "10.00PM",
  "10.30PM",
  "11.00PM",
  "11.30PM",
];
