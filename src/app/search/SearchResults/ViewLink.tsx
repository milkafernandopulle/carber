"use client";

import { EyeIcon } from "@heroicons/react/20/solid";
import { Vehicle } from "@prisma/client";

import { capitalCase } from "change-case";
import Image from "next/image";
import Link from "next/link";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

type ViewLinkProps = {
  id: number;
};
export default function ViewLink({ id }: ViewLinkProps) {
  const params = useSearchParams();

  const [, setLastSearchParams] = useLocalStorage("lastSearchParams", "{}");
  const handleClick = () => {
    const search = {
      startDate: params.get("startDate"),
      endDate: params.get("endDate"),
      startTime: params.get("startTime"),
      endTime: params.get("endTime"),
    };

    setLastSearchParams(JSON.stringify(search));
  };

  return (
    <>
      <Link
        onClick={handleClick}
        href={`/view/${id}`}
        className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900">
        <EyeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        View
      </Link>
    </>
  );
}
