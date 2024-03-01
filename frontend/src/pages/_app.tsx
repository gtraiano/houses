import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { reducer, StateProvider } from "@/state";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<StateProvider reducer={reducer}>
			<Component {...pageProps}/>
		</StateProvider>
	)
}
