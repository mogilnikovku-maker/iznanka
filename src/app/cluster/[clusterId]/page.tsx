import { notFound } from "next/navigation";
import { getCluster } from "@/content/clusters";
import { PhoneShell } from "@/components/Logo";
import { MapView } from "@/components/MapView";

export default function ClusterPage({
  params,
}: {
  params: { clusterId: string };
}) {
  const cluster = getCluster(params.clusterId);
  if (!cluster) notFound();
  return (
    <PhoneShell>
      <MapView cluster={cluster} />
    </PhoneShell>
  );
}
