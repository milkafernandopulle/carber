"use client";

import type { PutBlobResult } from "@vercel/blob";
import { useState, useRef, useEffect } from "react";

type InputProps = React.ComponentProps<"input"> & {
  onUpload: (blob: PutBlobResult) => void;
  uploadUrl: string;
};
export default function Input({ uploadUrl, onUpload, ...props }: InputProps) {
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleOnChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setUploadInProgress(true);
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
    setUploadInProgress(false);
  };

  return (
    <>
      <input ref={inputFileRef} type="file" {...props} onChange={handleOnChange} />
      {uploadInProgress && <Loading />}
    </>
  );
}

function Loading() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        prev++;
        if (prev > 3) {
          prev = 0;
        }
        return prev;
      });
    }, 400);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="text-left">
      <span className="text-transparent">.</span>
      {Array(count).fill(".").join("")}
    </div>
  );
}
