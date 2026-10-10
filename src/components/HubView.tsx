"use client";

import { useRouter } from "next/navigation";
import { useProgress } from "@/lib/progress";
import { Logo } from "@/components/Logo";
import { IcArrow, IcCheck, IcRight, IcUser } from "@/components/icons";
import { CLUSTERS, UPCOMING_CLUSTERS } from "@/content/clusters";
import type { Cluster } from "@/types/content";

function clusterProgress(cluster: Cluster, status: Record<string, string>) {
  const total = cluster.topics.length;
  const done = cluster.topics.filter((t) => status[t.id] === "done").length;
  return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
}

export function HubView() {
  const router = useRouter();
  const { status, testPassed, user } = useProgress();

  return (
    <div className="screen screen--anim">
      <div className="head">
        <Logo size={20} />
        <button
          className="iconbtn"
          aria-label={user ? "Профиль" : "Войти"}
          onClick={() => router.push("/profile")}
        >
          <IcUser />
        </button>
      </div>

      <div className="section">
        <span className="section__over overline">Фундаментальное обучение психологии</span>
        <h1 className="title-lg">Карта курсов</h1>
      </div>

      <div className="col" style={{ gap: "var(--space-4)" }}>
        {CLUSTERS.map((cluster, i) => {
          const { total, done, pct } = clusterProgress(cluster, status);
          const complete = done === total && testPassed[cluster.id];
          return (
            <button
              key={cluster.id}
              className="hubcard"
              onClick={() => router.push(`/cluster/${cluster.id}`)}
            >
              <div className="hubcard__top">
                <span className="card__over overline">
                  Кластер {String(i + 1).padStart(2, "0")}
                </span>
                {complete ? (
                  <span className="badge badge--done">
                    <IcCheck sm /> Пройден
                  </span>
                ) : (
                  <span className="node__go">
                    <IcRight />
                  </span>
                )}
              </div>
              <h2 className="title-md">{cluster.title}</h2>
              <p className="card__text body">{cluster.description}</p>
              <div className="progress">
                <div className="progress__meta caption">
                  <span>
                    Освоено тем: {done} из {total}
                  </span>
                  <span>{pct}%</span>
                </div>
                <div
                  className="progress__track"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={pct}
                >
                  <div className="progress__fill" style={{ width: pct + "%" }} />
                </div>
              </div>
            </button>
          );
        })}

        {UPCOMING_CLUSTERS.map((stub, i) => (
          <div key={stub.id} className="hubcard hubcard--soon">
            <div className="hubcard__top">
              <span className="card__over overline">
                Кластер {String(CLUSTERS.length + i + 1).padStart(2, "0")}
              </span>
              <span className="badge badge--soon">Скоро</span>
            </div>
            <h2 className="title-md">{stub.title}</h2>
            <p className="card__text body">{stub.description}</p>
          </div>
        ))}
      </div>

      <div className="foot">
        <button
          className="btn btn--glow btn--block label"
          onClick={() => router.push(`/cluster/${CLUSTERS[0].id}`)}
        >
          {clusterProgress(CLUSTERS[0], status).done > 0
            ? "Продолжить обучение"
            : "Начать обучение"}{" "}
          <IcArrow sm />
        </button>
      </div>
    </div>
  );
}
