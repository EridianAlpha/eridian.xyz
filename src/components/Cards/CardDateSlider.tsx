import React, { useState, useEffect, useRef } from "react"

import Masonry from "react-masonry-css"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"

import {
    useTheme,
    useColorModeValue,
    Box,
    Flex,
    Text,
    RangeSlider,
    RangeSliderFilledTrack,
    RangeSliderThumb,
    RangeSliderTrack,
} from "@chakra-ui/react"

export default function CardDateSlider({ windowSize, environment, cardData, sortedCardData, setDateDisplayStartDate, setDateDisplayEndDate }) {
    const customTheme = useTheme()
    const backgroundColor = useColorModeValue(customTheme.pageBackground.light, customTheme.pageBackground.dark)
    const linkHoverColor = useColorModeValue(customTheme.contentBackground.hoverColor.light, customTheme.contentBackground.hoverColor.dark)
    const contentBackground = useColorModeValue(customTheme.contentBackground.color.light, customTheme.contentBackground.color.dark)
    const contentBackgroundHover = useColorModeValue(customTheme.contentBackground.hoverColor.light, customTheme.contentBackground.hoverColor.dark)
    const headingColor = useColorModeValue(customTheme.headingText.color.light, customTheme.headingText.color.dark)
    const inProgressTheme = useColorModeValue(customTheme.statusColors.inProgress.light, customTheme.statusColors.inProgress.dark)
    const completedTheme = useColorModeValue(customTheme.statusColors.completed.light, customTheme.statusColors.completed.dark)

    const findEarliestDate = () => {
        let earliestDate = new Date(cardData[0].startDate)

        cardData.forEach((card) => {
            const cardStartDate = new Date(card.startDate)
            cardStartDate < earliestDate ? (earliestDate = cardStartDate) : null
        })

        earliestDate.setDate(1)
        return earliestDate
    }

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    }
    const formatDateMonth = (date: Date) => {
        return date.toLocaleDateString("en-GB", { month: "short", year: "numeric" })
    }

    const monthDiff = (date1: Date, date2: Date): number => {
        const months = (date2.getFullYear() - date1.getFullYear()) * 12 + (date2.getMonth() - date1.getMonth())
        return months
    }

    const earliestStartDate = findEarliestDate()
    const sliderMax = monthDiff(earliestStartDate, new Date())
    const [sliderValues, setSliderValues] = useState([0, sliderMax])

    const handleSliderChange = (newValues) => {
        let [firstValue, secondValue] = newValues

        if (secondValue - firstValue < 1) {
            if (sliderValues[0] === firstValue) {
                secondValue = firstValue + 1
            } else {
                firstValue = secondValue - 1
            }
        }
        setSliderValues([firstValue, secondValue])
        setDateDisplayStartDate(addMonths(earliestStartDate, firstValue))
        setDateDisplayEndDate(addMonths(earliestStartDate, secondValue))
    }

    // Render slider dates on initial render
    useEffect(() => {
        setDateDisplayStartDate(addMonths(earliestStartDate, sliderValues[0]))
        setDateDisplayEndDate(addMonths(earliestStartDate, sliderValues[1]))
    }, [])

    const addMonths = (date: Date, months: number): Date => {
        const newDate = new Date(date)
        newDate.setMonth(newDate.getMonth() + months)
        return newDate
    }
    const thumbStartDate = addMonths(earliestStartDate, sliderValues[0])
    const thumbEndDate = addMonths(earliestStartDate, sliderValues[1])

    return (
        <Box width="100%" bg={contentBackground} borderRadius={"30px"} p={"15px"}>
            <Flex direction={"row"} justifyContent={"center"}>
                <Flex direction="row" width="20%" borderRight="2px solid" justifyContent={"end"} px={"10px"}>
                    {formatDate(earliestStartDate)}
                </Flex>
                <Flex direction="row" width="79%">
                    <RangeSlider value={sliderValues} min={0} max={sliderMax} step={1} onChange={handleSliderChange}>
                        <RangeSliderTrack bg="red.100" borderRadius={0}>
                            <RangeSliderFilledTrack bg="tomato" />
                        </RangeSliderTrack>
                        <RangeSliderThumb boxSize={6} index={0} width={"90px"}>
                            <Text color="blue" align={"center"} fontFamily="monospace" fontWeight="bold" fontSize={"sm"}>
                                {formatDateMonth(thumbStartDate)}
                            </Text>
                        </RangeSliderThumb>
                        <RangeSliderThumb boxSize={6} index={1} width={"90px"}>
                            <Text color="blue" align={"center"} fontFamily="monospace" fontWeight="bold" fontSize={"sm"}>
                                {formatDateMonth(thumbEndDate)}
                            </Text>
                        </RangeSliderThumb>
                    </RangeSlider>
                </Flex>
                <Box borderLeft="2px solid"></Box>
            </Flex>
        </Box>
    )
}
