import { getValidSlugs } from "@/lib/navigation";
import AdminSectionClient from "./AdminSectionClient";

export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = getValidSlugs("frontman");
  return slugs.map((slug) => ({
    section: slug,
  }));
}

type PageProps = {
  params: Promise<{ section: string }>;
};

export default async function AdminSectionPage({ params }: PageProps) {
  const { section } = await params;
  return <AdminSectionClient section={section} />;
}
