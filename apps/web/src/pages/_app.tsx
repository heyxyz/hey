import Providers from "@components/Common/Providers";
import { heyFont } from "@helpers/fonts";
import { AxiomWebVitals } from "next-axiom";
import type { AppProps } from "next/app";
import "../styles.css";
import { useEffect } from "react";

const App = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch("/api/csrf-token");
        const data = await response.json();
        localStorage.setItem("csrfToken", data.csrfToken);
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
      }
    };

    fetchCsrfToken();
  }, []);

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
