"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useProgress } from "@/lib/progress";
import { IcAlert, IcArrow, IcCheck, IcLeft, IcReset, IcX } from "@/components/icons";
import type { Cluster } from "@/types/content";

const BADGES = ["А", "Б", "В", "Г", "Д"];

export function TestView({ cluster }: { cluster: Cluster }) {
  const router = useRouter();
  const { passTest } = useProgress();

  const questions = cluster.test.questions;
  const total = questions.length;
  const passScore = cluster.test.passScore ?? total;
  const backToMap = () => router.push(`/cluster/${cluster.id}`);

  // step: 0..total-1 — вопросы; total — экран результата.
  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState<(number | null)[]>(() =>
    Array(total).fill(null),
  );

  const score = useMemo(
    () =>
      picks.reduce<number>(
        (acc, pick, i) =>
          pick !== null && questions[i].options[pick].isCorrect ? acc + 1 : acc,
        0,
      ),
    [picks, questions],
  );

  const isResult = step >= total;
  const passed = isResult && score >= passScore;

  useEffect(() => {
    if (passed) passTest(cluster.id);
  }, [passed, cluster.id, passTest]);

  const retry = () => {
    setPicks(Array(total).fill(null));
    setStep(0);
  };

  // ── Экран результата ──────────────────────────────────────────────
  if (isResult) {
    return (
      <div className="screen screen--anim">
        <div className="appbar">
          <button className="iconbtn" aria-label="На карту" onClick={backToMap}>
            <IcLeft />
          </button>
          <span className="appbar__title overline">Результат теста</span>
          <span className="appbar__end caption">
            {score} / {total}
          </span>
        </div>

        <div
          className="col"
          style={{ alignItems: "center", gap: "var(--space-6)", marginTop: "var(--space-8)" }}
        >
          <span
            className={"appicon" + (passed ? "" : " appicon--muted")}
            aria-hidden="true"
          >
            <span>{passed ? "A" : "!"}</span>
          </span>
          <h1 className="title-lg" style={{ textAlign: "center" }}>
            {passed ? "Кейс закрыт" : "Почти получилось"}
          </h1>
          <p className="card__text body" style={{ textAlign: "center", maxWidth: "32ch" }}>
            Верных ответов: {score} из {total}. Порог прохождения — {passScore}.
          </p>
        </div>

        <div className={"resultbar " + (passed ? "resultbar--ok" : "resultbar--no")}>
          {passed ? <IcCheck /> : <IcAlert />}
          <span className="label">
            {passed ? "Тест пройден" : "Нужно ещё раз пройти разбор"}
          </span>
        </div>

        <div className="foot">
          <button className="btn btn--glow btn--block label" onClick={retry}>
            <IcReset sm /> Пройти заново
          </button>
          <button
            className={"btn btn--block label" + (passed ? " btn--glow" : " btn--secondary")}
            onClick={backToMap}
          >
            Готово <IcArrow sm />
          </button>
        </div>
      </div>
    );
  }

  // ── Экран вопроса ─────────────────────────────────────────────────
  const q = questions[step];
  const sel = picks[step];
  const answered = sel !== null;
  const select = (k: number) => {
    if (answered) return;
    setPicks((prev) => {
      const next = [...prev];
      next[step] = k;
      return next;
    });
  };
  const optMod = (isCorrect: boolean, k: number) => {
    if (!answered) return "";
    if (isCorrect) return " option--correct";
    if (k === sel) return " option--wrong";
    return "";
  };
  const lastQuestion = step === total - 1;

  return (
    <div className="screen screen--anim" key={step}>
      <div className="appbar">
        <button
          className="iconbtn"
          aria-label="Назад"
          onClick={() => (step === 0 ? backToMap() : setStep(step - 1))}
        >
          <IcLeft />
        </button>
        <span className="appbar__title overline">Итоговый кейс-тест</span>
        <span className="appbar__end caption">
          {step + 1} / {total}
        </span>
      </div>

      <section className="card">
        <div className="case">
          <span className="case__ava title-sm" aria-hidden="true">
            А
          </span>
          <div className="case__main">
            <h3 className="title-sm">{cluster.avatar.name}</h3>
            <p className="card__text caption">{cluster.avatar.case}</p>
          </div>
        </div>
      </section>

      <h1 className="title-md">{q.question}</h1>

      <div className="col" style={{ gap: "var(--space-3)" }}>
        {q.options.map((o, k) => {
          const selected = k === sel;
          return (
            <button
              key={k}
              className={
                "option" +
                (selected && !answered ? " option--selected" : "") +
                optMod(o.isCorrect, k)
              }
              onClick={() => select(k)}
              disabled={answered}
            >
              <span className="option__badge">{BADGES[k]}</span>
              <span className="option__main">
                <span className="body">{o.text}</span>
                {answered && (selected || o.isCorrect) && (
                  <>
                    <span className="option__verdict label-sm">
                      {o.isCorrect ? (
                        <>
                          <IcCheck sm /> Верно
                        </>
                      ) : (
                        <>
                          <IcX sm /> Неверно
                        </>
                      )}
                    </span>
                    <span className="option__fb caption">{o.feedback}</span>
                  </>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div className="foot">
        {answered ? (
          <button
            className="btn btn--glow btn--block label"
            onClick={() => setStep(step + 1)}
          >
            {lastQuestion ? "Показать результат" : "Следующий вопрос"}{" "}
            <IcArrow sm />
          </button>
        ) : (
          <button className="btn btn--secondary btn--block label" onClick={backToMap}>
            Отмена
          </button>
        )}
      </div>
    </div>
  );
}
