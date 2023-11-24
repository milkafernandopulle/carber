import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

type PageProps = {};
export default function Page({}: PageProps) {
  return (
    <>
      <div className="container mb-60">
        <Card className="max-w-xl m-auto px-12 py-6">
          <h1 className="font-bold text-3xl text-center mb-6">Booking Success</h1>
          Your booking has been confirmed. We will send you a confirmation email shortly.
          <br />
          <br />
          <br />
          <div className="space-x-4 text-center">
            <Link href="/" className={buttonVariants({ variant: "outline" })}>
              Back to Home
            </Link>
            <Link href="/profile" className={buttonVariants({ variant: "outline" })}>
              View my bookings
            </Link>
          </div>
        </Card>
      </div>
    </>
  );
}
