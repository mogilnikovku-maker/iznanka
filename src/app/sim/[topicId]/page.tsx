import { notFound } from "next/navigation";
import { getTopic } from "@/content/clusters";
import { PhoneShell } from "@/components/Logo";
import { SimView } from "@/components/SimView";

export default function SimPage({
  params,
}: {
  params: { topicId: string };
}) {
  const found = getTopic(params.topicId);
  if (!found || !found.topic.simulation) notFound();
  return (
    <PhoneShell>
      <SimView cluster={found.cluster} topic={found.topic} />
    </PhoneShell>
  );
}
