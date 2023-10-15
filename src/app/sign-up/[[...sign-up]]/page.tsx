import HideClerkBranding from "@/components/atoms/HideClerkBranding";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <>
      <HideClerkBranding />
      <div className="p-36 grid place-items-center">
        <SignUp />
      </div>
    </>
  );
}
