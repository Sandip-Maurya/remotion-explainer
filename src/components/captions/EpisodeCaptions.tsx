// Loads public/<slug>/captions.json and renders KineticCaptions.
import React, { useEffect, useState } from 'react';
import { continueRender, delayRender, staticFile } from 'remotion';
import type { CaptionToken } from '../../types/content.types';
import { KineticCaptions } from './KineticCaptions';

export interface EpisodeCaptionsProps {
  /** Episode id / public folder slug, e.g. 004-credit-card-blood */
  slug: string;
  activeColor?: string;
  emphasisColor?: string;
}

export const EpisodeCaptions: React.FC<EpisodeCaptionsProps> = ({
  slug,
  activeColor,
  emphasisColor,
}) => {
  const [captions, setCaptions] = useState<CaptionToken[] | null>(null);
  const [handle] = useState(() => delayRender(`captions-${slug}`));

  useEffect(() => {
    let cancelled = false;

    fetch(staticFile(`${slug}/captions.json`))
      .then((res) => {
        if (!res.ok) throw new Error(`captions missing: ${slug}`);
        return res.json();
      })
      .then((data: CaptionToken[]) => {
        if (!cancelled) setCaptions(data);
      })
      .catch(() => {
        if (!cancelled) setCaptions([]);
      })
      .finally(() => {
        continueRender(handle);
      });

    return () => {
      cancelled = true;
    };
  }, [slug, handle]);

  if (!captions || captions.length === 0) return null;

  return (
    <KineticCaptions
      captions={captions}
      activeColor={activeColor}
      emphasisColor={emphasisColor}
    />
  );
};
