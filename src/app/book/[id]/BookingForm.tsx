"use client";
/* eslint-disable @next/next/no-img-element */

import { Fragment, useState, useMemo } from "react";
import { Dialog, Popover, RadioGroup, Tab, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon, ChevronDownIcon, TrashIcon } from "@heroicons/react/20/solid";
import { Vehicle } from "@prisma/client";
import { capitalCase } from "change-case";
import TextInputField from "@/components/atoms/forms/TextInputField";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormReturn, useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import SelectField from "@/components/atoms/forms/SelectField";
import FileUploadInput from "@/components/atoms/forms/FileUploadInput";
import FileUploadField from "@/components/atoms/forms/FileUploadField";
import DateRangePickerField from "@/components/atoms/forms/DateRangePickerField";
import DatePickerField from "@/components/atoms/forms/DatePickerField";
import { Button } from "@/components/ui/button";
import { fakerEN_GB as faker } from "@faker-js/faker";
import { addDays, differenceInMinutes, format, parse, set } from "date-fns";
import { useLocalStorage } from "@uidotdev/usehooks";

const deliveryMethods = [
  { id: 1, title: "Standard", turnaround: "4–10 business days", price: "$5.00" },
  { id: 2, title: "Express", turnaround: "2–5 business days", price: "$16.00" },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const requiredMessage = { message: "Invalid value" };

const formSchema = z
  .object({
    pickupDate: z.date(),
    pickupTime: z.string(),
    dropOffDate: z.date(),
    dropOffTime: z.string(),
    bookingUserFirstName: z.string(),
    bookingUserLastName: z.string(),
    bookingUserContactNo: z.string(),
    bookingUserAddressPostCode: z.string(),
    bookingUserAddressLine1: z.string(),
    bookingUserAddressLine2: z.string(),
    bookingUserAddressCity: z.string(),
    bookingUserAddressCountry: z.string(),
    bookingUserDrivingLicenseNo: z.string(),
    bookingUserDrivingLicenseIssueCountry: z.string(),
    bookingUserDrivingLicensePhoto: z.array(z.string()),
    bookingUserEmergencyContactPhone: z.string(),
    bookingUserEmergencyContactName: z.string(),
    PaymentCardNo: z.string().min(16, requiredMessage).max(16, requiredMessage),
    PaymentCardName: z.string().min(1, requiredMessage).max(100, requiredMessage),
    PaymentCardExp: z
      .string()
      .min(5, requiredMessage)
      .max(5, requiredMessage)
      .refine(
        (value) => {
          const [mm, yy] = value.split("/");
          return (mm + yy).length === 4 && parseInt(yy + mm, 10) > 2312;
        },
        {
          message: "Invalid value",
        }
      ),
    PaymentCardSecret: z.string().min(3, requiredMessage).max(4, requiredMessage),
  })
  .refine(
    (data) => {
      const dropOff = set(data.dropOffDate, { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
      const pickup = set(data.pickupDate, { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
      return pickup <= dropOff;
    },
    {
      message: "Drop off date must be after pickup date",
      path: ["dropOffDate"],
    }
  )
  .refine(
    (data) => {
      const dropOff = set(data.dropOffDate, { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
      const pickup = set(data.pickupDate, { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });

      if (pickup.toISOString() !== dropOff.toISOString()) {
        return true;
      }
      let pickDate = parse(
        `${format(data.pickupDate, "yyyy-MM-dd")} ${data.pickupTime}`,
        "yyyy-MM-dd hh.mmaa",
        new Date()
      );
      let dropDate = parse(
        `${format(data.dropOffDate, "yyyy-MM-dd")} ${data.dropOffTime}`,
        "yyyy-MM-dd hh.mmaa",
        new Date()
      );

      return dropDate > pickDate;
    },
    {
      message: "Drop off time must be after pickup time",
      path: ["dropOffTime"],
    }
  );

export type FormSchema = z.infer<typeof formSchema>;

function getDefaultValues() {
  faker.seed(new Date().getMinutes());
  if (process.env.NEXT_PUBLIC_USE_FAKER_FORM_FILL !== "true") {
    return {
      bookingUserAddressCountry: "United Kingdom",
      bookingUserDrivingLicenseIssueCountry: "United Kingdom",
    };
  }
  return {
    pickupDate: addDays(new Date(), 1),
    pickupTime: "10.00AM",
    dropOffDate: addDays(new Date(), 2),
    dropOffTime: "10.00AM",
    bookingUserContactNo: faker.helpers.replaceSymbols("077#########"),
    bookingUserAddressPostCode: faker.location.zipCode("??##??"),
    bookingUserAddressLine1: faker.location.secondaryAddress(),
    bookingUserAddressLine2: faker.location.street(),
    bookingUserAddressCity: faker.location.county(),
    bookingUserAddressCountry: "United Kingdom",
    bookingUserDrivingLicenseNo: faker.helpers.replaceSymbols("??########"),
    bookingUserDrivingLicenseIssueCountry: "United Kingdom",
    bookingUserDrivingLicensePhoto: [
      "https://picsum.photos/id/183/200/300",
      "https://picsum.photos/id/208/200/300",
    ],
    bookingUserEmergencyContactPhone: faker.helpers.replaceSymbols("077#########"),
    bookingUserEmergencyContactName: faker.person.fullName(),
    PaymentCardNo: faker.finance.creditCardNumber().replaceAll("-", ""),
    PaymentCardName: faker.person.fullName(),
    PaymentCardExp: `${faker.datatype
      .number({ min: 1, max: 12 })
      .toString()
      .padStart(2, "0")}/${faker.datatype.number({
      min: 24,
      max: 30,
    })}`,
    PaymentCardSecret: faker.finance.creditCardCVV(),
  };
}

type BookingFormProps = {
  vehicle: Vehicle;
  user: {
    firstName: string;
    lastName: string;
  };
  onSubmit: (values: z.infer<typeof formSchema>) => void;
};
export default function BookingForm({ vehicle, user, onSubmit }: BookingFormProps) {
  const defaultValues = getDefaultValues();

  const [lastSearchParamsStr] = useLocalStorage("lastSearchParams", "{}");

  const lastSearchParams = useMemo(() => {
    return JSON.parse(lastSearchParamsStr);
  }, [lastSearchParamsStr]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...defaultValues,
      bookingUserFirstName: user.firstName,
      bookingUserLastName: user.lastName,
      pickupDate: new Date(lastSearchParams.startDate),
      pickupTime: lastSearchParams.startTime,
      dropOffDate: new Date(lastSearchParams.endDate),
      dropOffTime: lastSearchParams.endTime,
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });

  const invoiceTotals = useInvoiceCalculations(form, vehicle.pricePerDay);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
        <div>
          <div>
            <h2 className="text-lg font-medium text-gray-900">Booking information</h2>

            <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              <div>
                <TextInputField label="Pickup Date" name="pickupDate" disabled />
              </div>
              <div>
                <TextInputField label="Pickup Time" name="pickupTime" disabled />
              </div>
              <div>
                <TextInputField label="Drop off Date" name="dropOffDate" disabled />
              </div>
              <div>
                <TextInputField label="Drop off Time" name="dropOffTime" disabled />
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-gray-200 pt-10">
            <h2 className="text-lg font-medium text-gray-900">Driver information</h2>

            <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              <div>
                <TextInputField label="First name" name="bookingUserFirstName" disabled />
              </div>

              <div>
                <TextInputField label="Last name" name="bookingUserLastName" disabled />
              </div>

              <div className="sm:col-span-2">
                <TextInputField label="Address line 1" name="bookingUserAddressLine1" />
              </div>

              <div className="sm:col-span-2">
                <TextInputField label="Address line 2" name="bookingUserAddressLine2" />
              </div>

              <div>
                <TextInputField label="City/Town" name="bookingUserAddressCity" />
              </div>

              <div>
                <TextInputField label="Post code" name="bookingUserAddressPostCode" />
              </div>

              <div>
                <SelectField
                  items={["United Kingdom"]}
                  label="Country"
                  name="bookingUserAddressCountry"
                />
              </div>

              <div className="sm:col-span-2">
                <TextInputField label="Phone" name="bookingUserContactNo" />
              </div>

              <div>
                <TextInputField label="Driving License No" name="bookingUserDrivingLicenseNo" />
              </div>

              <div>
                <SelectField
                  items={["United Kingdom"]}
                  label="Driving License Issued Country"
                  name="bookingUserDrivingLicenseIssueCountry"
                />
              </div>

              <div className="sm:col-span-2">
                <FileUploadField
                  uploadUrl="/book/image-upload"
                  label="Driving License Photo (Front and Back)"
                  name="bookingUserDrivingLicensePhoto"
                />
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-gray-200 pt-10">
            <h2 className="text-lg font-medium text-gray-900">Emergency contact information</h2>

            <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              <div>
                <TextInputField label="Name" name="bookingUserEmergencyContactName" />
              </div>
              <div>
                <TextInputField label="Phone No" name="bookingUserEmergencyContactPhone" />
              </div>
            </div>
          </div>
          <div className="mt-10 border-t border-gray-200 pt-10">
            <h2 className="text-lg font-medium text-gray-900">Payment</h2>

            <div className="mt-6 grid grid-cols-4 gap-x-4 gap-y-6">
              <div className="col-span-4">
                <TextInputField label="Name on card" name="PaymentCardName" />
              </div>
              <div className="col-span-4">
                <TextInputField label="Card No" name="PaymentCardNo" type="number" />
              </div>
              <div className="col-span-2">
                <TextInputField label="Expiration date (MM/YY)" name="PaymentCardExp" />
              </div>
              <div className="col-span-2">
                <TextInputField label="CVC" name="PaymentCardSecret" type="number" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 lg:mt-0">
          <h2 className="text-lg font-medium text-gray-900">Booking Details</h2>

          <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
            <ul role="list" className="divide-y divide-gray-200">
              <li key={vehicle.id} className="flex px-4 py-6 sm:px-6">
                <div className="flex-shrink-0">
                  <img
                    src={vehicle.images?.[0] || "/images/vehicle-placeholder.avif"}
                    alt="vehicle"
                    className="w-40 rounded-md"
                  />
                </div>

                <div className="ml-6 flex flex-1 flex-col">
                  <div className="flex">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm">
                        <a
                          href={`view/${vehicle.id}`}
                          className="font-medium text-gray-700 hover:text-gray-800">
                          {vehicle.make} {vehicle.model} {vehicle.year}
                        </a>
                      </h4>
                      <ul className="grid grid-cols-2 mt-2 list-disc list-inside">
                        <li className="mt-1 text-sm text-gray-500">{capitalCase(vehicle.color)}</li>
                        <li className="mt-1 text-sm text-gray-500">{vehicle.engine}cc</li>
                        <li className="mt-1 text-sm text-gray-500">
                          {vehicle.transmission} Transmission
                        </li>
                        <li className="mt-1 text-sm text-gray-500">{vehicle.seats} Seats</li>
                        <li className="mt-1 text-sm text-gray-500">{vehicle.fuel}</li>
                        <li className="mt-1 text-sm text-gray-500">{vehicle.vehicleType} Body</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
            <dl className="space-y-6 border-t border-gray-200 px-4 py-6 sm:px-6">
              <div className="flex items-center justify-between">
                <dt className="text-sm">Total Hours</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {invoiceTotals.totalHours > 0 ? invoiceTotals.totalHours?.toFixed(2) : "-"}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm">Subtotal</dt>
                <dd className="text-sm font-medium text-gray-900">
                  £ {invoiceTotals.subTotal > 0 ? invoiceTotals.subTotal?.toFixed(2) : "-"}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm">Taxes</dt>
                <dd className="text-sm font-medium text-gray-900">
                  £ {invoiceTotals.tax > 0 ? invoiceTotals.tax?.toFixed(2) : "-"}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                <dt className="text-base font-medium">Total</dt>
                <dd className="text-base font-medium text-gray-900">
                  £ {invoiceTotals.total > 0 ? invoiceTotals.total?.toFixed(2) : "-"}
                </dd>
              </div>
            </dl>

            <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
              <Button type="submit" variant="default" size="xl" className="w-full">
                Confirm Booking
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}

function useInvoiceCalculations(
  form: UseFormReturn<z.infer<typeof formSchema>>,
  pricePerDay: number
) {
  const data = form.watch();
  const totals = useMemo(() => {
    if (!data.pickupDate || !data.pickupTime || !data.dropOffDate || !data.dropOffTime) {
      return {
        totalHours: 0,
        subTotal: 0,
        tax: 0,
        total: 0,
      };
    }
    let pickDate = parse(
      `${format(data.pickupDate, "yyyy-MM-dd")} ${data.pickupTime}`,
      "yyyy-MM-dd hh.mmaa",
      new Date()
    );
    let dropDate = parse(
      `${format(data.dropOffDate, "yyyy-MM-dd")} ${data.dropOffTime}`,
      "yyyy-MM-dd hh.mmaa",
      new Date()
    );
    if (dropDate <= pickDate) {
      return {
        totalHours: 0,
        subTotal: 0,
        tax: 0,
        total: 0,
      };
    }

    const mins = differenceInMinutes(dropDate, pickDate);

    const subTotal = (mins * pricePerDay) / (60 * 24);
    const tax = subTotal * 0.1;

    return {
      totalHours: mins / 60,
      subTotal,
      tax,
      total: subTotal + tax,
    };
  }, [data.dropOffDate, data.dropOffTime, data.pickupDate, data.pickupTime, pricePerDay]);

  return totals;
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
