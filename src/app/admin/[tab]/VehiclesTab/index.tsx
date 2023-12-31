import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import { Vehicle } from "@prisma/client";
import { capitalCase } from "change-case";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { approveAdmin } from "./actions";
import ApproveButton from "./ApproveButton";

async function getVehicles() {
  const users: (User & {
    vehicleCount?: number;
    bookingCount?: number;
  })[] = await clerkClient.users.getUserList();

  const vehicles = await prisma.vehicle.findMany({
    where: {},
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

  const bookingCounts = await prisma.vehicleBooking.groupBy({
    by: ["vehicleId"],
    _count: {
      vehicleId: true,
    },
    where: {
      vehicleId: { in: vehicles.map((v) => v.id) },
    },
  });
  vehicles.forEach((vehicle) => {
    (vehicle as any).bookingCount =
      bookingCounts.find((v) => v.vehicleId === vehicle.id)?._count?.vehicleId || 0;
  });

  return vehicles;
}

type VehiclesTabProps = {};
export default async function VehiclesTab({}: VehiclesTabProps) {
  const vehicles = await getVehicles();

  return (
    <>
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                Make/Model
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Year
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Transmission
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Bookings
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 space-y-1">
                  <div>
                    {vehicle.make} {vehicle.model}
                  </div>
                  <div className="space-x-2">
                    {!vehicle.adminApproved && <Badge>Admin not Approved</Badge>}
                    {!vehicle?.availabilities.length && (
                      <Badge variant="default">No Available Dates</Badge>
                    )}
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {vehicle.year}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {vehicle.transmission}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {(vehicle as any).bookingCount}
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  {!vehicle.adminApproved && <ApproveButton vehicleId={vehicle.id} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
