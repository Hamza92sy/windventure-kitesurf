import Head from 'next/head';
import Header from '../Header';
import Footer from '../Footer';

export default function Layout({ children, title = 'Windventure - Kitesurf à Dakhla' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="École de kitesurf professionnelle à Dakhla, Maroc. Instructeurs IKO certifiés, conditions parfaites toute l'année." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1">
          {children}
        </main>
        
        <Footer />
      </div>
    </>
  );
}