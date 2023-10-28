import { EyeIcon } from "@heroicons/react/20/solid";
import { Vehicle } from "@prisma/client";

import { capitalCase } from "change-case";
import Image from "next/image";
import Link from "next/link";

const people = [
  {
    name: "Jane Cooper",
    title: "Regional Paradigm Technician",
    role: "Admin",
    email: "janecooper@example.com",
    telephone: "+1-202-555-0170",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
  },
  // More people...
];

type ResultsGridProps = {
  results: Vehicle[];
};
export default function ResultsGrid({ results }: ResultsGridProps) {
  return (
    <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {results.map((vehicle) => (
        <li
          key={vehicle.id}
          className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
          <div className="flex w-full items-center justify-between space-x-6 p-6">
            <div className="flex-1 truncate">
              <div className="flex items-center space-x-3">
                <h3 className="truncate text-sm font-medium text-gray-900">
                  {vehicle.make} {vehicle.model}
                </h3>
                <span className="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                  {vehicle.year}
                </span>
              </div>
              <p className="mt-1 truncate text-sm text-gray-500">
                {vehicle.transmission} · {vehicle.seats} seats · {capitalCase(vehicle.color)}
              </p>
            </div>
            <Image
              className="h-20 w-36 flex-shrink-0 rounded-full bg-gray-300"
              src={`/images/body-types/${vehicle.vehicleType}.jpg`}
              alt=""
              width={320}
              height={180}
            />
          </div>
          <div>
            <div className="-mt-px flex divide-x divide-gray-200">
              <div className="flex w-0 flex-1">
                <Link
                  href={`/view/${vehicle.id}`}
                  className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900">
                  <EyeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  View
                </Link>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
