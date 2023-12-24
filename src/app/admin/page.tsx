import { redirect } from "next/navigation";

type PageProps = {};
export default function Page({}: PageProps) {
  redirect(`/admin/statistics`);
}
