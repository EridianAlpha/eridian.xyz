import React, { useState, useEffect, useRef } from "react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faCalendarDays } from "@fortawesome/free-solid-svg-icons"

import {
    useTheme,
    useColorModeValue,
    Heading,
    Box,
    Flex,
    Text,
    RangeSlider,
    RangeSliderFilledTrack,
    RangeSliderThumb,
    RangeSliderTrack,
    Stack,
    Button,
} from "@chakra-ui/react"

export default function CardDateSlider({
    windowSize,
    environment,
    cardData,
    sortedCardData,
    setDateDisplayStartDate,
    setDateDisplayEndDate,
    isFilterOngoingSelected,
    isFilterDoneSelected,
    setIsFilterOngoingSelected,
    setIsFilterDoneSelected,
    setSelectedCard,
}) {
    const customTheme = useTheme()
    const backgroundColor = useColorModeValue(customTheme.pageBackground.light, customTheme.pageBackground.dark)
    const contentBackground = useColorModeValue(customTheme.contentBackground.color.light, customTheme.contentBackground.color.dark)
    const headingColor = useColorModeValue(customTheme.headingText.color.light, customTheme.headingText.color.dark)
    const inProgressTheme = useColorModeValue(customTheme.statusColors.inProgress.light, customTheme.statusColors.inProgress.dark)
    const completedTheme = useColorModeValue(customTheme.statusColors.completed.light, customTheme.statusColors.completed.dark)

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
    const [sliderValues, setSliderValues] = useState([
        // Show 50% of available range on initial render
        sliderMax - dayDiff(earliestStartDate, new Date()) / 2,
        sliderMax,
    ])

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

    const sliderTrackRef = useRef(null)
    const getThumbPosition = (index) => {
        if (sliderTrackRef.current) {
            const trackWidth = sliderTrackRef.current.clientWidth
            const thumbPosition = (sliderValues[index] / sliderMax) * trackWidth
            return index === 0 ? thumbPosition : trackWidth - thumbPosition
        }
        return 0
    }

    return (
        <Box width="100%">
            <Flex direction={"row"} justifyContent={"center"} alignItems="center">
                <Flex direction="row" width="21%" justifyContent={"end"}>
                    <Heading pr={"12px"} fontSize={"2xl"} display={"flex"} alignItems={"center"} gap={2}>
                        <FontAwesomeIcon icon={faCalendarDays} /> Timeline View
                    </Heading>
                </Flex>
                <Flex direction="row" width="79%" bg={contentBackground} borderRadius={"30px"} py={"12px"} px={"150px"} height={"50px"}>
                    <RangeSlider value={sliderValues} min={0} max={sliderMax} step={1} onChange={handleSliderChange} borderX={"3px solid"}>
                        <RangeSliderTrack ref={sliderTrackRef} borderRadius={0} bg={backgroundColor} height={"10px"}>
                            <RangeSliderFilledTrack />
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
            </Flex>
            {/* TODO: This could be its own component */}
            <Box width="100%" px={"15px"}>
                <Flex direction={"row"} justifyContent={"center"} height={"40px"}>
                    <Flex direction="row" width="20%" justifyContent={"end"}>
                        <Stack direction="row" pr={"25px"}>
                            <Button
                                onClick={() => {
                                    setIsFilterOngoingSelected(true)
                                    setIsFilterDoneSelected(true)
                                    setSelectedCard(null)
                                }}
                                size="sm"
                                borderRadius={"20px"}
                                variant={isFilterOngoingSelected && isFilterDoneSelected ? "solid" : "outline"}
                            >
                                All
                            </Button>
                            <Button
                                onClick={() => {
                                    setIsFilterOngoingSelected(true)
                                    setIsFilterDoneSelected(false)
                                    setSelectedCard(null)
                                }}
                                size="sm"
                                borderRadius={"20px"}
                                color={isFilterDoneSelected ? inProgressTheme : "white"}
                                bg={isFilterOngoingSelected && !isFilterDoneSelected ? inProgressTheme : null}
                                _hover={{ bg: isFilterDoneSelected ? inProgressTheme : null, color: "white" }}
                                variant="outline"
                            >
                                Ongoing
                            </Button>
                            <Button
                                onClick={() => {
                                    setIsFilterOngoingSelected(false)
                                    setIsFilterDoneSelected(true)
                                    setSelectedCard(null)
                                }}
                                size="sm"
                                borderRadius={"20px"}
                                color={isFilterOngoingSelected ? completedTheme : "white"}
                                bg={!isFilterOngoingSelected && isFilterDoneSelected ? completedTheme : null}
                                _hover={{ bg: isFilterOngoingSelected ? completedTheme : null, color: "white" }}
                                variant="outline"
                            >
                                Complete
                            </Button>
                        </Stack>
                    </Flex>
                    <Flex width="79%">
                        <Box width={"30px"} />
                        <Box
                            width={`${125 + getThumbPosition(0)}px`}
                            borderRight={"5px solid"}
                            borderBottom={"5px solid"}
                            borderBottomRightRadius={"30px"}
                            marginBottom="-5px"
                            zIndex={2}
                        />
                        <Flex direction={"row"} justifyContent={"center"} grow={1}>
                            <Box width={"100%"} />
                        </Flex>
                        <Box
                            width={`${105 + getThumbPosition(1)}px`}
                            borderLeft={"5px solid"}
                            borderBottom={"5px solid"}
                            borderBottomLeftRadius={"30px"}
                            marginBottom="-5px"
                            zIndex={2}
                        />
                        <Box width={"27px"} />
                    </Flex>
                </Flex>
            </Box>
            <Box bg={contentBackground} width="100%" px={"15px"} borderTopRadius={"30px"}>
                <Flex direction={"row"} justifyContent={"center"} height={"30px"}>
                    <Flex direction="row" width="20%" justifyContent={"end"} />
                    <Flex width="79%">
                        <Box width={"33px"} borderLeft={"5px solid"} borderTop={"5px solid"} borderTopLeftRadius={"30px"} ml={"-3px"} />
                        <Flex direction={"row"} justifyContent={"center"} grow={1}>
                            <Box width={"100%"} />
                        </Flex>
                        <Box width={"30px"} borderRight={"5px solid"} borderTop={"5px solid"} borderTopRightRadius={"30px"} mr={"-3px"} />
                    </Flex>
                </Flex>
            </Box>
        </Box>
    )
}
