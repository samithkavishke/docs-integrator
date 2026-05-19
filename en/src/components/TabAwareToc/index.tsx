import { useEffect } from 'react';

/**
 * Hides TOC entries for headings that live inside inactive tab panels,
 * and restores them when their tab becomes active.
 *
 * Drop <TabAwareToc /> anywhere in an MDX page that uses <Tabs>.
 */
export default function TabAwareToc(): null {
    useEffect(() => {
        function updateToc() {
            const tabPanels = document.querySelectorAll<HTMLElement>('[role="tabpanel"]');

            tabPanels.forEach((panel) => {
                const isHidden = panel.hidden;
                const headings = panel.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6');

                headings.forEach((heading) => {
                    const id = heading.id;
                    if (!id) return;

                    const tocLink = document.querySelector<HTMLAnchorElement>(
                        `.table-of-contents a[href="#${id}"]`
                    );
                    if (!tocLink) return;

                    const tocItem = tocLink.closest<HTMLElement>('li');
                    if (tocItem) {
                        tocItem.style.display = isHidden ? 'none' : '';
                    }
                });
            });
        }

        updateToc();

        const scheduleUpdate = () => setTimeout(updateToc, 50);

        const tabLists = document.querySelectorAll('[role="tablist"]');
        tabLists.forEach((tabList) => {
            tabList.addEventListener('click', scheduleUpdate);
            tabList.addEventListener('keydown', scheduleUpdate);
        });

        return () => {
            tabLists.forEach((tabList) => {
                tabList.removeEventListener('click', scheduleUpdate);
                tabList.removeEventListener('keydown', scheduleUpdate);
            });
        };
    }, []);

    return null;
}
