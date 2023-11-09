"use client";

import type { PutBlobResult } from "@vercel/blob";
import { useState, useRef } from "react";

type InputProps = React.ComponentProps<"input"> & {
  onUpload: (blob: PutBlobResult) => void;
  uploadUrl: string;
};
export default function Input({ uploadUrl, onUpload, ...props }: InputProps) {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleOnChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    if (!inputFileRef.current?.files) {
      throw new Error("No file selected");
    }

    const file = inputFileRef.current.files[0];

    const response = await fetch(`${uploadUrl}?filename=${file.name}`, {
      method: "POST",
      body: file,
    });

    const newBlob = (await response.json()) as PutBlobResult;

    onUpload(newBlob);
  };

  return (
    <>
      <input ref={inputFileRef} type="file" {...props} onChange={handleOnChange} />
    </>
  );
}
