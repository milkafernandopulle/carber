"use server";
import { auth, currentUser } from "@clerk/nextjs";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function approveAdmin(vehicleId: number) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const user = await currentUser();
  const { role } = user?.publicMetadata as any;

  if (role !== "admin") {
    throw new Error("User not authorized");
  }

  const result = await prisma.vehicle.update({
    where: { id: vehicleId },
    data: { adminApproved: true },
  });

  redirect(`/admin/vehicles?${Math.random()}`);
}
