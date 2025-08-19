import { DrawerProvider } from "@/contexts/DrawerContext";
import "@/styles/global.css";
import { I18nextProvider } from "react-i18next";
import type { AppProps } from "next/app";

import { i18n } from "@/translations/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <I18nextProvider i18n={i18n as any}>
      <QueryClientProvider client={queryClient}>
        <DrawerProvider>
          <Component {...pageProps} />
        </DrawerProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </I18nextProvider>
  );
}
