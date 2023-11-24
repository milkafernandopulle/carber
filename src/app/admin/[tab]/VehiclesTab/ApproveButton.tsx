"use client";
import { Button } from "@/components/ui/button";
import { approveAdmin } from "./actions";

type ApproveButtonProps = {
  vehicleId: number;
};
export default function ApproveButton({ vehicleId }: ApproveButtonProps) {
  async function handleAdminApprove() {
    console.log("approveAdmin", vehicleId);
    await approveAdmin(vehicleId);
  }

  return (
    <>
      <Button variant="ghost" onClick={handleAdminApprove}>
        Approve
      </Button>
    </>
  );
}
