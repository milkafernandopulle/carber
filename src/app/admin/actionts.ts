"use server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs";

const Periods = ["Today", "Yesterday", "This Week", "This Month", "This Year", "All"] as const;

export async function getStats(period: (typeof Periods)[number]) {
  const { userId } = auth();

  if (!userId) throw new Error("User not found");

  let from = new Date();
  let to = new Date();
  switch (period) {
    case "Today":
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      break;
    case "Yesterday":
      from.setDate(from.getDate() - 1);
      from.setHours(0, 0, 0, 0);
      to.setDate(to.getDate() - 1);
      to.setHours(23, 59, 59, 999);
      break;
    case "This Week":
      from.setDate(from.getDate() - from.getDay());
      from.setHours(0, 0, 0, 0);
      to.setDate(to.getDate() + (6 - to.getDay()));
      to.setHours(23, 59, 59, 999);
      break;
    case "This Month":
      from.setDate(1);
      from.setHours(0, 0, 0, 0);
      to.setMonth(to.getMonth() + 1);
      to.setDate(0);
      to.setHours(23, 59, 59, 999);
      break;
    case "This Year":
      from.setMonth(0, 1);
      from.setHours(0, 0, 0, 0);
      to.setMonth(11, 31);
      to.setHours(23, 59, 59, 999);
      break;
    case "All":
    default:
      from = new Date(0);
      to = new Date();
      break;
  }

  const statsInfo = await Promise.all([
    new Promise<number>(async (resolve) => {
      resolve(
        (
          await prisma.vehicleBooking.aggregate({
            where: {
              createdDate: {
                gte: from,
                lte: to,
              },
            },
            _sum: { invoiceTotal: true },
          })
        )._sum.invoiceTotal || 0
      );
    }),
    prisma.vehicle.count({
      where: {
        createdDate: {
          gte: from,
          lte: to,
        },
      },
    }),
    prisma.vehicleBooking.count({
      where: {
        createdDate: {
          gte: from,
          lte: to,
        },
      },
    }),
  ]);

  return statsInfo;
}
