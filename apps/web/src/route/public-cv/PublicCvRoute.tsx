import { getProfileContent } from "@/features/profile-content/data/profile-content";
import { PublicCvPage } from "@/page/public-cv/PublicCvPage";

export async function PublicCvRoute() {
  const content = await getProfileContent();

  return <PublicCvPage content={content} />;
}
