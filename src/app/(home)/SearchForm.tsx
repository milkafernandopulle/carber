"use client";
import DatePickerField from "@/components/atoms/forms/DatePickerField";
import SelectField from "@/components/atoms/forms/SelectField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays } from "date-fns";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  startDate: z.date(),
  startTime: z.string(),
  endDate: z.date(),
  endTime: z.string(),
});

type FormSchema = z.infer<typeof formSchema>;

const defaultValues: FormSchema = {
  startDate: addDays(new Date(), 1),
  startTime: "10.00AM",
  endDate: addDays(new Date(), 2),
  endTime: "10.00AM",
};

export default function SearchForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) => {
    const params = new URLSearchParams({
      startDate: data.startDate.toISOString().split("T")[0],
      startTime: data.startTime,
      endDate: data.endDate.toISOString().split("T")[0],
      endTime: data.endTime,
    });

    router.push(`/search?${params.toString()}`);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardContent>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <DatePickerField label="Start Date" name="startDate" placeholder="" />
              </div>
              <div className="sm:col-span-3">
                <DatePickerField label="End Date" name="endDate" placeholder="" />
              </div>
              <div className="sm:col-span-3">
                <SelectField items={times} label="End Time" name="startTime" />
              </div>
              <div className="sm:col-span-3">
                <SelectField items={times} label="End Time" name="endTime" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-center">
            <Button type="submit">Search</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

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
