import React from "react"
import { useTheme, Box, Flex, Text, useColorModeValue } from "@chakra-ui/react"

import { formatDisplayDate, parseCardDate } from "@/utils/formatDisplayDate"

export default function CardStatus({ cardData }) {
    const customTheme = useTheme()

    const currentDate = new Date()
    const startDate = parseCardDate(cardData.startDate)
    const endDate = parseCardDate(cardData.endDate)
    const targetDate = endDate ?? currentDate
    const differenceInDays = startDate
        ? Math.ceil((targetDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        : 0

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
                            {formatDisplayDate(cardData.startDate)}
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
                                    {formatDisplayDate(cardData.startDate)}
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
                            {differenceInDays + 1} days
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
                                    {cardData?.endDate ? formatDisplayDate(cardData.endDate) : "Ongoing"}
                                </Text>
                            </Box>
                        </Flex>
                    </Flex>
                </Box>
            )}
        </>
    )
}
