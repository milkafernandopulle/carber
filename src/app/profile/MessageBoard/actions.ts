"use server";

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs";

export async function getMessages(bookingId: string) {
  const messages = await prisma.vehicleBookingMessage.findMany({
    where: {
      vehicleBookingId: bookingId,
    },
  });

  return messages;
}

export async function sendMessage(bookingId: string, message: string) {
  console.log({ bookingId, message });
  // const { userId } = auth();
  // // const user = await currentUser();

  // if (!userId) {
  //   throw new Error("User not logged in");
  //   return;
  // }
  // console.log({ userId });
  const result = await prisma.vehicleBookingMessage.create({
    data: {
      vehicleBookingId: bookingId,
      message,
      userId: "user_2ZxrbT9tDAaGELA1nr2dOWMcfYH",
      userDisplayName: "User",
    },
  });
  console.log("done");
  return result;
}
