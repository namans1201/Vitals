"use client";

import { useState } from "react";
import { IconClose } from "@/components/icons";
import { EXERCISE_FORM_GUIDE } from "@/domain/exerciseFormGuide";
import { slugify } from "@/lib/slug";
import { useEscapeKey } from "@/lib/useEscapeKey";

type Tab = "form" | "mistakes" | "media";

/** No video anywhere - only a real generated image/GIF once one exists at
 * public/exercises/<slug>.gif|png (see EXERCISE_IMAGE_PROMPTS.md /
 * EXERCISE_GIF_PROMPTS.md for the prompts to generate them from). Tries the
 * GIF first since it shows the motion, falls back to a static image, falls
 * back to a plain instruction for where to add one. */
export function ExerciseFormGuideModal({ exerciseName, onClose }: { exerciseName: string; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>("form");
  const guide = EXERCISE_FORM_GUIDE[exerciseName];
  useEscapeKey(onClose);

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-ink/40 px-4 overlay-in" onClick={onClose} role="presentation">
      <div
        className="card modal-in max-h-[85vh] w-full max-w-sm overflow-y-auto p-4"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${exerciseName} form guide`}
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="font-heading text-sm font-bold text-ink">{exerciseName}</span>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-dim hover:bg-panel-2 hover:text-ink"
            aria-label="Close"
          >
            <IconClose size={15} />
          </button>
        </div>

        <div className="mb-3 flex gap-1 rounded-full border border-line bg-panel-2 p-1">
          <ModalTabButton active={tab === "form"} onClick={() => setTab("form")}>
            Form Guide
          </ModalTabButton>
          <ModalTabButton active={tab === "mistakes"} onClick={() => setTab("mistakes")}>
            Mistakes
          </ModalTabButton>
          <ModalTabButton active={tab === "media"} onClick={() => setTab("media")}>
            Media
          </ModalTabButton>
        </div>

        {!guide && (
          <p className="text-sm text-dim">No form guide written for this exercise yet.</p>
        )}

        {guide && tab === "form" && (
          <ol key="form" className="tab-fade list-decimal space-y-2 pl-5 text-sm text-ink">
            {guide.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        )}

        {guide && tab === "mistakes" && (
          <ul key="mistakes" className="tab-fade list-disc space-y-2 pl-5 text-sm text-dim">
            {guide.mistakes.map((mistake, i) => (
              <li key={i}>{mistake}</li>
            ))}
          </ul>
        )}

        {tab === "media" && (
          <div key="media" className="tab-fade">
            <MediaTab exerciseName={exerciseName} />
          </div>
        )}
      </div>
    </div>
  );
}

type MediaView = "anim" | "still";

/** Source art is 1536x1024; scripts/optimize-exercise-media.mjs emits the
 * 768px WebP pair the app actually ships. Both are always offered - the
 * animation shows the movement, the still is easier to study mid-set. */
const MEDIA_SIZE = { width: 768, height: 512 };

function MediaTab({ exerciseName }: { exerciseName: string }) {
  const slug = slugify(exerciseName);
  const [view, setView] = useState<MediaView>("anim");
  const [failed, setFailed] = useState<Record<MediaView, boolean>>({ anim: false, still: false });

  if (failed.anim && failed.still) {
    return (
      <div className="rounded-xl bg-panel-2 p-4 text-center text-xs text-faint">
        No media yet. Generate it from EXERCISE_IMAGE_PROMPTS.md /
        EXERCISE_GIF_PROMPTS.md, drop the PNG and GIF into{" "}
        <code className="text-dim">public/exercises/</code>, then run{" "}
        <code className="text-dim">node scripts/optimize-exercise-media.mjs</code>.
      </div>
    );
  }

  // If the preferred view is missing, fall through to whichever one loaded.
  const active: MediaView = failed[view] ? (view === "anim" ? "still" : "anim") : view;
  const src = active === "anim" ? `/exercises/${slug}-anim.webp` : `/exercises/${slug}.webp`;

  return (
    <div className="space-y-2">
      <div className="overflow-hidden rounded-xl bg-panel-2">
        {/* Already-optimised local WebP at a known size - next/image would
            only re-encode what this pipeline has already done. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={active}
          src={src}
          alt={`${exerciseName} - ${active === "anim" ? "movement" : "position"}`}
          width={MEDIA_SIZE.width}
          height={MEDIA_SIZE.height}
          className="w-full object-contain"
          onError={() => setFailed((f) => ({ ...f, [active]: true }))}
        />
      </div>

      {!failed.anim && !failed.still && (
        <div className="flex gap-1 rounded-full border border-line bg-panel-2 p-0.5">
          <MediaToggle active={active === "anim"} onClick={() => setView("anim")}>
            Animated
          </MediaToggle>
          <MediaToggle active={active === "still"} onClick={() => setView("still")}>
            Still
          </MediaToggle>
        </div>
      )}
    </div>
  );
}

function MediaToggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`h-7 flex-1 rounded-full text-[11px] font-medium transition-colors ${
        active ? "bg-accent text-white" : "text-dim hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function ModalTabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`h-9 flex-1 rounded-full text-xs font-medium transition-colors ${
        active ? "bg-accent text-white" : "text-dim hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
