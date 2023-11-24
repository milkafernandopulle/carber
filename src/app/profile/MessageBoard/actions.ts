"use server";

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs";

export async function getMessages() {
  const messages = await prisma.vehicleBookingMessage.findMany({});

  return messages;
}

export async function sendMessage(bookingId: string, message: string) {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId || !user) {
    throw new Error("User not logged in");
    return;
  }

  const result = await prisma.vehicleBookingMessage.create({
    data: {
      vehicleBookingId: bookingId,
      message,
      userId,
      userDisplayName: `${user.firstName} ${user.lastName}`,
    },
  });
  return result;
}
