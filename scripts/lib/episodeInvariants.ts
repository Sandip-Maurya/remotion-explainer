import * as fs from 'fs';
import * as path from 'path';

export const VALID_SFX = [
  'sub-drop',
  'pop',
  'whoosh',
  'cash-register',
  'chime',
  'clock-tick',
] as const;

export const VALID_SCENE_TYPES = [
  'hook',
  'human-stakes',
  'chart-explanation',
  'dramatic-climax',
  'empowerment-payoff',
] as const;

export type IssueLevel = 'error' | 'warn' | 'info';

export interface Issue {
  level: IssueLevel;
  code: string;
  message: string;
}

export interface CaptionTokenLike {
  text: string;
  startMs: number;
  endMs: number;
  isEmphasized?: boolean;
}

export interface SceneLike {
  id?: string;
  type: string;
  durationInFrames: number;
  dramaticPauseFrames?: number;
}

export interface BeatLike {
  id?: string;
  slot?: string;
  durationInFrames: number;
  dramaticPauseFrames?: number;
  props?: Record<string, unknown>;
}

export interface VideoContentLike {
  id: string;
  fps: number;
  totalDurationInFrames: number;
  templateId?: string;
  templateVersion?: number;
  narration: {
    engine: string;
    voiceId: string;
    audioFile: string;
    durationInSeconds: number;
  };
  sfxEvents?: Array<{ frame: number; soundId: string; volume?: number }>;
  captions?: CaptionTokenLike[];
  /** Legacy scene list */
  scenes?: SceneLike[];
  /** Schema v1 beat list */
  beats?: BeatLike[];
}

export interface EpisodePaths {
  slug: string;
  episodeDir: string;
  contentPath: string;
  captionsPath: string;
  scriptPath: string;
  narrationPath: string;
  publicDir: string;
  publicNarrationPath: string;
  publicCaptionsPath: string;
  root: 'episodes' | 'videos';
}

/** Prefer episodes/<slug>, fall back to legacy videos/<slug>. */
export function resolveEpisodePaths(workspaceRoot: string, slug: string): EpisodePaths {
  const candidates: Array<{ root: 'episodes' | 'videos'; dir: string }> = [
    { root: 'episodes', dir: path.join(workspaceRoot, 'episodes', slug) },
    { root: 'videos', dir: path.join(workspaceRoot, 'videos', slug) },
  ];

  for (const candidate of candidates) {
    const contentPath = path.join(candidate.dir, 'content.json');
    if (fs.existsSync(contentPath)) {
      const publicDir = path.join(workspaceRoot, 'public', slug);
      return {
        slug,
        episodeDir: candidate.dir,
        contentPath,
        captionsPath: path.join(candidate.dir, 'captions.json'),
        scriptPath: path.join(candidate.dir, 'script.txt'),
        narrationPath: path.join(candidate.dir, 'narration.mp3'),
        publicDir,
        publicNarrationPath: path.join(publicDir, 'narration.mp3'),
        publicCaptionsPath: path.join(publicDir, 'captions.json'),
        root: candidate.root,
      };
    }
  }

  // Default target path for new episodes (even if missing — callers check exists)
  const episodeDir = path.join(workspaceRoot, 'episodes', slug);
  const publicDir = path.join(workspaceRoot, 'public', slug);
  return {
    slug,
    episodeDir,
    contentPath: path.join(episodeDir, 'content.json'),
    captionsPath: path.join(episodeDir, 'captions.json'),
    scriptPath: path.join(episodeDir, 'script.txt'),
    narrationPath: path.join(episodeDir, 'narration.mp3'),
    publicDir,
    publicNarrationPath: path.join(publicDir, 'narration.mp3'),
    publicCaptionsPath: path.join(publicDir, 'captions.json'),
    root: 'episodes',
  };
}

export function getTimingUnits(content: VideoContentLike): Array<{
  id?: string;
  durationInFrames: number;
  dramaticPauseFrames?: number;
  kind: 'beat' | 'scene';
}> {
  if (content.beats && content.beats.length > 0) {
    return content.beats.map((b) => ({
      id: b.id ?? b.slot,
      durationInFrames: b.durationInFrames,
      dramaticPauseFrames:
        typeof b.props?.dramaticPauseFrames === 'number'
          ? b.props.dramaticPauseFrames
          : b.dramaticPauseFrames,
      kind: 'beat' as const,
    }));
  }
  return (content.scenes ?? []).map((s) => ({
    id: s.id,
    durationInFrames: s.durationInFrames,
    dramaticPauseFrames: s.dramaticPauseFrames,
    kind: 'scene' as const,
  }));
}

export function loadJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
}

