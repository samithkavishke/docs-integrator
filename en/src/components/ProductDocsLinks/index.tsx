import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';

import styles from './styles.module.css';

type ProductLink = {
  href: string;
  title: string;
};

const PRODUCT_LINKS: ProductLink[] = [
  { href: 'https://mi.docs.wso2.com', title: 'WSO2 Integrator: MI' },
  { href: 'https://si.docs.wso2.com/latest/', title: 'WSO2 Integrator: SI' },
];

/**
 * Renders external WSO2 product doc links as plain sidebar-style entries.
 *
 * Used at the bottom of both the homepage drawer (SiteNav) and the docs
 * page sidebar (swizzled DocSidebar/Desktop) so navigation to the related
 * MI and SI doc sites stays one click away regardless of where the user
 * is. Typography matches Docusaurus's `.menu__link` so the links blend
 * in with the rest of the sidebar; a divider above marks the boundary.
 */
export default function ProductDocsLinks({
  onLinkClick,
}: {
  onLinkClick?: () => void;
} = {}): ReactNode {
  return (
    <div className={styles.productLinks}>
      {PRODUCT_LINKS.map(({ href, title }) => (
        <Link
          key={href}
          href={href}
          className={styles.productLink}
          onClick={onLinkClick}>
          <span className={styles.productLinkText}>{title}</span>
          <svg
            className={styles.productLinkIcon}
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </Link>
      ))}
    </div>
  );
}
