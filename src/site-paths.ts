const { protocol, hostname } = window.location;
const local = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]' || hostname.endsWith('.localhost');
const localOrigin = (port: number) => `${protocol}//${hostname}:${port}`;
export const sitePaths = local
  ? { home: `${localOrigin(4175)}/`, design: `${localOrigin(4176)}/`, components: `${localOrigin(4176)}/components`, computerUse: `${localOrigin(4177)}/` }
  : { home: '/', design: '/design/', components: '/design/components', computerUse: '/cua/' };
