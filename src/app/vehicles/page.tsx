import prisma from "@/lib/prisma";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { auth } from "@clerk/nextjs";
import * as changeCase from "change-case";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const people = [
  {
    name: "Leslie Alexander",
    email: "leslie.alexander@example.com",
    role: "Co-Founder / CEO",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    href: "#",
    lastSeen: "3h ago",
    lastSeenDateTime: "2023-01-23T13:23Z",
  },
  {
    name: "Michael Foster",
    email: "michael.foster@example.com",
    role: "Co-Founder / CTO",
    imageUrl:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    href: "#",
    lastSeen: "3h ago",
    lastSeenDateTime: "2023-01-23T13:23Z",
  },
  {
    name: "Dries Vincent",
    email: "dries.vincent@example.com",
    role: "Business Relations",
    imageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    href: "#",
    lastSeen: null,
  },
  {
    name: "Lindsay Walton",
    email: "lindsay.walton@example.com",
    role: "Front-end Developer",
    imageUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    href: "#",
    lastSeen: "3h ago",
    lastSeenDateTime: "2023-01-23T13:23Z",
  },
  {
    name: "Courtney Henry",
    email: "courtney.henry@example.com",
    role: "Designer",
    imageUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    href: "#",
    lastSeen: "3h ago",
    lastSeenDateTime: "2023-01-23T13:23Z",
  },
  {
    name: "Tom Cook",
    email: "tom.cook@example.com",
    role: "Director of Product",
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    href: "#",
    lastSeen: null,
  },
];

function getVehicleList() {
  const { userId } = auth();

  if (!userId) {
    return [];
  }

  return prisma.vehicle.findMany({
    where: {
      ownerId: userId,
    },
    include: {
      availabilities: {
        where: {
          OR: [
            {
              from: {
                gte: new Date(),
              },
            },
            {
              to: {
                gte: new Date(),
              },
            },
          ],
        },
      },
    },
  });
}

type PageProps = {};
export default async function Page({}: PageProps) {
  const vehicles = await getVehicleList();

  return (
    <>
      <div className="mx-auto max-w-7xl sm:px-2 lg:px-8 mb-8">
        <div className="mx-auto max-w-2xl px-4 lg:max-w-4xl lg:px-0">
          <h1 className="flex justify-between text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            <span>Vehicles</span>
            <Link href="/list-new/intro" className={buttonVariants()}>
              Add Vehicle
            </Link>
          </h1>
          <p className="mt-2 text-sm text-gray-500">Manage your vehicles and view their status.</p>
        </div>
      </div>
      <div className="mx-auto max-w-2xl space-y-8 sm:px-4 lg:max-w-4xl lg:px-0 mb-12">
        <ul
          role="list"
          className="divide-y divide-gray-100 overflow-hidden bg-white shadow ring-1 ring-gray-900/5 sm:rounded-xl">
          {vehicles.map((vehicle) => (
            <li
              key={vehicle.id}
              className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6">
              <div className="flex gap-x-4">
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    <Link className="flex gap-8" href={`/vehicles/${vehicle.id}`}>
                      <span>
                        <span className="absolute inset-x-0 -top-px bottom-0" />
                        {vehicle.model} {vehicle.year}{" "}
                        <span className="text-muted-foreground">({vehicle.make})</span>
                      </span>
                      <div className="space-x-2">
                        {!vehicle?.adminApproved && (
                          <Badge variant="default">Admin not Approved</Badge>
                        )}
                        {!vehicle?.availabilities.length && (
                          <Badge variant="default">No Available Dates</Badge>
                        )}
                      </div>
                    </Link>
                  </p>
                  <p className="mt-1 flex text-xs leading-5 text-gray-500">
                    <div className="relative truncate">
                      Allowed {vehicle.allowedMilage}KM · {changeCase.capitalCase(vehicle.color)} ·{" "}
                      {vehicle.engine}cc · {vehicle.transmission}
                    </div>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-x-4">
                <ChevronRightIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
