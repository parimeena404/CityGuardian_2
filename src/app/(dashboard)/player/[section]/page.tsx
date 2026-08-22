import { getValidSlugs } from "@/lib/navigation";
import PlayerSectionClient from "./PlayerSectionClient";

export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = getValidSlugs("player");
  return slugs.map((slug) => ({
    section: slug,
  }));
}

type PageProps = {
  params: Promise<{ section: string }>;
};

export default async function PlayerSectionPage({ params }: PageProps) {
  const { section } = await params;
  return <PlayerSectionClient section={section} />;
}
