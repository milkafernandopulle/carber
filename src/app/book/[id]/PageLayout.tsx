"use client";
import { Fragment, useState } from "react";
import { Dialog, Popover, RadioGroup, Tab, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon, ChevronDownIcon, TrashIcon } from "@heroicons/react/20/solid";
import { Vehicle, VehicleBooking } from "@prisma/client";
import { capitalCase } from "change-case";
import BookingForm, { FormSchema } from "./BookingForm";
import { createBooking } from "./actions";
import { parse, format, differenceInMinutes } from "date-fns";

type PageLayoutProps = {
  vehicle: Vehicle;
  user: {
    firstName: string;
    lastName: string;
  };
};
export default function PageLayout({ vehicle, user }: PageLayoutProps) {
  async function handleOnSubmit(values: FormSchema) {
    await createBooking(values, vehicle);
  }
  return (
    <div className="bg-gray-50">
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <h1 className="sr-only">Checkout</h1>
          <BookingForm onSubmit={handleOnSubmit} vehicle={vehicle} user={user} />
        </div>
      </main>
    </div>
  );
}
