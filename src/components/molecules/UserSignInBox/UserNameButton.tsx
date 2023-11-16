"use client";
import { Button } from "@/components/ui/button";
import { User } from "@clerk/nextjs/server";
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

type UserNameButtonProps = {
  user: User;
};
export default function UserNameButton({ user }: UserNameButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost">Hi, {user.firstName}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link className="cursor-pointer" href="/profile/driver">
              Driver Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link className="cursor-pointer" href="/profile/owner">
              Car Owner Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link className="cursor-pointer" href="/admin">
              Admin
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
