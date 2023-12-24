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
import FileUploadInput from "@/components/atoms/forms/FileUploadInput";
import TextInputField from "@/components/atoms/forms/TextInputField";
import SelectField from "@/components/atoms/forms/SelectField";

import FileUploadField from "@/components/atoms/forms/FileUploadField";
import { DialogFooter } from "@/components/ui/dialog";
import PostcodeField from "@/components/atoms/forms/PostcodeField";

const formSchema = z.object({
  make: z.string(),
  model: z.string().min(1, {
    message: "Required",
  }),
  fuel: z.string().min(1, {
    message: "Required",
  }),
  transmission: z.string().min(1, {
    message: "Required",
  }),
  vehicleType: z.string().min(1, {
    message: "Required",
  }),
  seats: z.number().min(1, {
    message: "Required",
  }),
  engine: z.number().min(500).max(10000),
  pricePerDay: z
    .number()
    .min(1, {
      message: "Required",
    })
    .max(10000),
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
      message: "Allowed milage must be less than 1000000mi",
    }),
  images: z.array(z.string()),
  locationPostcode: z.string().min(1, {
    message: "Required",
  }),
  locationAddressLine1: z.string().min(1, {
    message: "Required",
  }),
  locationAddressLine2: z.string().optional(),
});

type EditFormProps = {
  defaultValues?: z.infer<typeof formSchema>;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  onCancel: () => void;
};
export default function EditForm({ defaultValues, onSubmit, onCancel }: EditFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-3">
              <SelectField
                name="make"
                items={VehicleManufacturers}
                label="Make"
                placeholder="Select Make"
              />
            </div>

            <div className="sm:col-span-3">
              <TextInputField
                type="text"
                name="model"
                label="Model"
                placeholder="Enter model"
                maxLength={10}
              />
            </div>
            <div className="sm:col-span-3">
              <SelectField
                name="fuel"
                items={FuelTypes}
                label="Fuel"
                placeholder="Select fuel type"
              />
            </div>
            <div className="sm:col-span-3">
              <SelectField
                name="transmission"
                label="Transmission"
                items={TransmissionTypes}
                placeholder="Select transmission type"
              />
            </div>
            <div className="sm:col-span-3">
              <SelectField
                name="vehicleType"
                items={VehicleTypes}
                label="Vehicle Type"
                placeholder="Select vehicle type"
              />
            </div>
            <div className="sm:col-span-3">
              <TextInputField
                type="number"
                name="engine"
                label="Engine Capacity(CC)"
                placeholder="Enter engine capacity"
                maxLength={6}
              />
            </div>
            <div className="sm:col-span-3">
              <SelectField
                name="seats"
                label="Seat Count"
                items={SeatCountTypes}
                placeholder="Select seat count"
              />
            </div>
            <div className="sm:col-span-3">
              <TextInputField name="color" label="Color" placeholder="Enter color" maxLength={10} />
            </div>
            <div className="sm:col-span-3">
              <TextInputField
                type="number"
                name="year"
                label="Year"
                placeholder="Enter year"
                maxLength={4}
              />
            </div>
            <div className="sm:col-span-3">
              <TextInputField
                name="allowedMilage"
                label="Allowed Milage(miles)"
                placeholder="Enter allowed milage"
                type="number"
              />
            </div>
            <div className="sm:col-span-3">
              <TextInputField
                name="pricePerDay"
                label="Price Per Day (£)"
                placeholder="Enter price per day for renting"
                type="number"
                maxLength={4}
              />
            </div>
            <div className="sm:col-span-6">
              <FileUploadField
                uploadUrl="/list-new/image-upload"
                name="images"
                label="Upload Photos"
              />
            </div>
            <div className="sm:col-span-3">
              <TextInputField
                name="locationAddressLine1"
                label="Address Line 1"
                placeholder="Enter Address Line 1"
                maxLength={100}
              />
            </div>
            <div className="sm:col-span-3">
              <TextInputField
                name="locationAddressLine2"
                label="Address Line 2 (Optional)"
                placeholder="Enter Address Line 2"
                maxLength={100}
              />
            </div>
            <div className="sm:col-span-3">
              <PostcodeField name="locationPostcode" label="Postcode" />
            </div>
            <div className="sm:col-span-6">
              <DialogFooter className="text-right flex-1 mb-4">
                <Button onClick={onCancel} variant="outline" type="button">
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
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
