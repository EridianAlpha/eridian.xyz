import { useState, useEffect } from "react"
import Header from "./Header/Header"
import Overview from "./Overview"
import CardDateSlider from "./Cards/CardDateSlider"
import CardDateDisplay from "./Cards/CardDateDisplay"
import CardGallery from "./Cards/CardGallery"
import cardData from "../../public/data/cardData.json"
import Footer from "../components/Footer"

import { useTheme, useColorModeValue, Container, Box, Flex, Card, Text } from "@chakra-ui/react"

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

    // Store the dateDisplayStartDate and dateDisplayEndDate in state
    const [dateDisplayStartDate, setDateDisplayStartDate] = useState<Date | null>(null)
    const [dateDisplayEndDate, setDateDisplayEndDate] = useState<Date | null>(null)

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

    const [isFilterOngoingSelected, setIsFilterOngoingSelected] = useState(true)
    const [isFilterDoneSelected, setIsFilterDoneSelected] = useState(true)

    const filteredCardData = [...cardData].filter((card) => {
        // If both filters are selected, continue with filter logic
        // If neither filter is selected, continue with filter logic
        if (!(isFilterOngoingSelected && isFilterDoneSelected)) {
            // If the card is ongoing and the ongoing filter is selected, continue with filter logic
            // If the card is done and the done filter is selected, continue with filter logic
            if ((isFilterOngoingSelected && card?.endDate) || (isFilterDoneSelected && !card?.endDate)) {
                return false
            }
        }

        if (dateDisplayStartDate && dateDisplayEndDate) {
            if (card.endDate && card.startDate == card.endDate) {
                // If it's a single day card, remove the card if it's not in the range
                return new Date(card.startDate) >= dateDisplayStartDate && new Date(card.endDate) <= dateDisplayEndDate
            } else if (card?.endDate) {
                // If the start date is before the range and the end date is after the range, remove the card
                const startDateInsideRange = new Date(card.startDate) >= dateDisplayStartDate && new Date(card.startDate) <= dateDisplayEndDate

                //TODO: This is comparing UTC and local time, and I can't get it to just be UTC
                const endDateInsideRange = new Date(card.endDate) >= dateDisplayStartDate && new Date(card.endDate) <= dateDisplayEndDate

                const wasInProgressDuringEntireRange = new Date(card.startDate) < dateDisplayStartDate && new Date(card.endDate) > dateDisplayEndDate
                return startDateInsideRange || endDateInsideRange || wasInProgressDuringEntireRange
            } else {
                // If the start date is after the display end date, remove the card
                return new Date(card.startDate) <= dateDisplayEndDate
            }
        }
        return true
    })

    const sortedCardData = filteredCardData.sort((a, b) => {
        const dateA = new Date(a.startDate)
        const dateB = new Date(b.startDate)
        return dateB.getTime() - dateA.getTime()
    })

    const [selectedCard, setSelectedCard] = useState(null)
    const galleryCardData = () => {
        // If a single item is selected, just pass that, else pass the whole array
        if (selectedCard) {
            return sortedCardData.filter((card) => card.id === selectedCard)
        } else {
            return sortedCardData
        }
    }

    const [shouldRenderDateComponents, setShouldDateRenderComponents] = useState(true)
    useEffect(() => {
        setShouldDateRenderComponents(windowSize.width >= 1100)
    }, [windowSize.width])

    return (
        <Box minH="100vh" minW="100vw" bg={useColorModeValue(customTheme.pageBackground.light, customTheme.pageBackground.dark)}>
            <Container
                maxW="100%"
                bg={useColorModeValue(customTheme.pageBackground.light, customTheme.pageBackground.dark)}
                px={{ base: "16px", xl: "30px" }}
                pb={"100px"}
            >
                {/* {environment === "development" && <VersionDrawer windowSize={windowSize} />} */}
                <Flex direction="column" justifyContent="center" alignItems="center">
                    <Box width="100%" maxW="1400px">
                        <Header
                            windowSize={windowSize}
                            environment={environment}
                            setIsCardEditorOpen={setIsCardEditorOpen}
                            setCardEditorData={setCardEditorData}
                        />
                        <Overview />
                    </Box>
                    {shouldRenderDateComponents ? (
                        <>
                            <Box width="100%" maxW="100%">
                                <CardDateSlider
                                    windowSize={windowSize}
                                    environment={environment}
                                    cardData={cardData}
                                    sortedCardData={sortedCardData}
                                    setDateDisplayStartDate={setDateDisplayStartDate}
                                    setDateDisplayEndDate={setDateDisplayEndDate}
                                    isFilterOngoingSelected={isFilterOngoingSelected}
                                    isFilterDoneSelected={isFilterDoneSelected}
                                    setIsFilterOngoingSelected={setIsFilterOngoingSelected}
                                    setIsFilterDoneSelected={setIsFilterDoneSelected}
                                    setSelectedCard={setSelectedCard}
                                />
                            </Box>
                            <Box width="100%" maxW="100%" mb="40px">
                                <CardDateDisplay
                                    windowSize={windowSize}
                                    environment={environment}
                                    cardData={cardData}
                                    sortedCardData={sortedCardData}
                                    dateDisplayStartDate={dateDisplayStartDate}
                                    dateDisplayEndDate={dateDisplayEndDate}
                                    selectedCard={selectedCard}
                                    setSelectedCard={setSelectedCard}
                                />
                            </Box>
                        </>
                    ) : (
                        <Card mb={10} px={3} pb={3} pt={1} borderRadius={20} textAlign={"center"} fontWeight={"bold"}>
                            <Text fontSize={"2xl"}>🖥️ 👀</Text>
                            View this website on a larger screen to use the timeline slider
                        </Card>
                    )}
                    <Box maxW="100%">
                        <CardGallery
                            windowSize={windowSize}
                            environment={environment}
                            cardData={cardData}
                            sortedCardData={cardData.sort((a, b) => {
                                const dateA = new Date(a.startDate)
                                const dateB = new Date(b.startDate)
                                return dateB.getTime() - dateA.getTime()
                            })}
                            isCardEditorOpen={isCardEditorOpen}
                            setIsCardEditorOpen={setIsCardEditorOpen}
                            cardEditorData={cardEditorData}
                            setCardEditorData={setCardEditorData}
                            selectedCard={selectedCard}
                            setSelectedCard={setSelectedCard}
                        />
                    </Box>
                </Flex>
            </Container>
            <Footer />
        </Box>
    )
}

export default App
