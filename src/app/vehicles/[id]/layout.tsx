import clsx from "clsx";
import Link from "next/link";
import { notFound } from "next/navigation";
import Tabs from "./Tabs";

type LayoutProps = React.PropsWithChildren<{
  params: { id: string; tab?: string };
}>;
export default async function Layout({ params, children }: LayoutProps) {
  const id = parseInt((params.id as string) || "0");
  if (!(id > 0)) {
    return notFound();
  }
  const tabs = [
    { name: "Details", href: `/vehicles/${id}`, current: params.tab === undefined },
    {
      name: "Availability",
      href: `/vehicles/${id}/availability`,
      current: params.tab === "availability",
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl sm:px-2 lg:px-8 mb-8">
        <div className="mx-auto max-w-2xl px-4 lg:max-w-4xl lg:px-0">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Manage Vehicle
          </h1>
          <p className="mt-2 text-sm text-gray-500">Manage your vehicle and view their status.</p>
          <Tabs />
        </div>
      </div>
      {children}
    </div>
  );
}
