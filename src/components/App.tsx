import { useState, useEffect } from "react"
import styles from "./App.module.css"
import VersionDrawer from "./VersionDrawer"
import Header from "./Header/Header"
import Overview from "./Overview"

import { Container, Box, Image } from "@chakra-ui/react"
import { relative } from "path"

const App = () => {
    // Check if the current render is on the server (Server Side Render) or client
    const isSSR = typeof window === "undefined"

    // Rerender when window size changes and save
    // window size to state to allow conditional rendering
    const [windowSize, setWindowSize] = useState({
        width: isSSR ? 0 : window.innerWidth,
        height: isSSR ? 0 : window.innerHeight,
    })
    useEffect(() => {
        const handleResizeWindow = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight })
        // subscribe to window resize event "onComponentDidMount"
        window.addEventListener("resize", handleResizeWindow)
        return () => {
            // unsubscribe "onComponentDestroy"
            window.removeEventListener("resize", handleResizeWindow)
        }
    }, [])

    return (
        <Container maxW="1400px">
            <VersionDrawer />
            <Header windowSize={windowSize} />
            <Overview windowSize={windowSize} />
        </Container>
    )
}

export default App
