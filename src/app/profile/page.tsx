import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import Tabs from "./Tabs";

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

export default async function Page() {
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
        <Tabs ownerProfile={ownerProfile as any} driverProfile={driverProfile as any} />
      </div>
    </div>
  );
}
