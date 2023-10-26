"use client";

import CreateListingForm from "@/components/molecules/forms/CreateListingForm";
import { createListing } from "./actions";
import { redirect } from "next/navigation";

type CreateListingProps = {};
export default function CreateListing({}: CreateListingProps) {
  async function handleOnSubmit(values: any) {
    await createListing(values);
  }

  return (
    <>
      <CreateListingForm onSubmit={handleOnSubmit} />
    </>
  );
}
