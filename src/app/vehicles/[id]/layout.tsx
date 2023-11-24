import clsx from "clsx";
import Link from "next/link";
import { auth } from "@clerk/nextjs";
import { notFound } from "next/navigation";
import Tabs from "./Tabs";
import { Badge } from "@/components/ui/badge";
import prisma from "@/lib/prisma";

async function getVehicle(vehicleId: number) {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const result = await prisma.vehicle.findFirst({
    where: {
      ownerId: userId,
      id: vehicleId,
    },
    include: {
      availabilities: {
        where: {
          OR: [
            {
              from: {
                gte: new Date(),
              },
            },
            {
              to: {
                gte: new Date(),
              },
            },
          ],
        },
      },
    },
  });
  return result;
}

type LayoutProps = React.PropsWithChildren<{
  params: { id: string; tab?: string };
}>;
export default async function Layout({ params, children }: LayoutProps) {
  const id = parseInt((params.id as string) || "0");
  if (!(id > 0)) {
    return notFound();
  }

  const vehicle = await getVehicle(id);

  const tabs = [
    { name: "Details", href: `/vehicles/${id}`, current: params.tab === undefined },
    {
      name: "Availability",
      href: `/vehicles/${id}/availability`,
      current: params.tab === "availability",
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl sm:px-2 lg:px-8 mb-8">
        <div className="mx-auto max-w-2xl px-4 lg:max-w-4xl lg:px-0">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl flex gap-5 items-center">
            <span>Manage Vehicle</span>
            {!vehicle?.adminApproved && <Badge variant="default">Admin not Approved</Badge>}
            {!vehicle?.availabilities.length && <Badge variant="default">No Available Dates</Badge>}
          </h1>
          <p className="mt-2 text-sm text-gray-500">Manage your vehicle and view their status.</p>
          <Tabs />
        </div>
      </div>
      {children}
    </div>
  );
}
