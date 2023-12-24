"use client";
/* eslint-disable @next/next/no-img-element */
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Vehicle, VehicleBooking } from "@prisma/client";
import { format } from "date-fns";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaCar, FaClipboardList } from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";
import { getStats } from "./actionts";
import { Button } from "@/components/ui/button";

const Periods = ["Today", "Yesterday", "This Week", "This Month", "This Year", "All"] as const;

type StatsProps = {};
export default function Stats({}: StatsProps) {
  const [stats, setStats] = useState<number[]>();
  const [statsLoading, setStatsLoading] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState<(typeof Periods)[number]>("Today");

  useEffect(() => {
    setStatsLoading((prev) => prev + 1);
    getStats(selectedPeriod).then((data) => {
      setStats(data);
      setStatsLoading((prev) => prev - 1);
    });
  }, [selectedPeriod]);

  const statsItems = [
    {
      id: 2,
      name: "Total Revenue",
      stat: (value: number) =>
        `£${new Intl.NumberFormat("en-GB", {
          currency: "GBP",
        }).format(value)}`,
      icon: GiReceiveMoney,
      href: "/admin/revenue",
    },
    {
      id: 3,
      name: "Vehicles Listed",
      stat: (value: number) => value,
      icon: FaCar,
      href: "/admin/vehicles",
    },
    {
      id: 1,
      name: "Bookings",
      stat: (value: number) => value,
      icon: FaClipboardList,
      href: "/admin/bookings",
    },
  ];

  if (!stats) {
    return null;
  }

  return (
    <>
      <div className="mt-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          {Periods.map((period) => (
            <Button
              key={period}
              className={selectedPeriod === period ? "mx-1" : "mx-1 text-muted-foreground"}
              variant={selectedPeriod === period ? "outline" : "ghost"}
              onClick={() => {
                setSelectedPeriod(period);
              }}>
              {period}
            </Button>
          ))}
        </h3>

        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {statsItems.map((item, index) => (
            <div
              key={item.id}
              className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6">
              <dt>
                <div className="absolute rounded-md bg-indigo-500 p-3">
                  <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
              </dt>
              <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900">
                  {statsLoading ? "-" : item.stat(stats[index])}
                </p>
                <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <Link
                      href={item.href}
                      className="font-medium text-indigo-600 hover:text-indigo-500">
                      View all<span className="sr-only"> {item.name} stats</span>
                    </Link>
                  </div>
                </div>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  );
}
