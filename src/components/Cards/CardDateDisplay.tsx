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

export default function CardDateDisplay({ windowSize, environment, cardData, sortedCardData, dateDisplayStartDate, dateDisplayEndDate }) {
    const customTheme = useTheme()
    const backgroundColor = useColorModeValue(customTheme.pageBackground.light, customTheme.pageBackground.dark)
    const linkHoverColor = useColorModeValue(customTheme.contentBackground.hoverColor.light, customTheme.contentBackground.hoverColor.dark)
    const contentBackground = useColorModeValue(customTheme.contentBackground.color.light, customTheme.contentBackground.color.dark)
    const contentBackgroundHover = useColorModeValue(customTheme.contentBackground.hoverColor.light, customTheme.contentBackground.hoverColor.dark)
    const headingColor = useColorModeValue(customTheme.headingText.color.light, customTheme.headingText.color.dark)
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

    const getBarWidth = (startDate, endDate) => {
        const width = pixelsPerDay * getDaysDifference(startDate, endDate)
        return `${width}px`
    }

    const shouldShowCircle = (startDate, endDate) => {
        const width = pixelsPerDay * getDaysDifference(startDate, endDate)
        return width < 20
    }

    const getBackground = (index) => {
        return index % 2 === 0 ? backgroundColor : null
    }

    return (
        <Box width="100%" bg={contentBackground} borderRadius={"30px"} p={"15px"}>
            {sortedCardData.map((card, cardIndex) => (
                <Flex key={cardIndex} direction={"row"} justifyContent={"center"}>
                    <Flex direction="row" width="20%" borderRight="2px solid">
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
                    <Flex ref={displayRef} bg={getBackground(cardIndex)} direction="row" width="79%">
                        <Flex width={getBarWidth(dateDisplayStartDate, new Date(card.startDate))}></Flex>
                        {card?.endDate && shouldShowCircle(new Date(card.startDate), new Date(card.endDate)) ? (
                            <Box borderRadius={"100%"} my={"2px"} bg={completedTheme} width="20px" />
                        ) : (
                            <Box
                                borderRightRadius={!card?.endDate || new Date(card?.endDate) > dateDisplayEndDate ? "0px" : "20px"}
                                borderLeftRadius={new Date(card?.startDate) < dateDisplayStartDate ? "0px" : "20px"}
                                my={"2px"}
                                bg={card?.endDate ? completedTheme : inProgressTheme}
                                width={
                                    card?.endDate
                                        ? getBarWidth(new Date(card.startDate), new Date(card.endDate))
                                        : getBarWidth(new Date(card.startDate), dateDisplayEndDate)
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
