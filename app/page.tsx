import { defaultContent } from "@/lib/cv";
import PublicCV from "@/components/PublicCV";

export default function Home() {
  return <PublicCV content={defaultContent} />;
}