"use server";

import prisma from "@/lib/prisma";

export async function getVehicle(id: string) {
  const vehicle = await prisma.vehicle.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  if (!vehicle) {
    throw new Error(`Vehicle ${id} not found`);
  }
  return vehicle;
}

export async function saveVehicle(id: string, data: any) {
  const vehicle = await prisma.vehicle.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  if (!vehicle) {
    throw new Error(`Vehicle ${id} not found`);
  }
  await prisma.vehicle.update({
    where: {
      id: parseInt(id),
    },
    data: {
      ...vehicle,
      ...data,
    },
  });

  return vehicle;
}
