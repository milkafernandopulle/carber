import HideClerkBranding from "@/components/atoms/HideClerkBranding";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <>
      <HideClerkBranding />
      <div className="p-36 grid place-items-center">
        <SignIn />
      </div>
    </>
  );
}
