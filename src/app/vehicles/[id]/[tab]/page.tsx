import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import { notFound } from "next/navigation";
import { capitalCase } from "change-case";
import { clsx } from "clsx";
import VehicleDetails from "./VehicleDetails";
import VehicleAvailability from "./VehicleAvailability";
import VehicleBookings from "./VehicleBookings";

async function getVehicle(vehicleId: number) {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const result = await prisma.vehicle.findFirst({
    where: {
      ownerId: userId,
      id: vehicleId,
    },
    include: {
      availabilities: true,
    },
  });
  return result;
}

async function getVehicleBookings(vehicleId: number) {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const result = await prisma.vehicleBooking.findMany({
    where: {
      vehicleId,
    },
  });
  return result || [];
}

type PageProps = {
  params: { id: string; tab?: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
export default async function Page({ params }: PageProps) {
  const id = parseInt((params.id as string) || "0");

  if (!(id > 0)) {
    return notFound();
  }
  const [vehicle, vehicleBookings] = await Promise.all([getVehicle(id), getVehicleBookings(id)]);
  if (!vehicle) {
    return notFound();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 mb-8 sm:px-4 lg:max-w-4xl lg:px-0">
      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        {params.tab === "availability" && <VehicleAvailability vehicle={vehicle} />}
        {params.tab === "details" && <VehicleDetails vehicle={vehicle} />}
        {params.tab === "bookings" && (
          <VehicleBookings vehicleBookings={vehicleBookings || []} vehicle={vehicle} />
        )}
      </div>
    </div>
  );
}
