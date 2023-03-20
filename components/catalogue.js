import {useState, useRef, useEffect} from 'react'
import Link from 'next/link';
import {useRouter} from 'next/router'

import MenuHamburgerSVG from "@/public/icons/menu-hamburger";
import Button from "./elements/button";

import styles from "@/styles/Catalogue.module.css";
import { useTranslation } from '@/hooks/useTranslation';

export default function Catalogue() {
    const [catalogueMenu, setCatalogueMenu] = useState(false);
    const [catalogue, setCatalogue] = useState([]);
    const [link, setLink] = useState();
    const { locale } = useRouter();
    const btnRef = useRef(null);
    const btnRef2 = useRef(null);
    const { translate } = useTranslation();
    
    useEffect(() => {
        const closeDropDown = e => {
          if ((!e.composedPath().includes(btnRef.current) && !e.composedPath().includes(btnRef2.current))) {
            setCatalogueMenu(false);
            toggleLinks();
          }
        };
    
        document.body.addEventListener('click', closeDropDown);
    
        return () => document.body.removeEventListener('click', closeDropDown);
    }, []);

      useEffect(() => {
        async function getCategories() {
            const categories = await getCategoriesAPI();
            setCatalogue(categories);
        }
        getCategories();
      }, []);

      const getCategoriesAPI = async () => {
        const res = await fetch(`/api/front/categories`);
        return await res.json();
      };

      const toggleLinks = categoryId => {
        if (!categoryId) {
            return setLink(null);
        }

        const category = catalogue.find(c => c.id === categoryId);
        const links = category?.links ?? [];

        setLink(prev => prev && prev.id === categoryId ? null : {id: categoryId, links});
    };

      const catalog = catalogue.filter(c => !c.hidden).map((c, i) => (
        <li key={i}>
            <div onClick={() => toggleLinks(c.id)} className={styles.baseLink}>
                <div className={styles.baseLinkImg}>{c.image && <img src={c.image} />}</div>
                <div className={styles.baseLinkTitle}>{c.title[locale]}</div>
            </div>
            {link && link.id === c.id && (
                <>
                    {link.links.length > 0 && (
                        <ul className={styles.sublinks}>
                            {link.links.map((l, j) => <li key={j}><Link href={`/category/${l.handle}`} onClick={() => {setCatalogueMenu(false); toggleLinks()}}><span>{l.title[locale]}</span></Link></li>)}
                        </ul>
                    )}
                </>
            )}
        </li>
    ));

    return (
        <div className={styles.catalogue}>
            <div ref={btnRef} className={styles.menuHamburger}>
                <Button onClick={() => setCatalogueMenu(prev => !prev)}><MenuHamburgerSVG /></Button>
            </div>
            {catalogueMenu && (
                <div ref={btnRef2} className={styles.catalogueMenu}>
                    <div><h2 className={styles.catalogueTitle}>{translate('catalog')}</h2></div>
                    <ul className={styles.links}>{catalog}</ul>
                </div>
              )}
        </div>
    );
}