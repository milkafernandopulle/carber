import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import { Vehicle, VehicleBooking } from "@prisma/client";
import { format } from "date-fns";
import { enGB } from "date-fns/locale";

async function getBookings() {
  const vehicleBookings: (VehicleBooking & {
    vehicle?: Vehicle | null;
  })[] = await prisma.vehicleBooking.findMany({
    where: {},
    include: {
      vehicle: true,
    },
  });

  return vehicleBookings;
}

type RevenueTabProps = {};
export default async function RevenueTab({}: RevenueTabProps) {
  const bookings = await getBookings();

  return (
    <>
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Created Date
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Booking Date
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Name
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-right sm:pr-6 text-sm font-semibold text-gray-900">
                Sub-Total
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-right sm:pr-6 text-sm font-semibold text-gray-900">
                Tax
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-right sm:pr-6 text-sm font-semibold text-gray-900">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {format(booking.createdDate, "dd MMM yyyy hh.mma", {
                    locale: enGB,
                  })}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {format(booking.bookingFrom, "dd MMM yyyy hh.mma", {
                    locale: enGB,
                  })}
                </td>
                <td className="relative whitespace-nowrap  px-3 py-4 text-sm capitalize text-gray-500">
                  {booking.bookingUserFirstName} {booking.bookingUserLastName}
                </td>
                <td className="relative whitespace-nowrap text-right text-sm sm:pr-6">
                  {booking.invoiceSubTotal.toFixed(2)}
                </td>
                <td className="relative whitespace-nowrap text-right text-sm sm:pr-6">
                  {booking.invoiceTax.toFixed(2)}
                </td>
                <td className="relative whitespace-nowrap text-right text-sm sm:pr-6">
                  {booking.invoiceTotal.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
