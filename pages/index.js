import Head from 'next/head';
import Chat from '../components/Chat';

export default function Home() {
  return (
    <>
      <Head>
        <title>مساعد الإسعافات الأولية</title>
        <meta name="description" content="مساعد ذكي للإسعافات الأولية باللغة العربية" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Chat />
      </main>
    </>
  );
}
