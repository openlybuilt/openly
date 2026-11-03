import { useCallback, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Orb, StreamingText } from '@aicss/react';
import { Globe } from './vendor/velora/globe';
import { PixelHeading } from './openly-pixel-heading';
import { Initiatives, Contact } from './openly-initiatives';
import { SocialIcons } from './SocialIcons';
import { DesignMenu } from './DesignMenu';
import { sitePaths } from './site-paths';
import { DropdownMenu } from './vendor/arc/dropdown-menu/dropdown-menu';
import './styles/arc-foundation.css';
import './styles/openly-intro.css';

const message = 'Opening the world, one idea at a time.';
const designPage = document.body.dataset.page === 'design';

function Intro() {
  const [visible, setVisible] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    if (!visible) return;
    const timer = window.setTimeout(() => setLeaving(true), 1100);
    return () => window.clearTimeout(timer);
  }, [visible]);
  useEffect(() => {
    if (!leaving) return;
    const timer = window.setTimeout(() => setVisible(false), 220);
    return () => window.clearTimeout(timer);
  }, [leaving]);
  if (!visible) return null;
  return <div data-theme="light" className={`openly-intro${leaving ? ' leaving' : ''}`}>
    <div className="openly-intro-content"><div aria-hidden="true"><Orb variant="S2" size={36}/></div><div className="openly-intro-text" aria-hidden="true"><StreamingText text={message}/></div><span className="openly-intro-sr" role="status">{message}</span></div>
  </div>;
}

const root = document.getElementById('openly-intro-root');
if (root) {
  createRoot(root).render(<Intro/>);
  const scrollRoot = document.createElement('div');
  root.after(scrollRoot);
  createRoot(scrollRoot).render(<ScrollGlobe/>);
}

