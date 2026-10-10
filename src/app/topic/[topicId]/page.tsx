import { notFound } from "next/navigation";
import { getTopic } from "@/content/clusters";
import { PhoneShell } from "@/components/Logo";
import { TopicView } from "@/components/TopicView";

export default function TopicPage({
  params,
}: {
  params: { topicId: string };
}) {
  const found = getTopic(params.topicId);
  if (!found) notFound();
  return (
    <PhoneShell>
      <TopicView cluster={found.cluster} topic={found.topic} />
    </PhoneShell>
  );
}
