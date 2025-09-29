import { Html, Head, Main, NextScript } from "next/document"
import { ColorModeScript } from "@chakra-ui/react"

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" sizes="180x180" href="/Eridian.png" />
                <link rel="apple-touch-icon" href="/Eridian.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/Eridian.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/Eridian.png" />
                <meta name="apple-mobile-web-app-title" content="Eridian.xyz" />
                <meta name="application-name" content="Eridian.xyz" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <meta name="theme-color" content="#131827" media="(prefers-color-scheme: dark)" />
                <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover" />
            </Head>
            <body>
                <ColorModeScript initialColorMode="dark" />
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