function ScrollGlobe() {
  useEffect(() => {
    const story = document.querySelector<HTMLElement>('.globe-story');
    const frame = document.querySelector<HTMLElement>('.story-frame');
    const globe = document.getElementById('openly-globe-root');
    const initiatives = document.getElementById('openly-initiatives-root');
    const contact = document.getElementById('openly-contact-root');
    if (!story || !frame || !globe) return;
    const storyElement = story, frameElement = frame, globeElement = globe;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0;
    const missionTransform = (progress: number) => {
      const width = window.innerWidth;
      const mobile = width <= 700;
      const compact = width <= 1100;
      const x = mobile ? width * .08 : -Math.min(width * (compact ? .18 : .24), compact ? 180 : 350);
      const y = mobile ? -window.innerHeight * .2 : 0;
      const shrink = mobile ? .5 : compact ? .55 : .47;
      return `translate(${progress * x}px, ${progress * y}px) scale(${1 - progress * shrink})`;
    };
    const update = () => {
      raf = 0;
      const first = document.querySelector<HTMLElement>('.hero-copy');
      const second = document.querySelector<HTMLElement>(designPage ? '.scene-copy' : '.mission-copy');
      const examples = document.querySelectorAll<HTMLElement>('[data-scene-example]');
      if (reduced.matches) {
        globeElement.style.removeProperty('opacity');
        globeElement.style.removeProperty('display');
        if (initiatives) { initiatives.style.removeProperty('opacity'); initiatives.style.removeProperty('transform'); initiatives.style.removeProperty('pointer-events'); initiatives.removeAttribute('data-reveal'); initiatives.inert = false; }
        const content = initiatives?.querySelector<HTMLElement>('.initiatives-inner');
        if (content) { content.style.removeProperty('transform'); content.style.removeProperty('opacity'); }
        contact?.querySelector<HTMLElement>('.contact-content')?.style.removeProperty('transform');
        if (contact) { contact.style.removeProperty('opacity'); contact.style.removeProperty('transform'); contact.style.removeProperty('pointer-events'); contact.removeAttribute('data-reveal'); contact.inert = false; }
        if (!designPage) {
          const inMission = (document.getElementById('openly-mission')?.getBoundingClientRect().top ?? Infinity) < window.innerHeight * .5;
          storyElement.style.setProperty('--scene', inMission ? '1' : '0');
          globeElement.style.transform = inMission ? missionTransform(1) : '';
        } else globeElement.style.removeProperty('transform');
        first?.style.removeProperty('opacity'); second?.style.removeProperty('opacity');
        first?.removeAttribute('aria-hidden'); second?.removeAttribute('aria-hidden');
        examples.forEach(item => { item.style.removeProperty('opacity'); item.style.removeProperty('transform'); });
        return;
      }
      const distance = Math.max(1, storyElement.offsetHeight - frameElement.offsetHeight);
      const storyRect = storyElement.getBoundingClientRect();
      const frameHeight = frameElement.offsetHeight;
      const section = initiatives?.querySelector<HTMLElement>('.initiatives');
      const content = initiatives?.querySelector<HTMLElement>('.initiatives-inner');
      const sectionHeight = section?.offsetHeight ?? 0;
      const initiativesHeight = initiatives?.offsetHeight ?? 0;
      const progress = Math.min(1, Math.max(0, -storyRect.top / distance));
      if (designPage) globeElement.style.transform = `scale(${1 - progress * .58})`;
      else {
        const arrival = Math.min(1, progress / .38);
        const departure = Math.min(1, Math.max(0, (progress - .68) / .32));
        const fade = Math.min(1, Math.max(0, (progress - .75) / .17));
        const light = Math.min(1, Math.max(0, (progress - .9) / .1));
        const darkness = Math.min(1, progress / .35) * (1 - light);
        storyElement.style.setProperty('--scene', String(darkness));
        globeElement.style.transform = `${missionTransform(arrival)} scale(${1 + departure * 4})`;
        globeElement.style.opacity = String(1 - fade);
        globeElement.style.display = fade >= 1 ? 'none' : '';
        if (initiatives) {
          const reveal = Math.min(1, Math.max(0, (progress - .91) / .09));
          const remaining = Math.max(0, storyRect.bottom - frameHeight);
          initiatives.style.transform = progress > .9 && remaining > 1 ? `translateY(${-remaining}px)` : '';
          initiatives.style.opacity = String(reveal);
          initiatives.style.pointerEvents = reveal >= .95 ? 'auto' : 'none';
          initiatives.inert = reveal < .95;
          initiatives.dataset.reveal = progress >= .92 ? 'entered' : 'waiting';
          if (section && content && contact) {
            const height = frameHeight;
            const overhang = Math.max(0, sectionHeight - height);
            initiatives.style.setProperty('--initiative-sticky-top', `${-overhang}px`);
            // Use the untransformed layout position so moving the two scenes cannot change their own scroll progress.
            const initiativesTop = storyRect.bottom - height;
            const travel = Math.max(1, initiativesHeight - sectionHeight);
            const exit = Math.min(1, Math.max(0, (-initiativesTop - overhang) / travel));
            content.style.transform = `scale(${1 - exit * .35})`;
            content.style.opacity = String(Math.max(0, 1 - exit / .75));
            initiatives.inert = reveal < .95 || exit >= .75;
            if (exit >= .75) initiatives.style.pointerEvents = 'none';
            const contactReveal = Math.min(1, Math.max(0, (exit - .2) / .8));
            const distanceLeft = Math.max(0, initiativesTop + initiativesHeight - height);
            contact.style.transform = exit > .2 && distanceLeft > 1 ? `translateY(${-distanceLeft}px)` : '';
            contact.style.opacity = String(contactReveal);
            const contactContent = contact.querySelector<HTMLElement>('.contact-content');
            if (contactContent) contactContent.style.transform = `scale(${.65 + contactReveal * .35})`;
            contact.style.pointerEvents = contactReveal >= .95 ? 'auto' : 'none';
            contact.inert = contactReveal < .95;
            contact.dataset.reveal = exit >= .24 ? 'entered' : 'waiting';
          }
        }
      }
      if (first) { const end = designPage ? .3 : .2; first.style.opacity = String(Math.max(0, 1 - progress / end)); first.setAttribute('aria-hidden', String(progress >= end)); }
      if (second) {
        const start = designPage ? .22 : .28;
        const visible = Math.min(1, Math.max(0, (progress - start) / (designPage ? .25 : .14))) * (designPage ? 1 : Math.min(1, Math.max(0, (.78 - progress) / .1)));
        second.style.opacity = String(visible);
        second.setAttribute('aria-hidden', String(visible === 0));
      }
      examples.forEach((item, index) => {
        const start = .2 + index * .018;
        const visible = Math.min(1, Math.max(0, (progress - start) / .24));
        item.style.opacity = String(visible);
        item.style.transform = `translateY(${(1 - visible) * 24}px)`;
      });
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    reduced.addEventListener('change', schedule);
    update();
    return () => { window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); reduced.removeEventListener('change', schedule); cancelAnimationFrame(raf); globe.style.removeProperty('transform'); globe.style.removeProperty('opacity'); globe.style.removeProperty('display'); story.style.removeProperty('--scene'); if (initiatives) { initiatives.style.removeProperty('transform'); initiatives.style.removeProperty('opacity'); initiatives.style.removeProperty('pointer-events'); initiatives.style.removeProperty('--initiative-sticky-top'); initiatives.removeAttribute('data-reveal'); initiatives.inert = false; const content = initiatives.querySelector<HTMLElement>('.initiatives-inner'); content?.style.removeProperty('transform'); content?.style.removeProperty('opacity'); } if (contact) { contact.style.removeProperty('transform'); contact.style.removeProperty('opacity'); contact.style.removeProperty('pointer-events'); contact.removeAttribute('data-reveal'); contact.querySelector<HTMLElement>('.contact-content')?.style.removeProperty('transform'); contact.inert = false; } };
  }, []);
  return null;
}

