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

  const result = await prisma.vehicle.create({
    data: {
      ...values,
      ownerId: userId,
    },
  });

  redirect(`/vehicles/${result.id}`);
}
