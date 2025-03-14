import type { AppProps } from "next/app"
import { Analytics } from "@vercel/analytics/react"
import { useState, useEffect } from "react"

import "../styles/globals.css"

import { ChakraProvider, ColorModeScript, Spinner, useColorModeValue } from "@chakra-ui/react"
import { extendTheme } from "@chakra-ui/react"

import { config } from "@fortawesome/fontawesome-svg-core"
import "@fortawesome/fontawesome-svg-core/styles.css"

import GoogleAnalytics from "@/components/GoogleAnalytics"

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
            dark: "#1e2743",
        },
        hoverColor: {
            light: "#E2E8F0",
            dark: "#2D3748",
        },
    },
    statusColors: {
        inProgress: {
            light: "#36A2EB",
            dark: "#36A2EB",
        },
        completed: {
            light: "#76b63a",
            dark: "#76b63a",
        },
    },
})

// Set the HTML background color to match the Chakra UI background color
const HtmlBackgroundColor = () => {
    const backgroundColor = useColorModeValue(customTheme.pageBackground.light, customTheme.pageBackground.dark)

    useEffect(() => {
        document.documentElement.style.backgroundColor = backgroundColor
    }, [backgroundColor])

    return null
}

function MyApp({ Component, pageProps }: AppProps) {
    const [isColorModeReady, setIsColorModeReady] = useState(false)
    const currentColorMode = useColorModeValue("light", "dark")

    // Wait until the color mode value is ready before showing the app
    useEffect(() => {
        if (currentColorMode) {
            setIsColorModeReady(true)
        }
    }, [currentColorMode])

    // Show the app once the color mode value is ready
    useEffect(() => {
        if (isColorModeReady) {
            const appElement = document.getElementById("app")
            const placeHolderElement = document.getElementById("placeholder")
            if (appElement) {
                placeHolderElement?.classList.add("hideUntilReady")
                placeHolderElement?.classList.remove("backgroundPlaceholder")
                appElement.classList.remove("hideUntilReady")
            }
        }
    }, [isColorModeReady])

    return (
        <ChakraProvider theme={customTheme}>
            <HtmlBackgroundColor />
            <ColorModeScript initialColorMode="dark" />
            <div id="placeholder" className="backgroundPlaceholder">
                <Spinner />
                <text style={{ fontWeight: "bold" }}>Loading eridian.xyz</text>
            </div>
            <div id="app" className="hideUntilReady">
                <GoogleAnalytics />
                <Component {...pageProps} />
                <Analytics />
            </div>
        </ChakraProvider>
    )
}

export default MyApp
