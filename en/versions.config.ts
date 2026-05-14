export type DocsVersion = {
  label: string;
  path: string;
};

export const versions: DocsVersion[] = [
  { label: 'Next', path: '/en/next/' },
  { label: '5.0.0 (latest)', path: '/en/latest/' },
];

export const activeVersion: string = process.env.DOCS_VERSION || 'next';
