import { Provider } from 'react-redux';
import store from '@/src/store';
import Layout from '@/src/common/components/layout'
import '@/src/styles/globals.css'

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <Provider store={store}>
      <Layout>
        {getLayout(<Component {...pageProps} />)}
      </Layout>
    </Provider>
  );
}

export default MyApp
