"use client";
/* eslint-disable @next/next/no-img-element */
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import {
  CheckCircleIcon,
  EllipsisVerticalIcon,
  PaperClipIcon,
  PhotoIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { notFound } from "next/navigation";
import { capitalCase } from "change-case";
import { clsx } from "clsx";
import { Vehicle, VehicleBooking } from "@prisma/client";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { format } from "date-fns";

type VehicleBookingsProps = {
  vehicle: Vehicle;
  vehicleBookings: VehicleBooking[];
};
export default function VehicleBookings({ vehicle, vehicleBookings }: VehicleBookingsProps) {
  return (
    <>
      <div className="border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border">
        <ul role="list" className="divide-y divide-gray-200">
          <Accordion type="single" collapsible>
            {vehicleBookings.length === 0 && (
              <>
                <p className="px-4 text-center py-8">No Bookings</p>
              </>
            )}
            {vehicleBookings.map((booking) => (
              <AccordionItem key={booking.id} value={booking.id}>
                <li key={booking.id} className="p-4 sm:p-6">
                  <AccordionTrigger className="hover:no-underline !p-0">
                    <div className="font-medium text-gray-900 sm:flex sm:justify-between w-full mr-4 ">
                      <h5>
                        {booking.bookingUserFirstName} {booking.bookingUserLastName}
                      </h5>
                      <p className="mt-2 sm:mt-0">£ {booking.invoiceTotal.toFixed(2)}</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex items-center sm:items-start pt-3">
                      <div className="flex-1 text-sm">
                        <p className="hidden text-gray-500 sm:mt-2 sm:block">
                          Dates - {format(booking.bookingFrom, "dd MMM yyyy hh.mma")} -{" "}
                          {format(booking.bookingTo, "dd MMM yyyy hh.mma")}
                        </p>
                        <p className="hidden text-gray-500 sm:mt-2 sm:block">
                          Address - {booking.bookingUserAddressLine1},{" "}
                          {booking.bookingUserAddressLine2}, {booking.bookingUserAddressCity}{" "}
                          {booking.bookingUserAddressPostCode}, {booking.bookingUserAddressCountry}
                        </p>
                        <p className="hidden text-gray-500 sm:mt-2 sm:block">
                          Contact No - {booking.bookingUserEmergencyContactPhone}
                        </p>
                        <p className="hidden text-gray-500 sm:mt-2 sm:block">
                          Emergency Contact - {booking.bookingUserEmergencyContactName} (
                          {booking.bookingUserEmergencyContactPhone})
                        </p>
                        <p className="hidden text-gray-500 sm:mt-2 sm:block">
                          Driving License - {booking.bookingUserDrivingLicenseNo} (
                          {booking.bookingUserDrivingLicenseIssueCountry})
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-flow-col justify-start gap-4 mt-6">
                      {booking.bookingUserDrivingLicensePhoto.map((photo) => (
                        <img key={photo} src={photo} className="h-40 rounded-sm" alt="sss" />
                      ))}
                    </div>
                  </AccordionContent>
                </li>
              </AccordionItem>
            ))}
          </Accordion>
        </ul>
      </div>
    </>
  );
}
