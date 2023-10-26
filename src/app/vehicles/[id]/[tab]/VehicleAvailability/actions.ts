"use server";
import { auth } from "@clerk/nextjs";

import prisma from "@/lib/prisma";

import { VehicleAvailability } from "@prisma/client";

export type UpdateVehicleAvailabilityParams = {
  vehicleId: number;
  availabilities: Omit<VehicleAvailability, "id" | "vehicleId">[];
};
export async function updateVehicleAvailability(data: UpdateVehicleAvailabilityParams) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  await prisma.vehicleAvailability.deleteMany({
    where: {
      vehicle: {
        id: data.vehicleId,
        ownerId: userId,
      },
    },
  });

  const result = await prisma.vehicleAvailability.createMany({
    data: data.availabilities.map((availability) => ({
      ...availability,
      vehicleId: data.vehicleId,
    })),
  });

  return result;
}
