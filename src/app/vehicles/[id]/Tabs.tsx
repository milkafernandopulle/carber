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
      <EditModal id={id} />
    </nav>
  );
}

type EditModalProps = {
  id: string;
};
function EditModal({ id }: EditModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpen = (open: boolean) => setIsModalOpen(open);
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle>();

  useEffect(() => {
    getVehicle(id).then((res) => {
      setCurrentVehicle(res);
    });
  }, [id]);

  const handleOnSubmit = async (data: any) => {
    await saveVehicle(id, data);
    setCurrentVehicle(data);
    handleOpen(false);
    window.location.reload();
  };

  if (!currentVehicle) return null;

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={(open) => setIsModalOpen(open)}>
        <div className="text-right flex-auto">
          <Button variant="outline" className="ml-2" onClick={() => handleOpen(true)}>
            Edit Details
          </Button>
        </div>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Details</DialogTitle>
            <DialogDescription>
              Change the details of this vehicle. You can change the details of this vehicle.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[70vh] px-3 py-4">
            <EditForm defaultValues={currentVehicle} onSubmit={handleOnSubmit} />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
