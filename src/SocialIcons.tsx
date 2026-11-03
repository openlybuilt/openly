import { RiGithubFill, RiTwitterXFill } from '@remixicon/react';
import './styles/social-icons.css';

export function SocialIcons({ className = '' }: { className?: string }) {
  return <div className={`social-icons ${className}`} aria-label="Social profiles">
    <a className="social-icon" href="https://github.com/openlybuilt" target="_blank" rel="noopener noreferrer" aria-label="Openly on GitHub (opens in a new tab)"><RiGithubFill size={19} aria-hidden="true"/></a>
    <a className="social-icon" href="https://x.com/openlybuilt" target="_blank" rel="noopener noreferrer" aria-label="Openly on X (opens in a new tab)"><RiTwitterXFill size={18} aria-hidden="true"/></a>
  </div>;
}
