import '../styles/globals.css';
import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/next';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);

  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}

export default MyApp;
