import type { AppProps } from "next/app"
import "../styles/globals.css"

import { ChakraProvider } from "@chakra-ui/react"
import { extendTheme } from "@chakra-ui/react"

import { config } from "@fortawesome/fontawesome-svg-core"
import "@fortawesome/fontawesome-svg-core/styles.css"
config.autoAddCss = false

// Custom theme colors
const theme = extendTheme({
    colors: {
        gray: {
            800: "#0b0f1d",
            900: "#0b0f1d",
        },
    },
})

function MyApp({ Component, pageProps }: AppProps) {
    const isSSR = typeof window === "undefined"

    return (
        <ChakraProvider theme={theme}>
            <Component {...pageProps} />
        </ChakraProvider>
    )
}

export default MyApp
