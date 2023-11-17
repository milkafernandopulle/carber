/* eslint-disable @next/next/no-img-element */
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Vehicle, VehicleBooking } from "@prisma/client";
import { format } from "date-fns";
import Link from "next/link";
import { FaCar, FaClipboardList } from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";

export type OwnerProfileProps = {
  statsInfo: {
    totalBookings: number;
    totalRevenue: number;
    totalVehicles: number;
  };
  latestVehicles: Vehicle[];
  latestBookings: (VehicleBooking & {
    vehicle: Vehicle;
  })[];
};
export default function OwnerProfile({
  statsInfo,
  latestBookings,
  latestVehicles,
}: OwnerProfileProps) {
  const stats = [
    {
      id: 1,
      name: "Total Bookings",
      stat: statsInfo.totalBookings,
      icon: FaClipboardList,
      href: "/vehicles",
    },
    {
      id: 2,
      name: "Total Revenue",
      stat: `£${statsInfo.totalRevenue.toFixed(2)}`,
      icon: GiReceiveMoney,
      href: "/vehicles",
    },
    {
      id: 3,
      name: "Vehicles Listed",
      stat: statsInfo.totalVehicles,
      icon: FaCar,
      href: "/vehicles",
    },
  ];
  return (
    <div className="mb-24">
      <div className="mt-10">
        <h3 className="text-base font-semibold leading-6 text-gray-900">All time</h3>

        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((item) => (
            <div
              key={item.id}
              className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6">
              <dt>
                <div className="absolute rounded-md bg-indigo-500 p-3">
                  <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
              </dt>
              <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
                <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <Link
                      href="/vehicles"
                      className="font-medium text-indigo-600 hover:text-indigo-500">
                      View all<span className="sr-only"> {item.name} stats</span>
                    </Link>
                  </div>
                </div>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-10">
        <h3 className="text-base font-semibold leading-6 text-gray-900 my-6">Latest Bookings</h3>

        <div className="border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border">
          <ul role="list" className="divide-y divide-gray-200">
            <Accordion type="single" collapsible>
              {latestBookings.map((booking) => (
                <AccordionItem key={booking.id} value={booking.id}>
                  <li key={booking.id} className="p-4 sm:p-6">
                    <AccordionTrigger className="hover:no-underline !p-0">
                      <div className="font-medium text-gray-900 sm:flex sm:justify-between w-full mr-4 ">
                        <h5>
                          {booking.vehicle.make} {booking.vehicle.model} {booking.vehicle.year}
                        </h5>
                        <p className="mt-2 sm:mt-0">£ {booking.invoiceTotal.toFixed(2)}</p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex items-center sm:items-start pt-3">
                        <div className="flex-1 text-sm">
                          <p className="hidden text-gray-500 sm:mt-2 sm:block">
                            Name - {booking.bookingUserFirstName} {booking.bookingUserLastName}
                          </p>
                          <p className="hidden text-gray-500 sm:mt-2 sm:block">
                            Dates - {format(booking.bookingFrom, "dd MMM yyyy hh.mma")} -{" "}
                            {format(booking.bookingTo, "dd MMM yyyy hh.mma")}
                          </p>
                          <p className="hidden text-gray-500 sm:mt-2 sm:block">
                            Address - {booking.bookingUserAddressLine1},{" "}
                            {booking.bookingUserAddressLine2}, {booking.bookingUserAddressCity}{" "}
                            {booking.bookingUserAddressPostCode},{" "}
                            {booking.bookingUserAddressCountry}
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
      </div>

      <div className="mt-10">
        <h3 className="text-base font-semibold leading-6 text-gray-900 my-6">Latest Vehicles</h3>
        <div className="grid grid-flow-col grid-cols-4 sm:grid-cols-3">
          {latestVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="space-y-3 p-3 border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border">
              <img src={vehicle.images?.[0]} alt="" className="aspect-square w-full rounded-sm" />
              <div>
                <h4 className="">
                  {vehicle.make} {vehicle.model} {vehicle.year}
                </h4>
                <h5 className="text-muted-foreground text-sm">£{vehicle.pricePerDay}/day</h5>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
