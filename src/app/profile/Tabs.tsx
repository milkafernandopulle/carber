"use client";

import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { useState } from "react";
import DriverProfile, { DriverProfileProps } from "./DriverProfile";
import OwnerProfile, { OwnerProfileProps } from "./OwnerProfile";

type TabsProps = {
  ownerProfile: OwnerProfileProps;
  driverProfile: DriverProfileProps;
};
export default function Tabs({ ownerProfile, driverProfile }: TabsProps) {
  const [selectedTab, setSelectedTab] = useState(
    ownerProfile.statsInfo.totalVehicles > 0 ? "owner" : "driver"
  );

  const handleTabSelect = (tab: string) => () => {
    setSelectedTab(tab);
  };

  return (
    <>
      <div className="mx-auto max-w-2xl px-4 lg:max-w-4xl lg:px-0">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl grid grid-flow-col justify-between">
          <span>Dashboard</span>
          <div className="space-x-2">
            {ownerProfile.statsInfo.totalVehicles > 0 && (
              <Button
                onClick={handleTabSelect("owner")}
                variant="ghost"
                className={clsx(
                  selectedTab === "owner"
                    ? "bg-gray-200 text-gray-800"
                    : "text-gray-600 hover:text-gray-800",
                  "rounded-md px-3 py-2 text-sm font-medium"
                )}>
                Owner
              </Button>
            )}
            {(ownerProfile.statsInfo.totalVehicles < 1 || driverProfile.myBookings.length > 0) && (
              <Button
                onClick={handleTabSelect("driver")}
                variant="ghost"
                className={clsx(
                  selectedTab === "driver"
                    ? "bg-gray-200 text-gray-800"
                    : "text-gray-600 hover:text-gray-800",
                  "rounded-md px-3 py-2 text-sm font-medium"
                )}>
                Driver
              </Button>
            )}
          </div>
        </h1>
        <p className="mt-2 text-sm text-gray-500">View and Manage your details.</p>
        {selectedTab === "owner" && <OwnerProfile {...ownerProfile} />}
        {selectedTab === "driver" && <DriverProfile {...driverProfile} />}
      </div>
    </>
  );
}
