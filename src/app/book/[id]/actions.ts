"use server";
import { auth } from "@clerk/nextjs";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

import { Vehicle, VehicleBooking } from "@prisma/client";
import { parse, format, differenceInMinutes } from "date-fns";
import { FormSchema } from "./BookingForm";
import { omit } from "lodash";

export async function createBooking(values: FormSchema, vehicle: Vehicle) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const [pickupDate, dropOffDate] = calcDates(
    values.pickupDate,
    values.pickupTime,
    values.dropOffDate,
    values.dropOffTime
  );

  const total = calcTotals(pickupDate, dropOffDate, vehicle.pricePerDay);

  const result = await prisma.vehicleBooking.create({
    data: {
      ...omit(values, ["pickupDate", "dropOffDate", "pickupTime", "dropOffTime"]),
      bookingFrom: pickupDate,
      bookingTo: dropOffDate,
      bookingUserId: userId,
      invoiceSubTotal: total.subTotal,
      invoiceTax: total.tax,
      invoiceTotal: total.total,
      vehicleId: vehicle.id,
    },
  });

  redirect(`/book/thankyou`);
}

function calcTotals(pickupDate: Date, dropOffDate: Date, pricePerDay: number) {
  if (dropOffDate <= pickupDate) {
    return {
      totalHours: 0,
      subTotal: 0,
      tax: 0,
      total: 0,
    };
  }

  const mins = differenceInMinutes(dropOffDate, pickupDate);

  const subTotal = (mins * pricePerDay) / (60 * 24);
  const tax = subTotal * 0.1;

  return {
    totalHours: mins / 60,
    subTotal,
    tax,
    total: subTotal + tax,
  };
}

function calcDates(pickupDate: Date, pickupTime: string, dropOffDate: Date, dropOffTime: string) {
  let pickDate = parse(
    `${format(pickupDate, "yyyy-MM-dd")} ${pickupTime}`,
    "yyyy-MM-dd hh.mmaa",
    new Date()
  );
  let dropDate = parse(
    `${format(dropOffDate, "yyyy-MM-dd")} ${dropOffTime}`,
    "yyyy-MM-dd hh.mmaa",
    new Date()
  );

  return [pickDate, dropDate];
}
