import { Vehicle, VehicleAvailability } from "@prisma/client";
import AvailabilityPanel from "./AvailabilityPanel";
import { updateVehicleAvailability } from "./actions";

type VehicleAvailabilityProps = {
  vehicle: Vehicle & { availabilities: VehicleAvailability[] };
};
export default function VehicleAvailability({ vehicle }: VehicleAvailabilityProps) {
  return (
    <>
      <AvailabilityPanel vehicle={vehicle} onUpdate={updateVehicleAvailability} />
    </>
  );
}