export function loadCaptions(paths: EpisodePaths, content: VideoContentLike): CaptionTokenLike[] {
  if (Array.isArray(content.captions) && content.captions.length > 0) {
    return content.captions;
  }
  if (fs.existsSync(paths.captionsPath)) {
    return loadJson<CaptionTokenLike[]>(paths.captionsPath);
  }
  if (fs.existsSync(paths.publicCaptionsPath)) {
    return loadJson<CaptionTokenLike[]>(paths.publicCaptionsPath);
  }
  return [];
}

export function expectedFramesFromAudio(durationInSeconds: number, fps: number): number {
  return Math.ceil(durationInSeconds * fps);
}

export function validateEpisode(
  content: VideoContentLike,
  captions: CaptionTokenLike[],
  options: { checkAssets?: boolean; paths?: EpisodePaths } = {},
): Issue[] {
  const issues: Issue[] = [];
  const fps = content.fps || 30;
  const total = content.totalDurationInFrames;
  const units = getTimingUnits(content);
  const sceneSum = units.reduce((sum, u) => sum + (u.durationInFrames || 0), 0);
  const audioFrames = expectedFramesFromAudio(content.narration.durationInSeconds, fps);
  const totalMs = (total / fps) * 1000;
  const unitLabel = content.beats && content.beats.length > 0 ? 'Beat' : 'Scene';

  if (!content.id) {
    issues.push({ level: 'error', code: 'missing-id', message: 'content.id is required' });
  }

  if (!content.narration?.audioFile) {
    issues.push({
      level: 'error',
      code: 'missing-audio-file',
      message: 'narration.audioFile is required',
    });
  }

  if (units.length === 0) {
    issues.push({
      level: 'error',
      code: 'missing-beats-or-scenes',
      message: 'content.json needs beats[] (Schema v1) or legacy scenes[]',
    });
  }

  if (sceneSum !== total) {
    issues.push({
      level: 'error',
      code: 'frame-sum-mismatch',
      message: `${unitLabel} duration sum (${sceneSum}) !== totalDurationInFrames (${total})`,
    });
  } else {
    issues.push({
      level: 'info',
      code: 'frame-sum-ok',
      message: `${unitLabel} frame sum matches totalDurationInFrames (${total})`,
    });
  }

  const roundedAudioFrames = Math.round(content.narration.durationInSeconds * fps);
  if (audioFrames !== total) {
    // Legacy episodes sometimes used round() instead of ceil(); treat 1-frame drift as warn
    const level =
      Math.abs(audioFrames - total) === 1 && roundedAudioFrames === total ? 'warn' : 'error';
    issues.push({
      level,
      code: 'audio-duration-mismatch',
      message: `Audio frames ceil(duration*fps)=${audioFrames} !== totalDurationInFrames (${total}). Run with --sync to update total from narration.`,
    });
  } else {
    issues.push({
      level: 'info',
      code: 'audio-duration-ok',
      message: `Audio duration sync OK (${content.narration.durationInSeconds}s → ${audioFrames} frames)`,
    });
  }

  if (sceneSum !== audioFrames) {
    issues.push({
      level: 'warn',
      code: 'scene-vs-audio',
      message: `Scene sum (${sceneSum}) differs from audio frames (${audioFrames}). Rebalance beat durations after TTS.`,
    });
  }

  // Climax pause: legacy dramatic-climax scenes OR beat props.dramaticPauseFrames / climax slots
  const climaxScenes = (content.scenes ?? []).filter((s) => s.type === 'dramatic-climax');
  const climaxBeats = (content.beats ?? []).filter(
    (b) =>
      b.slot === 'climax-drop' ||
      b.slot === 'goal-paths' ||
      typeof b.props?.dramaticPauseFrames === 'number' ||
      typeof b.dramaticPauseFrames === 'number',
  );

  if (climaxScenes.length === 0 && climaxBeats.length === 0) {
    issues.push({
      level: 'warn',
      code: 'missing-climax',
      message: 'No climax scene/beat with dramatic pause found',
    });
  }

  for (const scene of climaxScenes) {
    const pause = scene.dramaticPauseFrames ?? 0;
    if (pause < 30 || pause > 60) {
      issues.push({
        level: 'error',
        code: 'climax-pause-range',
        message: `Scene "${scene.id ?? 'climax'}": dramaticPauseFrames=${pause} must be 30–60`,
      });
    } else {
      issues.push({
        level: 'info',
        code: 'climax-pause-ok',
        message: `Climax pause OK (${pause} frames)`,
      });
    }
  }

  for (const beat of climaxBeats) {
    const pause =
      (typeof beat.props?.dramaticPauseFrames === 'number'
        ? beat.props.dramaticPauseFrames
        : beat.dramaticPauseFrames) ?? 0;
    if (pause === 0) continue; // slot present but pause optional until I2 props filled
    if (pause < 30 || pause > 60) {
      issues.push({
        level: 'error',
        code: 'climax-pause-range',
        message: `Beat "${beat.id ?? beat.slot}": dramaticPauseFrames=${pause} must be 30–60`,
      });
    } else {
      issues.push({
        level: 'info',
        code: 'climax-pause-ok',
        message: `Climax pause OK (${pause} frames)`,
      });
    }
  }

  for (const scene of content.scenes ?? []) {
    if (!VALID_SCENE_TYPES.includes(scene.type as (typeof VALID_SCENE_TYPES)[number])) {
      issues.push({
        level: 'error',
        code: 'invalid-scene-type',
        message: `Invalid scene type "${scene.type}" on ${scene.id ?? '(missing id)'}`,
      });
    }
    if (!scene.durationInFrames || scene.durationInFrames <= 0) {
      issues.push({
        level: 'error',
        code: 'invalid-scene-duration',
        message: `Scene "${scene.id ?? scene.type}" has invalid durationInFrames`,
      });
    }
  }

  for (const beat of content.beats ?? []) {
    if (!beat.slot) {
      issues.push({
        level: 'error',
        code: 'missing-beat-slot',
        message: `Beat "${beat.id ?? '(missing id)'}" has no slot`,
      });
    }
    if (!beat.durationInFrames || beat.durationInFrames <= 0) {
      issues.push({
        level: 'error',
        code: 'invalid-beat-duration',
        message: `Beat "${beat.id ?? beat.slot}" has invalid durationInFrames`,
      });
    }
  }

  for (const cue of content.sfxEvents ?? []) {
    if (!VALID_SFX.includes(cue.soundId as (typeof VALID_SFX)[number])) {
      issues.push({
        level: 'error',
        code: 'invalid-sfx',
        message: `Unknown soundId "${cue.soundId}" at frame ${cue.frame}`,
      });
    }
    if (cue.frame < 0 || cue.frame >= total) {
      issues.push({
        level: 'error',
        code: 'sfx-out-of-bounds',
        message: `SFX "${cue.soundId}" at frame ${cue.frame} is outside [0, ${total})`,
      });
    }
  }

  // Allow 1 frame of TTS rounding slack past the declared video end
  const captionEndSlackMs = 1000 / fps;
  if (captions.length === 0) {
    issues.push({
      level: 'warn',
      code: 'no-captions',
      message: 'No captions found in content.json or captions.json',
    });
  } else {
    let captionErrors = 0;
    for (let i = 0; i < captions.length; i++) {
      const token = captions[i];
      const inBounds =
        token.startMs >= 0 &&
        token.startMs < token.endMs &&
        token.endMs <= totalMs + captionEndSlackMs;
      if (!inBounds) {
        captionErrors += 1;
        if (captionErrors <= 5) {
          issues.push({
            level: 'error',
            code: 'caption-bounds',
            message: `Caption[${i}] "${token.text}" bounds invalid (${token.startMs}–${token.endMs}ms; video ends ${totalMs.toFixed(0)}ms)`,
          });
        }
      }
    }
    if (captionErrors > 5) {
      issues.push({
        level: 'error',
        code: 'caption-bounds-more',
        message: `…and ${captionErrors - 5} more caption boundary errors`,
      });
    }
    if (captionErrors === 0) {
      issues.push({
        level: 'info',
        code: 'captions-ok',
        message: `${captions.length} caption tokens within video bounds`,
      });
    }
  }

  if (options.checkAssets && options.paths) {
    const { paths } = options;
    const requiredFiles = [
      paths.scriptPath,
      paths.contentPath,
      paths.narrationPath,
      paths.publicNarrationPath,
    ];
    for (const file of requiredFiles) {
      if (!fs.existsSync(file)) {
        issues.push({
          level: 'warn',
          code: 'missing-asset',
          message: `Missing file: ${path.relative(process.cwd(), file)}`,
        });
      }
    }
  }

  return issues;
}

export function syncDurationFromNarration(content: VideoContentLike): {
  previous: number;
  next: number;
  changed: boolean;
} {
  const previous = content.totalDurationInFrames;
  const next = expectedFramesFromAudio(content.narration.durationInSeconds, content.fps || 30);
  content.totalDurationInFrames = next;
  return { previous, next, changed: previous !== next };
}

export function summarizeIssues(issues: Issue[]): {
  errors: number;
  warnings: number;
  infos: number;
  ok: boolean;
} {
  const errors = issues.filter((i) => i.level === 'error').length;
  const warnings = issues.filter((i) => i.level === 'warn').length;
  const infos = issues.filter((i) => i.level === 'info').length;
  return { errors, warnings, infos, ok: errors === 0 };
}
