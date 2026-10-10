import { notFound } from "next/navigation";
import { getCluster } from "@/content/clusters";
import { PhoneShell } from "@/components/Logo";
import { TestView } from "@/components/TestView";

export default function TestPage({
  params,
}: {
  params: { clusterId: string };
}) {
  const cluster = getCluster(params.clusterId);
  if (!cluster) notFound();
  return (
    <PhoneShell>
      <TestView cluster={cluster} />
    </PhoneShell>
  );
}
