import React, { useState, useEffect, useRef } from "react"

import { useTheme, useColorModeValue, Box, Image, Flex, Text } from "@chakra-ui/react"

export default function CardDateDisplay({
    windowSize,
    environment,
    cardData,
    sortedCardData,
    dateDisplayStartDate,
    dateDisplayEndDate,
    selectedCard,
    setSelectedCard,
}) {
    const customTheme = useTheme()
    const backgroundColor = useColorModeValue(customTheme.pageBackground.light, customTheme.pageBackground.dark)
    const contentBackground = useColorModeValue(customTheme.contentBackground.color.light, customTheme.contentBackground.color.dark)
    const inProgressTheme = useColorModeValue(customTheme.statusColors.inProgress.light, customTheme.statusColors.inProgress.dark)
    const completedTheme = useColorModeValue(customTheme.statusColors.completed.light, customTheme.statusColors.completed.dark)

    const displayRef = useRef(null)
    const [displayWidth, setDisplayWidth] = useState(0)

    useEffect(() => {
        if (displayRef.current) {
            const width = displayRef.current.offsetWidth
            setDisplayWidth(width)
        }
    }, [windowSize.width])

    function getTimeDifference(startDate, endDate) {
        return endDate?.getTime() - startDate?.getTime()
    }

    function getDaysDifference(startDate, endDate) {
        const timeDifference = getTimeDifference(startDate, endDate)
        return Math.ceil(timeDifference / (24 * 60 * 60 * 1000))
    }

    const displayDays = getDaysDifference(dateDisplayStartDate, dateDisplayEndDate)
    const pixelsPerDay = displayWidth / displayDays

    const getBarWidth = (cardStartDate, cardEndDate, displayStartDate, displayEndDate) => {
        let width = pixelsPerDay

        if (cardEndDate == "Invalid Date") {
            // If the card has no end date, it's ongoing and should take up the space until the end of the display
            width = pixelsPerDay * getDaysDifference(cardStartDate, displayEndDate)
        } else if (cardStartDate >= displayStartDate && cardEndDate <= displayEndDate) {
            // If the card has an end date, and all both the card start and end dates are within the display, show it normally
            width = pixelsPerDay * getDaysDifference(cardStartDate, cardEndDate)
        } else if (cardStartDate < displayStartDate && cardEndDate > displayEndDate) {
            // If the card has an end date, but the start and end are both outside the display, show it covering the whole display
            width = pixelsPerDay * getDaysDifference(displayStartDate, displayEndDate)
        } else if (cardStartDate < displayStartDate && cardEndDate > displayStartDate) {
            // If the card has an end date, but the start date is before the display start date, show it from the display start date
            width = pixelsPerDay * getDaysDifference(displayStartDate, cardEndDate)
        } else if (cardEndDate >= displayEndDate && cardStartDate < displayEndDate) {
            // If the card has an end date, but the end date is after the display end date, show it from the display end date
            width = pixelsPerDay * getDaysDifference(cardStartDate, displayEndDate)
        }
        return `${width}px`
    }

    const getSpacerWidth = (displayStartDate, cardStartDate) => {
        const width = pixelsPerDay * getDaysDifference(displayStartDate, cardStartDate)
        return `${width}px`
    }

    const shouldShowCircle = (startDate, endDate) => {
        const width = pixelsPerDay * getDaysDifference(startDate, endDate)
        return width < 20
    }

    const getBackground = (index) => {
        return index % 2 === 0 ? backgroundColor : null
    }

    const [isScrollable, setIsScrollable] = useState(false)
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(false)
    const scrollBoxRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setIsScrollable(scrollBoxRef.current?.scrollHeight > scrollBoxRef.current?.clientHeight)
    }, [sortedCardData])

    const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = scrollBoxRef.current
        const atBottom = scrollHeight - scrollTop === clientHeight
        setIsScrolledToBottom(atBottom)
    }

    useEffect(() => {
        setIsScrollable(scrollBoxRef.current?.scrollHeight > scrollBoxRef.current?.clientHeight)
    }, [sortedCardData])

    const handleBottomScrollClick = () => {
        if (scrollBoxRef.current) {
            scrollBoxRef.current.scrollTop += 100
        }
    }

    const handleRangeClick = (cardId) => {
        if (selectedCard == cardId) {
            setSelectedCard(null)
        } else {
            setSelectedCard(cardId)
        }
    }

    const clearSelectedCard = () => {
        setSelectedCard(null)
    }

    return (
        <Box
            width="100%"
            bg={contentBackground}
            borderBottomRadius={"30px"}
            px={"15px"}
            onClick={() => {
                clearSelectedCard()
            }}
        >
            {/* TODO: Set maxH="60vh" on Box to enable scroll */}
            <Box ref={scrollBoxRef} onScroll={handleScroll} overflow={"auto"}>
                {sortedCardData.map((card, cardIndex) => (
                    <Flex key={cardIndex} direction={"row"} justifyContent={"center"}>
                        <Flex direction="row" width="20%">
                            <Image
                                bg={"#102026"}
                                objectFit="contain"
                                width="26px"
                                height="26px"
                                src={card?.images?.[0].image ? card?.images?.[0].image : "./481368551588.png"}
                                alt={card?.images?.[0].alt}
                                borderLeftRadius={"8px"}
                            />
                            <Text
                                px={"15px"}
                                py={"1px"}
                                bg={getBackground(cardIndex)}
                                fontWeight={"bold"}
                                width="100%"
                                overflow="hidden"
                                whiteSpace="nowrap"
                                textOverflow="ellipsis"
                                textColor={card?.endDate ? completedTheme : inProgressTheme}
                            >
                                {card.name}
                            </Text>
                        </Flex>
                        <Flex ref={displayRef} bg={getBackground(cardIndex)} direction="row" width="79%" borderLeft="5px solid">
                            <Flex width={getSpacerWidth(dateDisplayStartDate, new Date(card.startDate))}></Flex>
                            {card?.endDate && shouldShowCircle(new Date(card.startDate), new Date(card.endDate)) ? (
                                <Box
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleRangeClick(card.id)
                                    }}
                                    cursor="pointer"
                                    borderRadius={"100%"}
                                    my={"2px"}
                                    bg={completedTheme}
                                    // TODO: Fade out other colors when not selected
                                    // bg={selectedCard && selectedCard != card.id ? "blue" : completedTheme}
                                    width="20px"
                                />
                            ) : (
                                <Box
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleRangeClick(card.id)
                                    }}
                                    cursor="pointer"
                                    borderRightRadius={!card?.endDate || new Date(card?.endDate) > dateDisplayEndDate ? "0px" : "20px"}
                                    borderLeftRadius={
                                        new Date(new Date(card?.startDate).setDate(new Date(card?.startDate).getDate() + 1)) <= dateDisplayStartDate
                                            ? "0px"
                                            : "20px"
                                    }
                                    my={"2px"}
                                    bg={card?.endDate ? completedTheme : inProgressTheme}
                                    width={getBarWidth(new Date(card.startDate), new Date(card?.endDate), dateDisplayStartDate, dateDisplayEndDate)}
                                />
                            )}
                            <Flex grow={1} />
                        </Flex>
                        <Box borderLeft="5px solid"></Box>
                    </Flex>
                ))}
            </Box>
            <Flex
                direction={"row"}
                justifyContent={"center"}
                height={"30px"}
                onClick={handleBottomScrollClick}
                transition={"background-color 0.2s ease-in-out"}
                bg={isScrollable ? (isScrolledToBottom ? "null" : "rgba(255, 255, 255, 0.2)") : contentBackground}
                cursor={isScrollable && !isScrolledToBottom ? "pointer" : "null"}
                borderBottomRadius={"30px"}
                borderTopRadius={"10px"}
            >
                <Flex direction="row" width="20%"></Flex>
                <Flex
                    ref={displayRef}
                    bg={getBackground(1)}
                    direction="row"
                    width="calc(79% + 5px)"
                    borderRight="5px solid"
                    borderLeft="5px solid"
                    borderBottom="5px solid"
                    borderBottomRadius={"30px"}
                >
                    <Flex grow={1} />
                </Flex>
            </Flex>
        </Box>
    )
}