const globeRoot = document.getElementById('openly-globe-root');
if (globeRoot) createRoot(globeRoot).render(<Globe dotColor="#68645c" radiusScale={0.49} label="Rotating dotted globe. Use arrow keys to rotate." />);

const navigationRoot = document.getElementById('openly-navigation-root');
if (navigationRoot) createRoot(navigationRoot).render(
  <nav className="nav landing-nav" aria-label="Main navigation">
    <a className="landing-logo" href={sitePaths.home} aria-label="Openly home"><img src="/assets/o-ring-white-black-outline-bold.svg" alt=""/></a>
    <div className="landing-links">
    <DropdownMenu openOnHover label="Agents" align="center" triggerClassName="landing-agents-trigger" menuClassName="landing-agents-menu" items={[
      { label: 'Computer-use', onSelect: () => { window.location.href = sitePaths.computerUse; } },
      { label: 'Research', disabled: true },
    ]}/>
    <DesignMenu triggerClassName="landing-design-trigger" menuClassName="landing-design-menu"/>
    <button type="button" className="landing-nav-disabled" disabled>Energy</button>
    </div>
    <SocialIcons className="landing-socials"/>
  </nav>,
);

function HeroCopy() {
  const [showSubtext, setShowSubtext] = useState(false);
  const startGlobeFade = useCallback(() => { document.querySelector('.globe-story')?.classList.add('text-ready'); }, []);
  const showSubtextAfterTitle = useCallback(() => setShowSubtext(true), []);
  return <><PixelHeading text="Good ideas should be open." onRevealed={startGlobeFade} onFinished={showSubtextAfterTitle}/><PixelHeading as="p" text="Openly brings useful technology and knowledge within reach, so more people can build on them." enabled={showSubtext} delay={0}/></>;
}
const headingRoot = document.getElementById('openly-heading-root');
if (headingRoot) createRoot(headingRoot).render(<HeroCopy/>);


const initiativesRoot = document.getElementById('openly-initiatives-root');
if (initiativesRoot) createRoot(initiativesRoot).render(<Initiatives/>);
const contactRoot = document.getElementById('openly-contact-root');
if (contactRoot) createRoot(contactRoot).render(<Contact/>);
