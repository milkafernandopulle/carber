import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import { capitalCase } from "change-case";

async function getUsers() {
  const users: (User & {
    vehicleCount?: number;
    bookingCount?: number;
  })[] = await clerkClient.users.getUserList();

  const listedVehicleCounts = await prisma.vehicle.groupBy({
    by: ["ownerId"],
    _count: {
      ownerId: true,
    },
    where: {
      ownerId: { in: users.map((user) => user.id) },
    },
  });

  const bookingCounts = await prisma.vehicleBooking.groupBy({
    by: ["bookingUserId"],
    _count: {
      bookingUserId: true,
    },
    where: {
      bookingUserId: { in: users.map((user) => user.id) },
    },
  });
  users.forEach((user) => {
    user.vehicleCount =
      listedVehicleCounts.find((v) => v.ownerId === user.id)?._count?.ownerId || 0;
    user.bookingCount =
      bookingCounts.find((v) => v.bookingUserId === user.id)?._count?.bookingUserId || 0;
  });

  return users;
}

type UsersTabProps = {};
export default async function UsersTab({}: UsersTabProps) {
  const users = await getUsers();

  return (
    <>
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                Name
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Email
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Role
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Bookings
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Vehicles
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {users.map((person) => (
              <tr key={person.id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                  {person.firstName} {person.lastName}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {person.emailAddresses[0].emailAddress}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {capitalCase((person.publicMetadata as any).role || "Member")}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {person.bookingCount}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {person.vehicleCount}
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <a href="#" className="text-indigo-600 hover:text-indigo-900">
                    Edit
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
