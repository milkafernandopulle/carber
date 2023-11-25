"use server";
import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { User } from "@clerk/nextjs/server";
import { capitalCase } from "change-case";

export async function getUsers() {
  const users: (User & {
    vehicleCount?: number;
  })[] = await clerkClient.users.getUserList();

  const listedVehicleCounts = await prisma.vehicle.groupBy({
    by: ["ownerId"],
    _count: {
      ownerId: true,
    },
    where: {
      ownerId: { in: users.map((user) => user.id) },
    },
  });

  users.forEach((user) => {
    user.vehicleCount =
      listedVehicleCounts.find((v) => v.ownerId === user.id)?._count?.ownerId || 0;
  });

  return users.filter((user) => !!user.vehicleCount || user.publicMetadata?.role === "car-owner");
}

export async function blockUser(userId: string, block: boolean) {
  const user = await clerkClient.users.getUser(userId);
  const updatedUser = await clerkClient.users.updateUser(userId, {
    publicMetadata: {
      ...user.publicMetadata,
      blocked: block,
    },
  });
  return updatedUser;
}

export async function createUser(
  firstName: string,
  lastName: string,
  email: string,
  password: string
) {
  console.log({ firstName, lastName, email, password });
  try {
    const newUser = await clerkClient.users.createUser({
      firstName: firstName,
      lastName: lastName,
      externalId: "12121212121212",
      username: "asdasdasdasdasd",
      password: password,
      publicMetadata: {
        role: "driver",
      },
      privateMetadata: {},
      unsafeMetadata: {},
    });
    console.log({ newUser });
    return newUser;
  } catch (error) {
    console.log("xxxxxxxxxxxxxxxx");
    // console.log(Object.keys(error.errors), error.errors[0], error.clerkError);
  }
}
