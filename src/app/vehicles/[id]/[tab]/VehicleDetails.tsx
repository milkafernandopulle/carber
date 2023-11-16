/* eslint-disable @next/next/no-img-element */
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { PaperClipIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { notFound } from "next/navigation";
import { capitalCase } from "change-case";
import { clsx } from "clsx";
import { Vehicle } from "@prisma/client";

type VehicleDetailsProps = {
  vehicle: Vehicle;
};
export default function VehicleDetails({ vehicle }: VehicleDetailsProps) {
  return (
    <>
      <div className="border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <div className="mt-2 flex gap-x-2">
              {vehicle.images?.map((file) => (
                <div
                  key={file}
                  className="h-24 w-24 relative rounded-md overflow-hidden bg-gray-300/50">
                  <PhotoIcon
                    className={clsx("h-24 w-24 text-gray-300", {
                      hidden: !!file,
                    })}
                    aria-hidden="true"
                  />
                  <img
                    className="absolute top-0 left-0 h-full w-full object-contain"
                    src={file}
                    alt=""
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">Manufacturer</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {vehicle.make}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">Model</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {vehicle.model}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">Manufactured Year</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {vehicle.year}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">Transmission(Gear box)</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {vehicle.transmission}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">Seat Count</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {vehicle.seats}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">Color</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {capitalCase(vehicle.color)}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">Allowed Milage</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {vehicle.allowedMilage.toLocaleString()} KM
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">Price per day (£)</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              £ {vehicle.pricePerDay.toFixed(2)}
            </dd>
          </div>
        </dl>
      </div>
    </>
  );
}
