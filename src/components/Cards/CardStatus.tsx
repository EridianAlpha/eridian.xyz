import React, { useState, useEffect, useRef } from "react"
import { useTheme, Box, Circle, Flex, HStack, Spacer, Text, border, useColorModeValue, VStack } from "@chakra-ui/react"

export default function CardStatus({ cardData }) {
    const customTheme = useTheme()

    const currentDate = new Date()
    const startDate = new Date(cardData.startDate)
    const endDate = new Date(cardData.endDate)
    const targetDate = endDate && endDate.getTime() ? endDate : currentDate
    const differenceInDays = Math.ceil((targetDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    }

    const backgroundColor = useColorModeValue(customTheme.pageBackground.light, customTheme.pageBackground.dark)
    const inProgressTheme = useColorModeValue(customTheme.statusColors.inProgress.light, customTheme.statusColors.inProgress.dark)
    const completedTheme = useColorModeValue(customTheme.statusColors.completed.light, customTheme.statusColors.completed.dark)

    return (
        <>
            {cardData?.startDate == cardData?.endDate ? (
                <Box borderRadius="50px" p={3} maxW="150px" bg={backgroundColor} mx="auto">
                    <Box
                        py={1}
                        px={2}
                        border="3px"
                        borderStyle="solid"
                        borderRadius="50px"
                        borderColor={cardData?.endDate ? completedTheme : inProgressTheme}
                    >
                        <Text align={"center"} fontFamily="monospace" fontWeight="bold" fontSize={"sm"}>
                            {formatDate(startDate)}
                        </Text>
                    </Box>
                </Box>
            ) : (
                <Box borderRadius="50px" p={3} position="relative" width="100%" bg={backgroundColor}>
                    <Flex alignItems="center" width="100%" justifyContent={"space-between"}>
                        <Flex alignItems="baseline" flex={1}>
                            <Box
                                py={1}
                                px={2}
                                border="3px"
                                borderStyle="solid"
                                borderRadius="50px"
                                borderColor={cardData?.endDate ? completedTheme : inProgressTheme}
                            >
                                <Text align={"center"} fontFamily="monospace" fontWeight="bold" fontSize={"sm"}>
                                    {formatDate(startDate)}
                                </Text>
                            </Box>
                            <Box
                                flex="1"
                                borderBottom="3px solid"
                                minW={2}
                                mr={2}
                                alignSelf="center"
                                borderColor={cardData?.endDate ? completedTheme : inProgressTheme}
                            />
                        </Flex>
                        <Text
                            align={"center"}
                            fontSize="xl"
                            fontWeight="bold"
                            color={cardData?.endDate ? completedTheme : inProgressTheme}
                            fontFamily="monospace"
                        >
                            {differenceInDays} days
                        </Text>
                        <Flex alignItems="baseline" flex={1}>
                            <Box
                                flex="1"
                                borderBottom="3px"
                                borderStyle={cardData?.endDate ? "solid" : "dashed"}
                                minW={2}
                                borderColor={cardData?.endDate ? completedTheme : inProgressTheme}
                                ml={2}
                                alignSelf="center"
                            />
                            <Box
                                py={1}
                                px={2}
                                border="3px"
                                borderStyle={cardData?.endDate ? "solid" : "dashed"}
                                borderRadius="50px"
                                borderColor={cardData?.endDate ? completedTheme : inProgressTheme}
                            >
                                <Text align={"center"} fontFamily="monospace" fontWeight="bold" fontSize={"sm"}>
                                    {cardData?.endDate ? formatDate(endDate) : "Ongoing"}
                                </Text>
                            </Box>
                        </Flex>
                    </Flex>
                </Box>
            )}
        </>
    )
}
