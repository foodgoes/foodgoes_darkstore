import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '@/styles/Banners.module.css';

export default function Banners() {
    const [banners, setBanners] = useState([]);
    const { locale } = useRouter();

    useEffect(() => {
        const getBanners = async () => {
            const res = await fetch('/api/front/banners', {headers: {'Content-Type': 'application/json',}});
            const banners = await res.json();
            setBanners(banners);
        };

        getBanners();
    }, []);
    
    return (
        <div className={styles.banners}>
            {banners.map(banner => (
                <Link key={banner.id} href={banner.url} className={styles.banner}>
                    <div className={styles.bannerImg} style={{backgroundImage: `url("${banner.image}")`}}>
                        <h3 className={styles.bannerTitle}>{banner.title[locale]}</h3>
                    </div>
                </Link>
            ))}
        </div>
    );
}