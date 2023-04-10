import Head from 'next/head'
import Link from 'next/link'
import {useRouter} from 'next/router'

import Sidebar from './sidebar'
import styles from '@/src/styles/Category.module.css'

import ChevronRightSVG from '@/public/icons/chevron-right'
import {useTranslation} from '@/src/common/hooks/useTranslation'

function NestedLayoutCategory({children, categories, slug, slug2}) {
    const {locale} = useRouter();
    const { translate } = useTranslation();

    const getCategoriesBySlug = (slug, slug2, categories) => {
        const links = [];
        categories.forEach(c => {
            if (c.links) {
                c.links.forEach(l1 => {
                    if (l1.handle === slug) {
                        links.push(l1);
                        if (slug2 && l1.links) {
                            l1.links.forEach(l2 => {
                                if (l2.handle === slug2) {
                                    links.push(l2);
                                }
                            });
                        }
                    }
                });
            }
        });

        return links;
    };

    const links = getCategoriesBySlug(slug, slug2, categories);
    
    return (
        <>
            <Head>
                <title>{`${links[links.length-1].title[locale]} — ${translate('metaTitleCategory')}`}</title>
            </Head>
            
            <div className={styles.wrapper}>
                <div className='topBar'>
                    <div className='breadcrumbs'>
                        <Link href="/">{translate('breadcrumbsHome')}</Link>
                        {links.map((l,i) => (
                            <div key={i}>
                                <ChevronRightSVG stroke='#9e9b98' />
                                <Link href={`/category/${l.handle}`}>{l.title[locale]}</Link>
                            </div>
                        ))}
                    </div>
                    <div className='infoBlock'>
                        <div>
                            <h1 className='heading'>
                                {links.length === 1 && links[0].title[locale]}
                                {links.length > 1 &&links[1].title[locale]}
                            </h1>
                        </div>
                    </div>
                </div>
                <Sidebar categories={categories} slug={slug} slug2={slug2} />
                <div className={styles.main}>{children}</div>
            </div>
        </>
    );
}

export default NestedLayoutCategory;