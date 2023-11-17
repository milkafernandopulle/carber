import { Button } from "@/components/ui/button";
import clsx from "clsx";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useState } from "react";
import OwnerProfile from "./OwnerProfile";
import Tabs from "./Tabs";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs";

async function getOwnerProfileData(userId: string) {
  const statsInfo = {
    totalVehicles: await prisma.vehicle.count({ where: { ownerId: userId } }),
    totalBookings: await prisma.vehicleBooking.count({ where: { vehicle: { ownerId: userId } } }),
    totalRevenue:
      (
        await prisma.vehicleBooking.aggregate({
          where: { vehicle: { ownerId: userId } },
          _sum: { invoiceTotal: true },
        })
      )._sum.invoiceTotal || 0,
  };
  const latestVehicles = await prisma.vehicle.findMany({
    where: { ownerId: userId },
    orderBy: {
      createdDate: "desc",
    },
    take: 5,
  });
  const latestBookings = await prisma.vehicleBooking.findMany({
    where: { vehicle: { ownerId: userId } },
    include: {
      vehicle: true,
    },
    orderBy: {
      createdDate: "desc",
    },
    take: 5,
  });
  return { statsInfo, latestVehicles, latestBookings };
}

async function getDriverProfileData(userId: string) {
  const myBookings = await prisma.vehicleBooking.findMany({
    where: { bookingUserId: userId },
    include: {
      vehicle: true,
    },
    orderBy: {
      createdDate: "desc",
    },
  });
  return { myBookings };
}

type PageProps = React.PropsWithChildren<{}>;
export default async function Page({}: PageProps) {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const [ownerProfile, driverProfile] = await Promise.all([
    getOwnerProfileData(userId),
    getDriverProfileData(userId),
  ]);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl sm:px-2 lg:px-8 mb-8">
        <Tabs ownerProfile={ownerProfile} driverProfile={driverProfile} />
      </div>
    </div>
  );
}
