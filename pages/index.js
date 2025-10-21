import Head from 'next/head';
import Chat from '../components/Chat';
import styles from '../styles/globals.css';

export default function Home() {
  return (
    <div>
      <Head>
        <title>First Aid Chatbot</title>
        <meta name="description" content="AI-powered first aid assistant" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>First Aid Chatbot</h1>
        <p>Get immediate first aid guidance for common emergencies</p>
        <Chat />
      </main>
    </div>
  );
}
