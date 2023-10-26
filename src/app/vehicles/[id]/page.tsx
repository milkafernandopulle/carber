import { redirect } from "next/navigation";

type PageProps = {
  params: { id: string; tab?: string };
};
export default function Page({ params }: PageProps) {
  redirect(`/vehicles/${params.id}/details`);

  return null;
}
