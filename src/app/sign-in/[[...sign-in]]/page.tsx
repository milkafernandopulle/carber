import HideClerkBranding from "@/components/atoms/HideClerkBranding";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <>
      <HideClerkBranding />
      <div className="px-1 py-32 md:p-36 grid place-items-center">
        <SignIn />
      </div>
    </>
  );
}
