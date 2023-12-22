"use client";
/* eslint-disable @next/next/no-img-element */
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { PaperClipIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { notFound } from "next/navigation";
import { capitalCase } from "change-case";
import { clsx } from "clsx";
import { Vehicle } from "@prisma/client";
import Link from "next/link";
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
import EditForm from "../[tab]/EditForm";
import { getVehicle, savePublishStatus, saveVehicle } from "../actions";

type VehicleDetailsProps = {
  vehicle: Vehicle;
};
export default function VehicleDetails({ vehicle }: VehicleDetailsProps) {
  const handlePublish = (publish: boolean) => async (data: any) => {
    await savePublishStatus(vehicle.id as unknown as string, publish);
    window.location.reload();
  };

  return (
    <>
      <div className="px-4 py-6">
        <div className="text-right flex-auto">
          <EditModal id={vehicle.id as unknown as string} />
          <Button
            variant={!vehicle.published ? "default" : "destructive"}
            className="ml-2"
            onClick={handlePublish(!vehicle.published)}>
            {vehicle.published ? "Un-Publish" : "Publish"}
          </Button>
        </div>
      </div>
      <div className="border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">Images</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {vehicle.images?.length === 0 && "No images uploaded"}
              <div className="mt-2 flex gap-x-2">
                {vehicle.images?.map((file) => (
                  <div
                    key={file}
                    className="h-24 w-24 relative rounded-md overflow-hidden bg-gray-300/50">
                    <PhotoIcon
                      className={clsx("h-24 w-24 text-gray-300", {
                        hidden: !!file,
                      })}
                      aria-hidden="true"
                    />
                    <img
                      className="absolute top-0 left-0 h-full w-full object-contain"
                      src={file}
                      alt=""
                    />
                  </div>
                ))}
              </div>
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">Manufacturer</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {vehicle.make}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">Model</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {vehicle.model}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">Manufactured Year</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {vehicle.year}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">Transmission(Gear box)</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {vehicle.transmission}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">Seat Count</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {vehicle.seats}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">Color</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {capitalCase(vehicle.color)}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">Allowed Milage</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {vehicle.allowedMilage.toLocaleString()} KM
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">Price per day (£)</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              £ {vehicle.pricePerDay.toFixed(2)}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">Vehicle Location</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 uppercase">
              {vehicle.locationAddressLine1} {!vehicle.locationAddressLine2 ?? ","}{" "}
              {vehicle.locationAddressLine2} {vehicle.locationPostcode}
            </dd>
          </div>
        </dl>
      </div>
    </>
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

  const handleOnCancel = () => {
    handleOpen(false);
  };

  if (!currentVehicle) return null;

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={(open) => setIsModalOpen(open)}>
        <Button variant="outline" className="ml-2" onClick={() => handleOpen(true)}>
          Change Details
        </Button>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Details</DialogTitle>
            <DialogDescription>
              Change the details of this vehicle. This will be reflected on the public listing.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[70vh] px-3 py-4">
            <EditForm
              onCancel={handleOnCancel}
              defaultValues={currentVehicle}
              onSubmit={handleOnSubmit}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
