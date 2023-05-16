import React, { useState, useEffect, useRef } from "react"

import Masonry from "react-masonry-css"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"

import {
    useTheme,
    useColorModeValue,
    Card,
    Box,
    Heading,
    CardBody,
    Image,
    Flex,
    Stack,
    HStack,
    Text,
    Collapse,
    IconButton,
    Button,
    Container,
} from "@chakra-ui/react"

export default function CardDateDisplay({ windowSize, environment, cardData, sortedCardData }) {
    const breakpointCols = {
        default: 3,
        1400: 2,
        900: 1,
    }

    const customTheme = useTheme()
    const backgroundColor = useColorModeValue(customTheme.pageBackground.light, customTheme.pageBackground.dark)
    const linkHoverColor = useColorModeValue(customTheme.contentBackground.hoverColor.light, customTheme.contentBackground.hoverColor.dark)
    const contentBackground = useColorModeValue(customTheme.contentBackground.color.light, customTheme.contentBackground.color.dark)
    const contentBackgroundHover = useColorModeValue(customTheme.contentBackground.hoverColor.light, customTheme.contentBackground.hoverColor.dark)
    const headingColor = useColorModeValue(customTheme.headingText.color.light, customTheme.headingText.color.dark)
    const inProgressTheme = useColorModeValue(customTheme.statusColors.inProgress.light, customTheme.statusColors.inProgress.dark)
    const completedTheme = useColorModeValue(customTheme.statusColors.completed.light, customTheme.statusColors.completed.dark)

    // TODO: These dates will be given from the filtering options in the filter bar
    // but are just hardcoded for now
    const displayStartDate = new Date("2022-07-01")
    const displayEndDate = new Date("2023-06-01")

    const displayRef = useRef(null)
    const [displayWidth, setDisplayWidth] = useState(0)

    useEffect(() => {
        if (displayRef.current) {
            const width = displayRef.current.offsetWidth
            setDisplayWidth(width)
        }
    }, [windowSize.width])

    function getTimeDifference(startDate, endDate) {
        return endDate.getTime() - startDate.getTime()
    }

    function getDaysDifference(startDate, endDate) {
        const timeDifference = getTimeDifference(startDate, endDate)
        return Math.ceil(timeDifference / (24 * 60 * 60 * 1000))
    }

    const displayDays = getDaysDifference(displayStartDate, displayEndDate)
    const pixelsPerDay = displayWidth / displayDays

    const getBarWidth = (startDate, endDate) => {
        const width = pixelsPerDay * getDaysDifference(startDate, endDate)
        return `${width}px`
    }

    const shouldShowCircle = (startDate, endDate) => {
        const width = pixelsPerDay * getDaysDifference(startDate, endDate)
        return width < 50
    }

    const getBackground = (index) => {
        return index % 2 === 0 ? contentBackground : null
    }

    return (
        <Box width="100%">
            {sortedCardData.map((card, cardIndex) => (
                <Flex key={cardIndex} direction={"row"} justifyContent={"center"}>
                    <Text
                        bg={getBackground(cardIndex)}
                        borderRight="2px solid"
                        width="20%"
                        overflow="hidden"
                        whiteSpace="nowrap"
                        textOverflow="ellipsis"
                    >
                        {card.name}
                    </Text>
                    <Flex ref={displayRef} bg={getBackground(cardIndex)} direction="row" width="79%">
                        <Flex width={getBarWidth(displayStartDate, new Date(card.startDate))}></Flex>
                        {card?.endDate && shouldShowCircle(new Date(card.startDate), new Date(card.endDate)) ? (
                            <Box borderRadius={"100%"} my={"2px"} bg={completedTheme} width="20px" />
                        ) : (
                            <Box
                                borderLeftRadius={"20px"}
                                borderRightRadius={!card?.endDate || new Date(card?.endDate) > displayEndDate ? "0px" : "20px"}
                                my={"2px"}
                                bg={card?.endDate ? completedTheme : inProgressTheme}
                                width={
                                    card?.endDate
                                        ? getBarWidth(new Date(card.startDate), new Date(card.endDate))
                                        : getBarWidth(new Date(card.startDate), displayEndDate)
                                }
                            />
                        )}
                        <Flex grow={1} />
                    </Flex>
                    <Box borderLeft="2px solid"></Box>
                </Flex>
            ))}
        </Box>
    )
}
