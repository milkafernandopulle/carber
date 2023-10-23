"use client";

import CreateListingForm from "@/components/molecules/forms/CreateListingForm";
import { createListing } from "./actions";

type CreateListingProps = {};
export default function CreateListing({}: CreateListingProps) {
  function handleOnSubmit(values: any) {
    createListing(values);
  }

  return (
    <>
      <CreateListingForm onSubmit={handleOnSubmit} />
    </>
  );
}
