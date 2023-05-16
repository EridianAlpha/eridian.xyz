import { useState, useEffect } from "react"
import styles from "./App.module.css"
import VersionDrawer from "./VersionDrawer"
import Header from "./Header/Header"
import Overview from "./Overview"
import CardDateDisplay from "./Cards/CardDateDisplay"
import ProjectGallery from "./Cards/CardGallery"
import cardData from "../../public/data/cardData.json"

import { useTheme, useColorModeValue, Container, Box, Flex } from "@chakra-ui/react"

const App = () => {
    const environment = process.env.NODE_ENV

    // Import custom color theme
    const customTheme = useTheme()

    // Check if the current render is on the server (Server Side Render) or client
    const isSSR = typeof window === "undefined"

    // Allow card editor to be opened and closed from the header
    // TODO: Is this something that Redux could handle?
    const [isCardEditorOpen, setIsCardEditorOpen] = useState(false)
    const [cardEditorData, setCardEditorData] = useState(null)

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
        window.addEventListener("load", handleResizeWindow)
        return () => {
            // unsubscribe "onComponentDestroy"
            window.removeEventListener("resize", handleResizeWindow)
            window.removeEventListener("load", handleResizeWindow)
        }
    }, [])

    const sortedCardData = [...cardData].sort((a, b) => {
        const dateA = new Date(a.startDate)
        const dateB = new Date(b.startDate)
        return dateB.getTime() - dateA.getTime()
    })

    return (
        <Box minH="100vh" minW="100vw" bg={useColorModeValue(customTheme.pageBackground.light, customTheme.pageBackground.dark)}>
            <Container
                maxW="100%"
                bg={useColorModeValue(customTheme.pageBackground.light, customTheme.pageBackground.dark)}
                px={{ base: "16px", xl: "60px" }}
                pb={"1000px"}
            >
                {environment === "development" && <VersionDrawer windowSize={windowSize} />}
                <Flex direction="column" justifyContent="center" alignItems="center">
                    <Box width="100%" maxW="1400px">
                        <Header
                            windowSize={windowSize}
                            environment={environment}
                            setIsCardEditorOpen={setIsCardEditorOpen}
                            setCardEditorData={setCardEditorData}
                        />
                        <Overview windowSize={windowSize} environment={environment} />
                    </Box>
                    <Box width="100%" maxW="1400px" my="40px">
                        <CardDateDisplay windowSize={windowSize} environment={environment} cardData={cardData} sortedCardData={sortedCardData} />
                    </Box>
                    <Box maxW="100%">
                        <ProjectGallery
                            windowSize={windowSize}
                            environment={environment}
                            cardData={cardData}
                            sortedCardData={sortedCardData}
                            isCardEditorOpen={isCardEditorOpen}
                            setIsCardEditorOpen={setIsCardEditorOpen}
                            cardEditorData={cardEditorData}
                            setCardEditorData={setCardEditorData}
                        />
                    </Box>
                </Flex>
            </Container>
        </Box>
    )
}

export default App
