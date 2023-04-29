import { useEffect } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { Provider } from 'react-redux';
import { GTM_ID, pageview } from '@/src/common/lib/gtm';
import store from '@/src/store';
import Layout from '@/src/common/components/layout';
import '@/src/styles/globals.css';

function MyApp({ Component, pageProps }) {
  const router = useRouter()

  const getLayout = Component.getLayout || ((page) => page);

  useEffect(() => {
    router.events.on('routeChangeComplete', pageview);
    return () => {
      router.events.off('routeChangeComplete', pageview);
    }
  }, [router.events]);

  return (
    <Provider store={store}>
      <Layout>
        {/* Google Tag Manager - Global base code */}
        <Script
          id="gtag-base"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer', '${GTM_ID}');
            `,
          }}
        />
        {getLayout(<Component {...pageProps} />)}
      </Layout>
    </Provider>
  );
}

export default MyApp
