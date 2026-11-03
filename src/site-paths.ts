const { protocol, hostname } = window.location;
const local = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]' || hostname.endsWith('.localhost');
const root = hostname.replace(/^(?:design|cua|www)\./, '');
const localOrigin = (port: number) => `${protocol}//${hostname}:${port}`;
export const sitePaths = local
  ? { home: `${localOrigin(4175)}/`, design: `${localOrigin(4176)}/`, components: `${localOrigin(4176)}/components`, computerUse: `${localOrigin(4177)}/` }
  : { home: `${protocol}//${root}/`, design: `${protocol}//design.${root}/`, components: `${protocol}//design.${root}/components`, computerUse: `${protocol}//cua.${root}/` };
