import { redirect } from "next/navigation";

export default function AdminIndexPage() {
  redirect("/admin/control-center");
}
