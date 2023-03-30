import { DrawerProvider } from "@/contexts/DrawerContext";
import "@/styles/global.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <DrawerProvider>
      <Component {...pageProps} />
    </DrawerProvider>
  );
}
