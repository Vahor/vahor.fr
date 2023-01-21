import { type AppType } from "next/dist/shared/lib/utils";
import { ThemeProvider } from "next-themes";

import "../styles/globals.css";
import { Progress } from "@/components/Progress";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (

    <ThemeProvider attribute="class" defaultTheme="system">

      <Progress />
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </ThemeProvider>
  );
};

export default MyApp;
