"use client";
import Link from "next/link";
import { clsx } from "clsx";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import EditForm from "./[tab]/EditForm";
import { getVehicle, saveVehicle } from "./actions";
import { Vehicle } from "@prisma/client";

type TabsProps = {};
export default function Tabs({}: TabsProps) {
  const params = useParams();

  const id = parseInt((params.id as string) || "0");

  const currentTab = params.tab;

  const tabs = [
    { name: "Details", href: `/vehicles/${id}/details`, current: currentTab === "details" },
    {
      name: "Availability",
      href: `/vehicles/${id}/availability`,
      current: currentTab === "availability",
    },
    {
      name: "Bookings",
      href: `/vehicles/${id}/bookings`,
      current: currentTab === "bookings",
    },
  ];

  return (
    <nav className="flex space-x-4 mt-6" aria-label="Tabs">
      {tabs.map((tab) => (
        <Link
          key={tab.name}
          href={tab.href}
          className={clsx(
            tab.current ? "bg-gray-200 text-gray-800" : "text-gray-600 hover:text-gray-800",
            "rounded-md px-3 py-2 text-sm font-medium"
          )}
          aria-current={tab.current ? "page" : undefined}>
          {tab.name}
        </Link>
      ))}
    </nav>
  );
}
