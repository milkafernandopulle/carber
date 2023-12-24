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
import MessageBoard from "./MessageBoard";
import Stats from "./Stats";
import { cn } from "@/lib/utils";

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
  return (
    <div className="mb-24">
      <Stats />
      <div className="mt-10">
        <h3 className="text-base font-semibold leading-6 text-gray-900 my-6">Latest Bookings</h3>

        <div className="border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border">
          {latestBookings.length === 0 && <p className="px-5 py-5">No bookings yet</p>}
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
                      <div className="flex justify-end ">
                        <MessageBoard bookingId={booking.id} />
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
        <div className="grid gap-2 grid-cols-2 sm:grid-cols-3">
          {latestVehicles.map((vehicle) => (
            <Link
              href={`/vehicles/${vehicle.id}`}
              key={vehicle.id}
              className="space-y-3 p-3 border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border block">
              <div className="aspect-[4/3]">
                <img
                  src={vehicle.images?.[0] || "/images/vehicle-placeholder.avif"}
                  alt=""
                  className={cn(
                    "aspect-[4/3]  rounded-sm w-fit",
                    !!vehicle.images?.[0] ? "object-cover" : "object-contain"
                  )}
                />
              </div>
              <div>
                <h4 className="">
                  {vehicle.make} {vehicle.model} {vehicle.year}
                </h4>
                <h5 className="text-muted-foreground text-sm">£{vehicle.pricePerDay}/day</h5>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
