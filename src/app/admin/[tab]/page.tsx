import prisma from "@/lib/prisma";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FaCar, FaClipboardList } from "react-icons/fa";
import { FaUsers, FaChartBar } from "react-icons/fa6";
import BookingsTab from "./BookingsTab";
import CarOwnersTab from "./CarOwnersTab";
import DriversTab from "./DriversTab";
import VehiclesTab from "./VehiclesTab";
import Stats from "../Stats";
import StatisticsTab from "./StatisticsTab";

async function getCarOwnerCount() {
  const results = await prisma.vehicle.groupBy({
    by: ["ownerId"],
    _count: {
      ownerId: true,
    },
  });
  return results.length;
}

async function getDriverCount() {
  const results = await prisma.vehicleBooking.groupBy({
    by: ["bookingUserId"],
    _count: {
      bookingUserId: true,
    },
  });
  return results.length;
}

async function getTabs() {
  const tabs = [
    {
      name: "Statistics",
      href: "statistics",
      icon: FaChartBar,
      count: false,
    },
    {
      name: "Car Owners",
      href: "car-owners",
      icon: FaUsers,
      count: await getCarOwnerCount(),
    },
    {
      name: "Drivers",
      href: "drivers",
      icon: FaUsers,
      count: await getDriverCount(),
    },
    { name: "Vehicles", href: "vehicles", icon: FaCar, count: await prisma.vehicle.count() },
    {
      name: "Bookings",
      href: "bookings",
      icon: FaClipboardList,
      count: await prisma.vehicleBooking.count(),
    },
  ];

  return tabs;
}

type PageProps = {
  params: {
    tab: string;
  };
};
export default async function Page({ params: { tab: selectedTab } }: PageProps) {
  if (!selectedTab) {
    return redirect(`/admin/users`);
  }

  const tabs = await getTabs();

  return (
    <>
      <div className="min-h-screen">
        <div className="mx-auto max-w-7xl sm:px-2 lg:px-8 mb-8">
          <div className="mx-auto max-w-2xl px-4 lg:max-w-4xl lg:px-0">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl grid grid-flow-col justify-between">
              Admin Dashboard
            </h1>
            <p className="mt-2 mb-12 text-sm text-gray-500">View and Manage system data.</p>
            <div className="   ">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  {tabs.map((tab) => (
                    <Link
                      key={tab.name}
                      href={`/admin/${tab.href}`}
                      className={cn(
                        tab.href === selectedTab
                          ? "border-indigo-500 text-indigo-600"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                        "group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium"
                      )}
                      aria-current={tab.href === selectedTab ? "page" : undefined}>
                      <tab.icon
                        className={cn(
                          tab.href === selectedTab
                            ? "text-indigo-500"
                            : "text-gray-400 group-hover:text-gray-500",
                          "-ml-0.5 mr-2 h-5 w-5"
                        )}
                        aria-hidden="true"
                      />
                      <span>
                        {tab.name}
                        {tab.count ? (
                          <span
                            className={cn(
                              tab.href === selectedTab
                                ? "bg-indigo-100 text-indigo-600"
                                : "bg-gray-100 text-gray-900",
                              "ml-3 hidden rounded-full py-0.5 px-2.5 text-xs font-medium md:inline-block"
                            )}>
                            {tab.count}
                          </span>
                        ) : null}
                      </span>
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="py-10">
                {selectedTab === "car-owners" && <CarOwnersTab />}
                {selectedTab === "drivers" && <DriversTab />}
                {selectedTab === "vehicles" && <VehiclesTab />}
                {selectedTab === "bookings" && <BookingsTab />}
                {selectedTab === "statistics" && <StatisticsTab />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
