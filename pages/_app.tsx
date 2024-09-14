import "@/styles/globals.css";
import { Quicksand } from "next/font/google";
// import { Quicksand } from "@next/font/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import {QueryClientProvider, QueryClient} from '@tanstack/react-query'
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { AppProps } from "next/app";
import  { Toaster } from 'react-hot-toast';

// const inter = Inter({ subsets: ["latin"] });
const quicksand = Quicksand({ subsets: ["latin"] });

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={quicksand.className}>
      <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId="538941520225-kcg4jq0bhn7oo5pl9cmsup7mbog8ijsl.apps.googleusercontent.com">
          <Component {...pageProps} />
          <Toaster />
          <ReactQueryDevtools />
        </GoogleOAuthProvider>
      </QueryClientProvider>
    </div>
  );
}
