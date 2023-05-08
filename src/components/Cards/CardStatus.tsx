import React, { useState, useEffect, useRef } from "react"

import { useTheme, Box, Circle, Flex, HStack, Spacer, Text, border, useColorModeValue, VStack } from "@chakra-ui/react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCirclePlay, faCircleCheck } from "@fortawesome/free-solid-svg-icons"

export default function CardStatus({ cardData }) {
    // If start date and end date are both the same, us a TimeStamp format

    const customTheme = useTheme()

    const backgroundColor = useColorModeValue(customTheme.pageBackground.light, customTheme.pageBackground.dark)
    const inProgressTheme = useColorModeValue(customTheme.headingText.color.light, customTheme.headingText.color.dark)
    const completedTheme = useColorModeValue("green", "green")

    let isCompleted = false

    if (!cardData?.startDate) {
        return
    } else if (cardData?.startDate && cardData?.endDate) {
        isCompleted = true
    }

    return (
        <>
            <Box borderRadius="50px" p={3} position="relative" width="100%" bg={backgroundColor}>
                <Flex alignItems="center" width="100%" justifyContent={"space-between"}>
                    <Flex alignItems="baseline" flex={1}>
                        <Box
                            py={1}
                            px={2}
                            border="3px"
                            borderStyle="solid"
                            borderRadius="50px"
                            borderColor={isCompleted ? completedTheme : inProgressTheme}
                        >
                            <Text color={isCompleted ? completedTheme : inProgressTheme} align={"center"}>
                                31 Mar 2023
                            </Text>
                        </Box>
                        <Box
                            flex="1"
                            borderBottom="3px solid"
                            minW={2}
                            mr={2}
                            alignSelf="center"
                            borderColor={isCompleted ? completedTheme : inProgressTheme}
                        />
                    </Flex>
                    <Text align={"center"} fontSize="xl" fontWeight="bold" color={isCompleted ? completedTheme : inProgressTheme}>
                        150 days
                    </Text>
                    <Flex alignItems="baseline" flex={1}>
                        <Box
                            flex="1"
                            borderBottom="3px"
                            borderStyle={isCompleted ? "solid" : "dashed"}
                            minW={2}
                            borderColor={isCompleted ? completedTheme : inProgressTheme}
                            ml={2}
                            alignSelf="center"
                        />
                        <Box
                            py={1}
                            px={2}
                            border="3px"
                            borderStyle={isCompleted ? "solid" : "dashed"}
                            borderRadius="50px"
                            borderColor={isCompleted ? completedTheme : inProgressTheme}
                        >
                            <Text color={isCompleted ? completedTheme : inProgressTheme} align={"center"}>
                                {isCompleted ? cardData?.endDate : "In Progress"}
                            </Text>
                        </Box>
                    </Flex>
                </Flex>
            </Box>
        </>
    )
}
