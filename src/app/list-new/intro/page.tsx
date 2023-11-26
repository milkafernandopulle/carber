import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

type PageProps = {};
export default function Page({}: PageProps) {
  return (
    <>
      <div className="container mb-60">
        <Card className="max-w-3xl m-auto px-12 py-6">
          <h1 className="font-bold text-3xl text-center mb-6">Vehicle Registration Process</h1>
          <p>
            <ul className="list-decimal space-y-1">
              <li>You have to complete a form related to vehicle details.</li>
              <li>After submitting it will take several days for our staff to review it.</li>
              <li>Your vehicle will be listed in the site after inspected by our staff.</li>
              <li>Click Continue to go to vehicle registration form.</li>
            </ul>
          </p>
          <br />
          <br />
          <br />
          <div className="space-x-4 text-center">
            <Link href="/list-new" className={buttonVariants({ variant: "default" })}>
              Continue
            </Link>
          </div>
        </Card>
      </div>
    </>
  );
}
