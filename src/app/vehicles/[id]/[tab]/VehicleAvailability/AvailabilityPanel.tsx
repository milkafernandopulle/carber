"use client";
import { Vehicle, VehicleAvailability } from "@prisma/client";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import AvailabilityForm from "./AvailabilityForm";
import { UpdateVehicleAvailabilityParams, updateVehicleAvailability } from "./actions";
import { Calendar } from "@/components/ui/calendar";
import { addDays } from "date-fns";
import { useMemo, useState } from "react";

type AvailabilityPanelProps = {
  vehicle: Vehicle & { availabilities: VehicleAvailability[] };
  onUpdate: (values: UpdateVehicleAvailabilityParams) => void;
};
export default function AvailabilityPanel({ vehicle, onUpdate }: AvailabilityPanelProps) {
  const [availabilityDates, setAvailabilityDates] = useState<
    Omit<VehicleAvailability, "id" | "vehicleId">[]
  >([]);

  const handleDateUpdates = (values: UpdateVehicleAvailabilityParams) => {
    onUpdate(values);
    setAvailabilityDates(values.availabilities);
  };

  const selectedDates = useMemo(() => {
    const dates = [] as Date[];

    availabilityDates.forEach((availability) => {
      let date = availability.from;
      while (date <= availability.to) {
        dates.push(date);
        date = addDays(date, 1);
      }
    });

    return dates;
  }, [availabilityDates]);

  return (
    <>
      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt className="text-sm font-medium leading-6 text-gray-900">
          <p>Availability</p>
          <div className="mt-4">
            <Calendar
              mode="multiple"
              selected={selectedDates}
              selectedDateClassName="bg-green-500 hover:bg-green-500 text-white rounded-full border border-white-500 hover:border-white-500"
              className="rounded-md border"
              disabled={{ before: addDays(new Date(), 1) }}
              noTodayStyle
            />
          </div>
        </dt>
        <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
          <AvailabilityForm vehicle={vehicle} onSubmit={handleDateUpdates} />
        </dd>
      </div>
    </>
  );
}
