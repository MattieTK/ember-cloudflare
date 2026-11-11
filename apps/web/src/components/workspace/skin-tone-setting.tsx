import { useRef, useState } from "react";
import type { SkinTone } from "@ember/protocol";
import { useMounted } from "@/hooks/use-mounted";
import { changeSkinTone, isSignedOut } from "@/lib/api";
import { SKIN_TONES, withSkinTone } from "@/lib/skin-tone";

// The Skin tone section of your profile: the tone of the people and hands you type by their :codes and
// add as quick reactions, as Slack's default skin tone is, for your account, so every browser of yours
// has it. A choice saves at once, and shows as it was again if it isn't saved. Arrowing through the
// tones saves each, the last one's answer counting. Boxed as the Ember AI section is.

/** The hand each tone shows on, as Slack's skin tone picker shows them. */
const HAND = "✋";

interface Props {
  /** Your tone, as the app has it. */
  skinTone: SkinTone;
  /** Gives the app your tone as it's saved. */
  onChanged: (skinTone: SkinTone) => void;
  /** Says why a change wasn't saved, as the workspace's alerts do. */
  onFailed: (error: unknown) => void;
}

export function SkinToneSetting({ skinTone, onChanged, onFailed }: Props) {
  // The tone chosen while it saves, and how many have been, so only the last one's answer counts.
  const [choosing, setChoosing] = useState<SkinTone | null>(null);
  const chosen = useRef(0);
  const mounted = useMounted();
  const shown = choosing ?? skinTone;

  const choose = (tone: SkinTone) => {
    const choice = ++chosen.current;
    const last = () => choice === chosen.current;
    setChoosing(tone);
    changeSkinTone(tone).then(
      (saved) => {
        if (!last()) return;
        onChanged(saved);
        if (mounted.current) setChoosing(null);
      },
      (error: unknown) => {
        if (!last() || (!mounted.current && !isSignedOut(error))) return;
        setChoosing(null);
        onFailed(error);
      },
    );
  };

  return (
    <section aria-labelledby="skin-tone-heading" className="flex flex-col gap-3 rounded-[10px] border bg-surface px-[2ch] py-4 max-md:px-3">
      <h2 id="skin-tone-heading" className="text-base font-semibold">
        Skin tone
      </h2>
      <p id="skin-tone-explained">The skin tone of the people and hands you add as emoji by their :codes, and as quick reactions.</p>
      <div role="radiogroup" aria-labelledby="skin-tone-heading" aria-describedby="skin-tone-explained" className="flex flex-wrap gap-1">
        {SKIN_TONES.map(({ tone, label }) => (
          <label
            key={tone}
            title={label}
            className="relative grid size-11 cursor-pointer place-items-center rounded-[8px] border border-transparent hover:bg-hover has-checked:border-foreground has-checked:bg-background has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-foreground"
          >
            <input
              type="radio"
              name="skin-tone"
              value={tone}
              checked={shown === tone}
              aria-label={label}
              onChange={() => choose(tone)}
              className="absolute size-px opacity-0 [clip-path:inset(50%)]"
            />
            <span aria-hidden className="text-[1.5rem] leading-none">
              {withSkinTone(HAND, tone)}
            </span>
          </label>
        ))}
      </div>
    </section>
  );
}
