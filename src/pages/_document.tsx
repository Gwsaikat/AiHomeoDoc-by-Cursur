import { Html, Head, Main, NextScript } from 'next/document';
import { getCspHeaders } from '../utils/csp';

export default function Document() {
  const cspContent = getCspHeaders();

  return (
    <Html lang="en">
      <Head>
        <meta httpEquiv="Content-Security-Policy" content={cspContent} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
} 