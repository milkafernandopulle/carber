import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { UserButton, currentUser } from "@clerk/nextjs";

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
        <span>Hi, {user.firstName}</span>
        <UserButton afterSignOutUrl="/" signInUrl="/sign-in" />
      </div>
    </>
  );
}
