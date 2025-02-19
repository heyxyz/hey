import Providers from "@components/Common/Providers";
import { heyFont } from "@helpers/fonts";
import { AxiomWebVitals } from "next-axiom";
import type { AppProps } from "next/app";
import "../styles.css";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Providers>
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
