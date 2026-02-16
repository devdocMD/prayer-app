"use client";

import { useMemo, useState } from "react";
import { prayers } from "@/data/prayers";

function getScore(
  prayer: (typeof prayers)[number],
  emotion: string,
  situation: string
) {
  let score = 0;

  if (emotion && prayer.emotions.includes(emotion)) {
    score += 3;
  }

  if (situation && prayer.situations.includes(situation)) {
    score += 3;
  }

  if (
    emotion &&
    situation &&
    prayer.emotions.includes(emotion) &&
    prayer.situations.includes(situation)
  ) {
    score += 2;
  }

  return score;
}

export default function Home() {
  const [selectedEmotion, setSelectedEmotion] = useState("");
  const [selectedSituation, setSelectedSituation] = useState("");
  const [shareMessage, setShareMessage] = useState("");

  const emotions = useMemo(
    () =>
      Array.from(new Set(prayers.flatMap((prayer) => prayer.emotions))).sort(
        (a, b) => a.localeCompare(b, "ko")
      ),
    []
  );

  const situations = useMemo(
    () =>
      Array.from(new Set(prayers.flatMap((prayer) => prayer.situations))).sort(
        (a, b) => a.localeCompare(b, "ko")
      ),
    []
  );

  const recommendations = useMemo(() => {
    const scored = prayers
      .map((prayer) => ({
        prayer,
        score: getScore(prayer, selectedEmotion, selectedSituation)
      }))
      .sort((a, b) => b.score - a.score || a.prayer.title.localeCompare(b.prayer.title, "ko"));

    if (!selectedEmotion && !selectedSituation) {
      return scored.slice(0, 3).map((item) => item.prayer);
    }

    const matched = scored.filter((item) => item.score > 0);
    return (matched.length ? matched : scored).slice(0, 3).map((item) => item.prayer);
  }, [selectedEmotion, selectedSituation]);

  const featured = recommendations[0];

  const buildShareText = (title: string, body: string) => {
    const emotionLabel = selectedEmotion || "전체 감정";
    const situationLabel = selectedSituation || "전체 상황";
    return `[마음기도 추천]
감정: ${emotionLabel}
상황: ${situationLabel}

${title}
${body}`;
  };

  const copyText = async (text: string) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  };

  const handleCopy = async () => {
    if (!featured) {
      return;
    }

    const shareText = `${buildShareText(featured.title, featured.body)}

${window.location.href}`;

    try {
      await copyText(shareText);
      setShareMessage("기도문이 클립보드에 복사되었습니다.");
    } catch {
      setShareMessage("복사에 실패했습니다. 브라우저 권한을 확인해 주세요.");
    }
  };

  const handleShare = async () => {
    if (!featured) {
      return;
    }

    const shareText = buildShareText(featured.title, featured.body);
    const shareUrl = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `마음기도 - ${featured.title}`,
          text: shareText,
          url: shareUrl
        });
        setShareMessage("공유 창을 열었습니다.");
        return;
      }

      await copyText(`${shareText}\n\n${shareUrl}`);
      setShareMessage("이 브라우저는 앱 공유를 지원하지 않아 클립보드로 복사했습니다.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      setShareMessage("공유에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <main className="page-shell">
      <header className="space-y-4">
        <p className="inline-flex rounded-full border border-white/80 bg-white/70 px-4 py-2 text-xs font-semibold tracking-[0.16em] text-ink/70 uppercase">
          Prayer Curation
        </p>
        <h1 className="max-w-3xl text-4xl leading-tight font-semibold text-ink sm:text-5xl">
          오늘의 감정과 상황에 맞는 기도문을 추천해 드립니다.
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-ink/70 sm:text-lg">
          감정과 상황을 각각 선택하면 가장 잘 맞는 샘플 기도문 3개를 보여줍니다. 지금은 샘플 기반
          추천만 제공하며, 다음 단계에서 키워드 검색 API와 즐겨찾기, 공유 기능을 붙일 수 있게 구조를
          열어두었습니다.
        </p>
      </header>

      <section className="card glass space-y-8">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-ink">감정 선택</h2>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedEmotion("")}
              className={`pill ${selectedEmotion === "" ? "pill-active" : ""}`}
            >
              전체
            </button>
            {emotions.map((emotion) => (
              <button
                key={emotion}
                type="button"
                onClick={() => setSelectedEmotion(emotion)}
                className={`pill ${selectedEmotion === emotion ? "pill-active" : ""}`}
              >
                {emotion}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-ink">상황 선택</h2>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedSituation("")}
              className={`pill ${selectedSituation === "" ? "pill-active" : ""}`}
            >
              전체
            </button>
            {situations.map((situation) => (
              <button
                key={situation}
                type="button"
                onClick={() => setSelectedSituation(situation)}
                className={`pill ${selectedSituation === situation ? "pill-active" : ""}`}
              >
                {situation}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section>
        <article className="card glass space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-ink">추천 기도문</h2>
            <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-ink/65">
              {selectedEmotion || "전체 감정"} · {selectedSituation || "전체 상황"}
            </span>
          </div>

          {featured ? (
            <div className="space-y-4">
              <h3 className="text-2xl leading-snug text-ink">{featured.title}</h3>
              <p className="whitespace-pre-line text-base leading-8 text-ink/85">{featured.body}</p>
              <div className="flex flex-wrap gap-2">
                {featured.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-ink/10 bg-white/75 px-3 py-1 text-xs font-medium text-ink/75"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="pill pill-active border-0 px-5 py-2.5 text-sm"
                >
                  앱으로 공유
                </button>
                <button type="button" onClick={handleCopy} className="pill px-5 py-2.5 text-sm">
                  복사
                </button>
                <span className="text-xs text-ink/60">
                  모바일에서는 카카오톡, 메시지, 메모 등으로 바로 공유할 수 있습니다.
                </span>
              </div>
              {shareMessage ? <p className="text-sm text-ink/70">{shareMessage}</p> : null}
            </div>
          ) : (
            <p className="text-ink/70">조건에 맞는 기도문을 찾지 못했습니다.</p>
          )}
        </article>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-ink">함께 보는 추천 목록</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {recommendations.map((prayer) => (
            <article key={prayer.id} className="card glass space-y-3 p-5">
              <h3 className="text-lg leading-snug text-ink">{prayer.title}</h3>
              <p className="line-clamp-4 text-sm leading-6 text-ink/75">{prayer.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
