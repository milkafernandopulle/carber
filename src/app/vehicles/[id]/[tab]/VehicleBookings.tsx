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

type VehicleBookingsProps = {
  vehicle: Vehicle;
  vehicleBookings: VehicleBooking[];
};
export default function VehicleBookings({ vehicle, vehicleBookings }: VehicleBookingsProps) {
  return (
    <>
      <div className="border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border">
        <ul role="list" className="divide-y divide-gray-200">
          {vehicleBookings.map((booking) => (
            <li key={booking.id} className="p-4 sm:p-6">
              <div className="flex items-center sm:items-start">
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 sm:h-40 sm:w-40">
                  <img
                    src={vehicle.images?.[0]}
                    alt="ss"
                    className="h-full w-full object-contain bg-gray-200 object-center"
                  />
                </div>
                <div className="ml-6 flex-1 text-sm">
                  <div className="font-medium text-gray-900 sm:flex sm:justify-between">
                    <h5>{booking.name}</h5>
                    <p className="mt-2 sm:mt-0">{booking.price}</p>
                  </div>
                  <p className="hidden text-gray-500 sm:mt-2 sm:block">{booking.description}</p>
                </div>
              </div>

              <div className="mt-6 sm:flex sm:justify-between">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
                  <p className="ml-2 text-sm font-medium text-gray-500">
                    Delivered on{" "}
                    <time dateTime={booking.deliveredDatetime}>{booking.deliveredDate}</time>
                  </p>
                </div>

                <div className="mt-6 flex items-center space-x-4 divide-x divide-gray-200 border-t border-gray-200 pt-4 text-sm font-medium sm:ml-4 sm:mt-0 sm:border-none sm:pt-0">
                  <div className="flex flex-1 justify-center">
                    <a
                      href={booking.href}
                      className="whitespace-nowrap text-indigo-600 hover:text-indigo-500">
                      View product
                    </a>
                  </div>
                  <div className="flex flex-1 justify-center pl-4">
                    <a href="#" className="whitespace-nowrap text-indigo-600 hover:text-indigo-500">
                      Buy again
                    </a>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
