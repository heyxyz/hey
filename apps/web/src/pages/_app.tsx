import Providers from "@components/Common/Providers";
import { heyFont } from "@helpers/fonts";
import { AxiomWebVitals } from "next-axiom";
import type { AppProps } from "next/app";
import { GoogleAnalytics } from "nextjs-google-analytics";
import "../styles.css";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Providers>
      <GoogleAnalytics strategy="afterInteractive" trackPageViews />
      <style global jsx>{`
        body {
          font-family: ${heyFont.style.fontFamily};
        }
      `}</style>
      <AxiomWebVitals />
      <Component {...pageProps} />
    </Providers>
  );
};

export default App;
