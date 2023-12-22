/* eslint-disable @next/next/no-img-element */
import { CameraIcon, PhotoIcon, UserCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";
import Input from "./Input";
import { useEffect, useState } from "react";
import React from "react";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import { PutBlobResult } from "@vercel/blob";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  uploadUrl: string;
}

const FileUploadInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, value, ...props }, ref) => {
    return <FileUpload value={value as any} label={label} ref={ref} {...props} />;
  }
);
FileUploadInput.displayName = "FileUploadInput";

export default FileUploadInput;

type FileUploadProps = {
  name: string;
  label: string;
  uploadUrl: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string[];
};

const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(function (
  { label, name, uploadUrl, onChange, value }: FileUploadProps,
  ref
) {
  const handleOnChange = (blob: PutBlobResult) => {
    addFile(blob.url);
  };

  const addFile = (file: string) => {
    onChange?.({
      target: {
        name,
        value: [...(value ?? []), file],
      },
    } as any);
  };
  const removeFile = (file: string) => {
    onChange?.({
      target: {
        name,
        value: value.filter((f) => f !== file),
      },
    } as any);
  };

  return (
    <>
      <div className="col-span-full">
        <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
          {label}
        </label>
        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-4">
          <div className="text-center">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
            <div className="mt-4 flex text-sm leading-6 text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                <span>Upload a file</span>
                <Input
                  uploadUrl={uploadUrl}
                  onUpload={handleOnChange}
                  id="file-upload"
                  className="sr-only"
                />
              </label>
            </div>
            <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
        <div>
          <div className="mt-2 flex gap-x-2">
            {value?.map((file) => (
              <div key={file} className="h-24 w-24 relative rounded-md overflow-hidden bg-gray-300">
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
                <div className="absolute top-0 left-0 h-full w-full bg-slate-800 opacity-0 hover:opacity-40 transition-all duration-75 grid place-items-center">
                  <XMarkIcon
                    onClick={() => removeFile(file)}
                    className="h-8 w-8 text-gray-50 cursor-pointer"
                    aria-hidden="true"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
});

FileUpload.displayName = "FileUpload";
