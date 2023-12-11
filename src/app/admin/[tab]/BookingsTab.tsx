import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import { Vehicle, VehicleBooking } from "@prisma/client";
import { format } from "date-fns";
import { enGB } from "date-fns/locale";

async function getBookings() {
  const users: User[] = await clerkClient.users.getUserList();

  const vehicleBookings: (VehicleBooking & {
    bookingUser?: User;
    vehicle?: Vehicle;
  } & any)[] = await prisma.vehicleBooking.findMany({
    where: {},
    include: {
      vehicle: true,
    },
  });

  vehicleBookings.forEach((booking) => {
    booking.bookingUser = users.find((v) => v.id === booking.bookingUserId);
  });

  return vehicleBookings;
}

type BookingsTabProps = {};
export default async function BookingsTab({}: BookingsTabProps) {
  const bookings = await getBookings();

  return (
    <>
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                User
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Vehicle
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Period
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                  {booking.bookingUser?.firstName} {booking.bookingUser?.lastName}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {booking.vehicle?.make} {booking.vehicle?.model} {booking.vehicle?.year}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {format(booking.bookingFrom, "dd MMM yyyy hh.mma", {
                    locale: enGB,
                  })}{" "}
                  -{" "}
                  {format(booking.bookingTo, "dd MMM yyyy hh.mma", {
                    locale: enGB,
                  })}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {/* {booking.bookingCount} */}
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
