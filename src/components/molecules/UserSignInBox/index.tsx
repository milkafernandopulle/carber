import Link from "next/link";
import { Button, buttonVariants } from "../../ui/button";
import { UserButton, currentUser } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { User } from "@clerk/nextjs/server";
import UserNameButton from "./UserNameButton";

type UserSignInBoxProps = {};
export default async function UserSignInBox({}: UserSignInBoxProps) {
  const user = await currentUser();

  const loggedIn = !!user;

  if (!loggedIn) {
    return (
      <>
        <Link href="/sign-in" className={buttonVariants({ variant: "ghost" })}>
          Sign In
        </Link>
        <Link href="/sign-up" className={buttonVariants({})}>
          Sign Up
        </Link>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-row items-center gap-2">
        <UserNameButton user={user} />
        <UserButton afterSignOutUrl="/" signInUrl="/sign-in" />
      </div>
    </>
  );
}
