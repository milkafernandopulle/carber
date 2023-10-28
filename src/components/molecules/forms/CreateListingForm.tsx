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

const formSchema = z.object({
  make: z.string(),
  model: z.string(),
  fuel: z.string(),
  transmission: z.string(),
  vehicleType: z.string(),
  seats: z.number(),
  engine: z.number().min(500).max(10000),
  color: z.string().min(1, { message: "Color is required" }),
  year: z
    .number()
    .min(2000, {
      message: "Manufactured year must be greater than 2000",
    })
    .max(new Date().getFullYear(), {
      message: `Manufactured year must be less or equal than ${new Date().getFullYear()}`,
    }),
  allowedMilage: z
    .number()
    .min(1, {
      message: "Allowed milage must be greater than 0KM",
    })
    .max(1000000, {
      message: "Allowed milage must be less than 1000000KM",
    }),
});

function getDefaultValues() {
  faker.seed(new Date().getMinutes());
  if (process.env.NEXT_PUBLIC_USE_FAKER_FORM_FILL !== "true") {
    return {};
  }
  return {
    make: faker.helpers.arrayElement(VehicleManufacturers),
    model: faker.vehicle.model(),
    fuel: faker.helpers.arrayElement(FuelTypes),
    transmission: faker.helpers.arrayElement(TransmissionTypes),
    vehicleType: faker.helpers.arrayElement(VehicleTypes),
    seats: faker.helpers.arrayElement(SeatCountTypes),
    engine: faker.number.int({ min: 9, max: 30 }) * 100,
    color: faker.color.human(),
    year: faker.number.int({ min: 2000, max: 2023 }),
    allowedMilage: faker.number.int({ min: 5, max: 10 }) * 1000,
  };
}

type CreateListingFormProps = {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
};
export default function CreateListingForm({ onSubmit }: CreateListingFormProps) {
  const defaults = getDefaultValues();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaults,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="border-b border-t border-gray-200 bg-white shadow sm:rounded-lg sm:border p-4 sm:p-6">
          <div className="space-y-12">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
              <div>
                <h2 className="text-base font-semibold leading-7 text-gray-900">Vehicle</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  We need some basic information about your vehicle.
                </p>
              </div>
              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                <div className="sm:col-span-3">
                  <SelectFormField
                    name="make"
                    items={VehicleManufacturers}
                    label="Make"
                    placeholder="Select Make"
                  />
                </div>

                <div className="sm:col-span-3">
                  <TextFormField name="model" label="Model" placeholder="Enter model" />
                </div>
                <div className="sm:col-span-3">
                  <SelectFormField
                    name="fuel"
                    items={FuelTypes}
                    label="Fuel"
                    placeholder="Select fuel type"
                  />
                </div>
                <div className="sm:col-span-3">
                  <SelectFormField
                    name="transmission"
                    label="Transmission"
                    items={TransmissionTypes}
                    placeholder="Select transmission type"
                  />
                </div>
                <div className="sm:col-span-3">
                  <SelectFormField
                    name="vehicleType"
                    items={VehicleTypes}
                    label="Vehicle Type"
                    placeholder="Select vehicle type"
                  />
                </div>
                <div className="sm:col-span-3">
                  <TextFormField
                    name="engine"
                    label="Engine Capacity(CC)"
                    placeholder="Enter engine capacity"
                  />
                </div>
                <div className="sm:col-span-3">
                  <SelectFormField
                    name="seats"
                    label="Seat Count"
                    items={SeatCountTypes}
                    placeholder="Select seat count"
                  />
                </div>
                <div className="sm:col-span-3">
                  <TextFormField name="color" label="Color" placeholder="Enter color" />
                </div>
                <div className="sm:col-span-3">
                  <TextFormField
                    name="allowedMilage"
                    label="Allowed Milage(KM)"
                    placeholder="Enter allowed milage"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <Button variant="ghost" type="button">
              Cancel
            </Button>
            <Button disabled={form.formState.isSubmitting} type="submit">
              Save
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );

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

  function TextFormField({
    name,
    label,
    placeholder,
  }: {
    name: Path<z.infer<typeof formSchema>>;
    label: string;
    placeholder: string;
  }) {
    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Input
                type="text"
                value={field.value}
                onChange={field.onChange}
                placeholder={placeholder}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
}

const VehicleManufacturers = [
  "Abarth",
  "AC",
  "Acura",
  "Aixam",
  "Alfa Romeo",
  "Ariel",
  "Arrinera",
  "Aston Martin",
  "Audi",
  "Bentley",
  "BMW",
  "Bugatti",
  "Buick",
  "Cadillac",
  "Caterham",
  "Chevrolet",
  "Chrysler",
  "Citroën",
  "Corvette",
  "Dacia",
  "Daf",
  "Daihatsu",
  "Dodge",
  "DR Motor",
  "Elfin",
  "Ferrari",
  "Fiat",
  "Ford",
  "Gaz",
  "Geely",
  "Gillet",
  "Ginetta",
  "General Motors",
  "GMC",
  "Great Wall",
  "Gumpert",
  "Hennessey logo",
  "Holden",
  "Honda",
  "Hummer",
  "Hyundai",
  "Infiniti",
  "Isuzu",
  "Jaguar",
  "Jeep",
  "Joss",
  "Kia",
  "Koenigsegg",
  "Lada",
  "Lamborghini",
  "Lancia",
  "Land Rover",
  "Lexus",
  "Lincoln",
  "Lotus",
  "Luxgen",
  "Mahindra",
  "Maruti Suzuki",
  "Maserati",
  "Maybach",
  "Mazda",
  "Mclaren",
  "Mercedes",
  "MG",
  "Mini",
  "Mitsubishi",
  "Morgan Motor",
  "Mustang logo",
  "Nissan",
  "Noble",
  "Opel",
  "Pagani",
  "Panoz",
  "Perodua",
  "Peugeot",
  "Piaggio",
  "Pininfarina",
  "Porsche",
  "Proton",
  "Renault",
  "Reva",
  "Rimac",
  "Rolls Royce",
  "Ruf logo",
  "Saab",
  "Scania",
  "Scion",
  "Seat",
  "Shelby",
  "Skoda",
  "Smart",
  "Spyker",
  "Ssangyong",
  "SSC",
  "Subaru",
  "Suzuki",
  "Tata",
  "Tatra",
  "Tesla",
  "Toyota",
  "Tramontana",
  "Troller",
  "TVR",
  "UAZ",
  "Vandenbrink",
  "Vauxhall",
  "Vector Motors",
  "Venturi",
  "Volkswagen",
  "Volvo",
  "Wiesmann",
  "Zagato",
  "Zaz",
  "Zil",
] as const;

const FuelTypes = ["Petrol", "Diesel"] as const;

const TransmissionTypes = ["Auto", "Manual"] as const;

const VehicleTypes = [
  "Compact",
  "Coupe",
  "Convertible",
  "CrossOver",
  "Hatchback",
  "Sedan",
  "SUV",
  "Wagon",
  "Van",
] as const;

const SeatCountTypes = [2, 4, 5, 6, 7] as const;
