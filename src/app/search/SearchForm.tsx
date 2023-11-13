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

const formSchema = z.object({
  make: z.string().optional(),
  model: z.string().optional(),
  fuel: z.string().optional(),
  transmission: z.string().optional(),
  vehicleType: z.string().optional(),
  seats: z.number().optional(),
  year: z.number().optional(),
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
        make: values.make === "-" ? undefined : values.make,
        model: values.model === "-" ? undefined : values.model,
        year: values.year?.toString() === "-" ? undefined : values.year,
        transmission: values.transmission === "-" ? undefined : values.transmission,
        vehicleType: values.vehicleType === "-" ? undefined : values.vehicleType,
        seats: values.seats?.toString() === "-" ? undefined : values.seats,
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
        control={form.control}
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
          <CardContent>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
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

  const search = {
    make: searchParams.get("make") || "-",
    model: searchParams.get("model") || "-",
    fuel: searchParams.get("fuel") || "-",
    transmission: searchParams.get("transmission") || "-",
    vehicleType: searchParams.get("vehicleType") || "-",
    seats: searchParams.get("seats") || ("-" as unknown as number),
    year: searchParams.get("year") || ("-" as unknown as number),
  } as FormSchema;

  const onSubmit = (values: FormSchema) => {
    const params = new URLSearchParams(
      Object.keys({
        make: values.make || "",
        model: values.model || "",
        fuel: values.fuel || "",
        transmission: values.transmission || "",
        vehicleType: values.vehicleType || "",
        seats: values.seats?.toString() || "",
        year: values.year?.toString() || "",
      }).reduce((acc: any, cur: any) => {
        if (values[cur as keyof FormSchema]) {
          acc[cur] = values[cur as keyof FormSchema];
        }
        return acc;
      }, {})
    );

    router.push("/search?" + params.toString());
  };

  return { search, onSubmit };
}
