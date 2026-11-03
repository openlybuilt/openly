import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { GlowCloud } from './vendor/affectui/illustrations/glow-cloud';
import { LayerStack, type LayerStackItem } from './vendor/affectui/illustrations/layer-stack';
import { sitePaths } from './site-paths';
import './styles/openly-initiatives.css';

const architecture: LayerStackItem[] = [
  { title: 'Interface', icon: 'pulse' },
  { title: 'Agent', icon: 'spark' },
  { title: 'Tools', icon: 'plug' },
  { title: 'Models', icon: 'bolt' },
  { title: 'Context', icon: 'database' },
];

function MovableCloud() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; startX: number; startY: number } | null>(null);
  const limit = (element: HTMLButtonElement, x: number, y: number) => {
    const parent = element.parentElement;
    if (!parent) return { x: 0, y: 0 };
    const maxX = Math.max(0, (parent.clientWidth - element.offsetWidth) / 2);
    const maxY = Math.max(0, (parent.clientHeight - element.offsetHeight) / 2);
    return { x: Math.max(-maxX, Math.min(maxX, x)), y: Math.max(-maxY, Math.min(maxY, y)) };
  };
  const onDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    drag.current = { x: event.clientX, y: event.clientY, startX: position.x, startY: position.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (!drag.current) return;
    const { x, y, startX, startY } = drag.current;
    setPosition(limit(event.currentTarget, startX + event.clientX - x, startY + event.clientY - y));
  };
  const onKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    const step = 12;
    const delta: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    const direction = delta[event.key];
    if (!direction) return;
    event.preventDefault();
    const element = event.currentTarget;
    setPosition(current => limit(element, current.x + direction[0], current.y + direction[1]));
  };
  return <button type="button" className="movable-cloud" aria-label="Move the glow cloud with the arrow keys" style={{ transform: `translate(${position.x}px, ${position.y}px)` }} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }} onLostPointerCapture={() => { drag.current = null; }} onKeyDown={onKey}>
    <span aria-hidden="true"><GlowCloud background={false}/></span>
  </button>;
}

export function Initiatives() {
  return <section className="initiatives" aria-labelledby="initiatives-title" data-theme="light">
    <div className="initiatives-inner">
      <div className="initiatives-heading">
        <h2 id="initiatives-title">What we’re building</h2>
        <p>Open tools and knowledge for a more capable future.</p>
      </div>
      <div className="initiatives-grid">
        <article className="initiative">
          <div className="initiative-visual design-visual">
            <MovableCloud/>
          </div>
          <h3>Design</h3>
          <p>Helping more people create thoughtful, accessible experiences.</p>
          <a href={sitePaths.design}>Explore design <span aria-hidden="true">↗</span></a>
        </article>
        <article className="initiative">
          <div className="initiative-visual architecture-visual" role="group" aria-label="Example AI architecture">
            <LayerStack items={architecture}/>
          </div>
          <h3>AI</h3>
          <p>Building open tools that help people accomplish more.</p>
          <a href={sitePaths.computerUse}>Explore computer-use <span aria-hidden="true">↗</span></a>
        </article>
        <article className="initiative">
          <div className="initiative-visual" aria-hidden="true">
            <svg className="initiative-energy" viewBox="0 0 240 110" fill="none">
              <path d="M4 45C50 45 62 15 120 50S190 85 236 30"/>
              <path d="M4 55C50 55 62 25 120 60S190 95 236 40"/>
              <path d="M4 65C50 65 62 35 120 70S190 105 236 50"/>
            </svg>
          </div>
          <h3>Energy</h3>
          <p>Exploring ways to make energy more accessible and sustainable.</p>
          <span className="initiative-status">In development</span>
        </article>
      </div>
    </div>
  </section>;
}

export function Contact() {
  return <section className="contact-section" aria-labelledby="contact-title">
    <div className="contact-content">
      <div className="contact-mark" aria-hidden="true"><span/><span/><span/><span/></div>
      <h2 id="contact-title">Have something in mind?</h2>
      <p>Have an idea, a research question, or a project that could make a difference? We’d love to hear about it.</p>
      <button type="button" disabled>Get in touch <span aria-hidden="true">↗</span></button>
      <small>Contact coming soon</small>
    </div>
  </section>;
}
