/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/20/solid";
import { CursorArrowRaysIcon, EnvelopeOpenIcon, UsersIcon } from "@heroicons/react/24/outline";
import { Vehicle, VehicleBooking } from "@prisma/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { format } from "date-fns";
import Link from "next/link";
import { FaCar } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";

export type DriverProfileProps = {
  myBookings: (VehicleBooking & {
    vehicle: Vehicle;
  })[];
};
export default function DriverProfile({ myBookings }: DriverProfileProps) {
  return (
    <div className="mb-24">
      <div className="mt-10">
        <h3 className="text-base font-semibold leading-6 text-gray-900 my-6">My Bookings</h3>

        <div className="border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border">
          <ul role="list" className="divide-y divide-gray-200">
            <Accordion type="single" collapsible>
              {myBookings.map((booking) => (
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
                        {booking.vehicle.images.map((photo) => (
                          <img
                            key={photo}
                            src={photo}
                            className="h-40 rounded-sm object-contain bg-gray-200"
                            alt="sss"
                          />
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
    </div>
  );
}
