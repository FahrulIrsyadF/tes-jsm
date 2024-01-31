import "@/styles/globals.css";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Vending Machine</title>
        <link rel="icon" href="/img/icon-vending.png" type="image/png" />
      </Head>
      <Component {...pageProps} />;
    </>
  );
}
