import PageLayout from "./PageLayout";
import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import { notFound } from "next/navigation";
import { capitalCase } from "change-case";
import { clsx } from "clsx";
import { faker } from "@faker-js/faker";

async function getVehicle(vehicleId: number) {
  const result = await prisma.vehicle.findFirst({
    where: {
      id: vehicleId,
    },
    include: {
      availabilities: true,
    },
  });
  return result;
}

type PageProps = {
  params: { id: string };
};
export default async function Page({ params }: PageProps) {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId) {
    return null;
  }
  const id = parseInt((params.id as string) || "0");

  if (!(id > 0)) {
    return notFound();
  }
  const [vehicle] = await Promise.all([getVehicle(id)]);
  if (!vehicle) {
    return notFound();
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <PageLayout
        vehicle={vehicle}
        user={{
          firstName: user.firstName || "",
          lastName: user.lastName || "",
        }}
      />
    </>
  );
}
