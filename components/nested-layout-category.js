import Head from 'next/head'
import Link from 'next/link'
import {useRouter} from 'next/router'

import Sidebar from './sidebar'
import styles from '../styles/Category.module.css'

import ChevronRightSVG from '../public/icons/chevron-right'
import {useTranslation} from '../hooks/useTranslation'

function NestedLayoutCategory({children, categories, slug, slug2}) {
    const {locale} = useRouter();
    const { translate } = useTranslation();

    const getCategoriesBySlug = (slug, slug2, categories) => {
        const links = [];
        categories.forEach(c => {
            if (c.links) {
                c.links.forEach(l1 => {
                    if (l1.slug === slug) {
                        links.push(l1);
                        if (slug2 && l1.links) {
                            l1.links.forEach(l2 => {
                                if (l2.slug === slug2) {
                                    links.push(l2);
                                }
                            });
                        }
                    }
                });
            }
        });

        return links;
    }

    const links = getCategoriesBySlug(slug, slug2, categories);
    
    return (
        <>
            <Head>
                <title>FoodGoes - Category</title>
            </Head>
            <div className='topBar'>
                <div className='breadcrumbs'>
                    <Link href="/">{translate('breadcrumbsHome')}</Link>
                    {links.map((l,i) => (
                        <div key={i}>
                            <ChevronRightSVG stroke='#9e9b98' />
                            <Link href={`/category/${l.slug}`}>{l.title[locale]}</Link>
                        </div>
                    ))}
                </div>
                <div className='infoBlock'>
                    <div>
                        <h1 className='heading'>{links.length === 1 ? links[0].title[locale] : links[1].title[locale]}</h1>
                    </div>
                </div>
            </div>
            <div className={styles.wrapper}>
                <Sidebar categories={categories} slug={slug} slug2={slug2} />
                <div className={styles.main}>{children}</div>
            </div>
        </>
    );
}

export default NestedLayoutCategory;