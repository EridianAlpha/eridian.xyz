import type { AppProps } from "next/app"
import "../styles/globals.css"

import { ChakraProvider } from "@chakra-ui/react"
import { extendTheme } from "@chakra-ui/react"

import { config } from "@fortawesome/fontawesome-svg-core"
import "@fortawesome/fontawesome-svg-core/styles.css"
config.autoAddCss = false

// Custom theme colors
const customTheme = extendTheme({
    pageBackground: {
        light: "white",
        dark: "#131827",
    },
    headingText: {
        color: {
            light: "#171923",
            dark: "#63B3ED",
        },
    },
    contentBackground: {
        color: {
            light: "#EDF2F7",
            dark: "#1B2236",
        },
        hoverColor: {
            light: "#E2E8F0",
            dark: "#2D3748",
        },
    },
})

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ChakraProvider theme={customTheme}>
            <Component {...pageProps} />
        </ChakraProvider>
    )
}

export default MyApp
