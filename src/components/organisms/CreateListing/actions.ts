"use server";
import { auth } from "@clerk/nextjs";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

import { Vehicle } from "@prisma/client";

export async function createListing(
  values: Omit<Vehicle, "id" | "user" | "createdAt" | "updatedAt">
) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`https://api.postcodes.io/postcodes/${values.locationPostcode}`);
  const {
    result: { longitude: locationLong, latitude: locationLat },
  } = (await response.json()) as {
    status: number;
    result: {
      longitude: number;
      latitude: number;
    };
  };

  const result = await prisma.vehicle.create({
    data: {
      ...values,
      locationLong,
      locationLat,
      ownerId: userId,
      locationPostcode: values.locationPostcode.toUpperCase(),
      published: true,
    },
  });

  redirect(`/vehicles/${result.id}`);
}
