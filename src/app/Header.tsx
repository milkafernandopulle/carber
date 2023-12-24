"use client";
/* eslint-disable @next/next/no-img-element */
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import clsx from "clsx";
import { Fragment, useState } from "react";
import { Dialog, Popover, Tab, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { UserButton, useUser, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

type HeaderProps = React.PropsWithChildren<{}>;
export default function Header({ children: UserSignInBox }: HeaderProps) {
  const [open, setOpen] = useState(false);

  const auth = useAuth();
  const user = useUser();

  return (
    <header className="sticky top-0 shadow bg-white z-10">
      <nav aria-label="Top">
        {/* Secondary navigation */}
        <div className="bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="hidden gap-12 lg:flex lg:flex-1 lg:items-center">
                <a href="/">
                  <span className="sr-only">Your Company</span>
                  <img className="h-14 w-auto" src="/logo.png" alt="" />
                </a>
                <div className="space-x-2">
                  <a className="opacity-60 hover:opacity-100" href="/search">
                    Search
                  </a>
                  {auth.isSignedIn && user.user?.publicMetadata.role !== "admin" && (
                    <>
                      <span className="opacity-60">·</span>
                      <Link className="opacity-60 hover:opacity-100" href="/vehicles">
                        My Vehicles
                      </Link>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-1 items-center justify-end space-x-2">{UserSignInBox}</div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
