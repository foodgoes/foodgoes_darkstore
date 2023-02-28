import Link from 'next/link'
import styles from '../styles/Sidebar.module.css'

import { useState } from 'react';
import {useRouter} from 'next/router'

import { useTranslation } from '../hooks/useTranslation';

import ChevronLeftSVG from '../public/icons/chevron-left'

export default function Sidebar({categories, slug}) {
    const [link, setLink] = useState();
    
    const { locale } = useRouter();
    const { translate } = useTranslation();

    const toggleLinks = categoryId => {
        if (!categoryId) {
            return setLink(null);
        }

        const category = categories.find(c => c.id === categoryId);
        const links = category?.links ?? [];

        setLink(prev => prev && prev.id === categoryId ? null : {id: categoryId, links});
    };

    const catalog = categories.map((c, i) => (
        <li key={i}>
            <div onClick={() => toggleLinks(c.id)}>{c.title[locale]}</div>
            {link && link.id === c.id && (
                <>
                    {link.links.length > 0 && (
                        <ul className={styles.sublinks}>
                            {link.links.map((l, j) => <li key={j}><Link href={`/category/${l.handle}`}><span>{l.title[locale]}</span></Link></li>)}
                        </ul>
                    )}
                </>
            )}
        </li>
    ));

    const catalogMob = categories.map((c, i) => (
        <li key={i} className={link && styles.hidden}>            
           {!link && <div onClick={() => toggleLinks(c.id)}>{c.title[locale]}</div>}
        </li>
    ));

    return (
        <>
            <div className={styles.sidebar}>
                {!slug && (
                    <>
                        <div><h2>{translate('catalog')}</h2></div>
                        <ul className={styles.links}>{catalog}</ul>
                    </>
                )}

                {slug && (
                    <>
                        {categories.map(c => (
                            <ul className={styles.links1} key={c.id}>
                                {
                                    c.links?.map((l1, i1) => (
                                        <li key={i1}>
                                            <Link href={`/category/${l1.handle}`} className={l1.handle === slug ? ' ' +styles.currentLink : ''}>{l1.title[locale]}</Link>
                                            {l1.handle === slug && (
                                                <ul className={styles.links2}>
                                                    {l1.links?.map((l2, i2) => (
                                                        <li key={i2}><Link href={`/category/${l1.handle}/${l2.handle}`}>{l2.title[locale]}</Link></li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    ))
                                }
                            </ul>
                        ))}
                    </>
                )}
            </div>

            <div className={styles.sidebar + ' ' + styles.sidebarMob}>
                {!slug && (
                    <>
                        <div><h2>{translate('catalog')}</h2></div>
                        <ul className={styles.links}>
                            {link && <li key={'catalog'} onClick={() => toggleLinks()}><div><ChevronLeftSVG /></div></li>}
                            {catalogMob}
                            {link && (
                                <>{link.links.map((l, j) => <li key={j}><Link href={`/category/${l.handle}`}><span>{l.title[locale]}</span></Link></li>)}</>
                            )}
                        </ul>
                        
                    </>
                )}

                {slug && (
                    <>
                        {categories.map(c => (
                            <ul className={styles.links1} key={c.id}>
                                {
                                    c.links?.map((l1, i1) => (
                                        <li key={i1}>
                                            <Link href={`/category/${l1.handle}`} className={l1.handle === slug ? ' ' +styles.currentLink : ''}>{l1.title[locale]}</Link>
                                            {l1.handle === slug && (
                                                <ul className={styles.links2}>
                                                    {l1.links?.map((l2, i2) => (
                                                        <li key={i2}><Link href={`/category/${l1.handle}/${l2.handle}`}>{l2.title[locale]}</Link></li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    ))
                                }
                            </ul>
                        ))}
                    </>
                )}
            </div>
        </>
    )
}