import { useEffect, useRef } from 'react';

/** Reveal accessible text through a temporary pixelated canvas. */
export function PixelHeading({ text, onRevealed, onFinished, enabled = true, delay = 1200, as = 'h1' }: { text: string; onRevealed?: () => void; onFinished?: () => void; enabled?: boolean; delay?: number; as?: 'h1' | 'p' }) {
  const heading = useRef<HTMLHeadingElement | HTMLParagraphElement | null>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const node = heading.current, output = canvas.current;
    if (!node || !output || !enabled) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches) { delete node.dataset.revealing; onRevealed?.(); onFinished?.(); return; }
    let frame = 0, timer = 0, cancelled = false;
    const start = async () => {
      // A slow font must not leave the heading hidden indefinitely.
      await Promise.race([document.fonts.ready, new Promise<void>(resolve => window.setTimeout(resolve, 500))]);
      if (cancelled) return;
      const rect = node.getBoundingClientRect(), style = getComputedStyle(node);
      const width = Math.max(1, Math.ceil(rect.width)), height = Math.max(1, Math.ceil(rect.height));
      const source = document.createElement('canvas'), reduced = document.createElement('canvas');
      source.width = width; source.height = height;
      const ctx = source.getContext('2d'), target = output.getContext('2d'), mini = reduced.getContext('2d');
      if (!ctx || !target || !mini) { delete node.dataset.revealing; onRevealed?.(); onFinished?.(); return; }
      const size = parseFloat(style.fontSize), lineHeight = parseFloat(style.lineHeight) || size * 1.2;
      ctx.font = `${style.fontWeight} ${size}px ${style.fontFamily}`;
      ctx.fillStyle = style.color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const words = text.split(' '), lines: string[] = [];
      let line = '';
      for (const word of words) {
        const next = line ? `${line} ${word}` : word;
        if (line && ctx.measureText(next).width > width) { lines.push(line); line = word; }
        else line = next;
      }
      if (line) lines.push(line);
      lines.forEach((value, index) => ctx.fillText(value, width / 2, (height - lines.length * lineHeight) / 2 + lineHeight * (index + .5)));
      output.width = width; output.height = height;
      node.dataset.revealing = 'true';
      const begin = performance.now();
      onRevealed?.();
      const render = (now: number) => {
        if (cancelled) return;
        const progress = Math.min(1, (now - begin) / 500);
        const block = Math.max(1, Math.round(14 * (1 - progress)));
        reduced.width = Math.max(1, Math.ceil(width / block)); reduced.height = Math.max(1, Math.ceil(height / block));
        mini.clearRect(0, 0, reduced.width, reduced.height); mini.drawImage(source, 0, 0, reduced.width, reduced.height);
        target.clearRect(0, 0, width, height); target.imageSmoothingEnabled = false; target.drawImage(reduced, 0, 0, width, height);
        if (progress < 1) frame = requestAnimationFrame(render);
        else { delete node.dataset.revealing; onFinished?.(); }
      };
      frame = requestAnimationFrame(render);
    };
    timer = window.setTimeout(() => { void start(); }, delay);
    return () => { cancelled = true; clearTimeout(timer); cancelAnimationFrame(frame); delete node.dataset.revealing; };
  }, [text, onRevealed, onFinished, enabled, delay]);
  const content = <><span>{text}</span><canvas ref={canvas} aria-hidden="true" /></>;
  if (as === 'p') return <p ref={node => { heading.current = node; }} className="pixel-heading" data-revealing="true">{content}</p>;
  return <h1 ref={node => { heading.current = node; }} className="pixel-heading" data-revealing="true">{content}</h1>;
}
