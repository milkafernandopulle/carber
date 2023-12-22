"use client";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  DropdownMenuPortal,
  DropdownMenuShortcut,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@clerk/nextjs/server";

type UserNameButtonProps = {
  user: User;
};
export default function UserNameButton({ user }: UserNameButtonProps) {
  const { role } = user.publicMetadata;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost">Hi, {user.firstName}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          {role !== "admin" && (
            <DropdownMenuItem asChild>
              <Link className="cursor-pointer" href="/profile">
                Account
              </Link>
            </DropdownMenuItem>
          )}
          {role === "admin" && (
            <DropdownMenuItem>
              <Link className="cursor-pointer" href="/admin">
                Admin Dashboard
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
