import React, { useState, useEffect, useRef } from "react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars } from "@fortawesome/free-solid-svg-icons"

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
    const contentBackground = useColorModeValue(customTheme.contentBackground.color.light, customTheme.contentBackground.color.dark)

    const findEarliestDate = () => {
        let earliestDate = new Date(cardData[0].startDate)

        cardData.forEach((card) => {
            const cardStartDate = new Date(card.startDate)
            cardStartDate < earliestDate ? (earliestDate = cardStartDate) : null
        })
        return earliestDate
    }

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    }

    const dayDiff = (date1: Date, date2: Date): number => {
        const oneDayInMilliseconds = 24 * 60 * 60 * 1000
        const diffInMilliseconds = Math.abs(date2.getTime() - date1.getTime())
        const days = Math.round(diffInMilliseconds / oneDayInMilliseconds)
        return days
    }

    const earliestStartDate = findEarliestDate()
    const sliderMax = dayDiff(earliestStartDate, new Date())
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
        setDateDisplayStartDate(addDays(earliestStartDate, firstValue))
        setDateDisplayEndDate(addDays(earliestStartDate, secondValue))
    }

    // Render slider dates on initial render
    useEffect(() => {
        setDateDisplayStartDate(addDays(earliestStartDate, sliderValues[0]))
        setDateDisplayEndDate(addDays(earliestStartDate, sliderValues[1]))
    }, [])

    const addDays = (date: Date, days: number): Date => {
        const newDate = new Date(date)
        newDate.setDate(newDate.getDate() + days)
        return newDate
    }

    const thumbStartDate = addDays(earliestStartDate, sliderValues[0])
    const thumbEndDate = addDays(earliestStartDate, sliderValues[1])

    const RangeSliderLabel = ({ date, side }) => {
        return (
            <Box width={"110px"} position="relative" left={side == "left" ? "-70px" : "70px"}>
                <Text
                    color="black"
                    align={"center"}
                    fontFamily="monospace"
                    fontWeight="bold"
                    fontSize="sm"
                    width="110px"
                    bg="white"
                    borderRadius="10px"
                    // height="24px"
                    mb={"1px"}
                    display="flex"
                    alignItems="center"
                    justifyContent={"center"}
                >
                    {formatDate(date)}
                </Text>
            </Box>
        )
    }

    return (
        <Box width="100%">
            <Flex direction={"row"} justifyContent={"center"}>
                <Flex direction="row" width="20%" justifyContent={"end"} px={"10px"}></Flex>
                <Flex direction="row" width="79%" bg={contentBackground} borderRadius={"30px"} py={"12px"} px={"150px"}>
                    <RangeSlider value={sliderValues} min={0} max={sliderMax} onChange={handleSliderChange} borderX={"3px solid"}>
                        <RangeSliderTrack borderRadius={0}>
                            <RangeSliderFilledTrack bg="orange" />
                        </RangeSliderTrack>
                        <RangeSliderThumb boxSize={7} index={0}>
                            <RangeSliderLabel date={thumbStartDate} side={"left"} />
                            <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)">
                                <FontAwesomeIcon color={backgroundColor} icon={faBars} />
                            </Box>
                        </RangeSliderThumb>
                        <RangeSliderThumb boxSize={7} index={1}>
                            <RangeSliderLabel date={thumbEndDate} side={"right"} />
                            <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)">
                                <FontAwesomeIcon color={backgroundColor} icon={faBars} />
                            </Box>
                        </RangeSliderThumb>
                    </RangeSlider>
                </Flex>
                <Box></Box>
            </Flex>
        </Box>
    )
}
