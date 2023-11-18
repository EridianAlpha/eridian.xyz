import cardDataTemplate from "../../../public/data/cardDataTemplate.json"

import { useTheme, useBreakpointValue, Box, Flex, HStack, IconButton, useColorModeValue, Image, Button, Text } from "@chakra-ui/react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGithub, faTelegram, faTwitter } from "@fortawesome/free-brands-svg-icons"
import { faBook, faCirclePlus } from "@fortawesome/free-solid-svg-icons"

import ColorModeToggle from "./ColorModeToggle"
import Link from "next/link"

export default function Header({ windowSize, environment, setIsCardEditorOpen, setCardEditorData }) {
    const customTheme = useTheme()
    const isSSR = typeof window === "undefined"

    const completedTheme = useColorModeValue(customTheme.statusColors.completed.light, customTheme.statusColors.completed.dark)

    function navigateHome() {
        if (!isSSR) {
            if (environment === "development") {
                window.history.replaceState({}, "", `${window.location.pathname}`)
                window.location.reload()
            } else {
                window.location.href = "https://eridianalpha.com"
            }
        }
    }

    const shouldExpandOnHover = useBreakpointValue({ base: false, md: true })

    return (
        <>
            <Box bg={useColorModeValue(customTheme.pageBackground.light, customTheme.pageBackground.dark)}>
                <Flex h={"fit-content"} pt={4} pb={2} justifyContent={"space-between"} alignItems={"start"}>
                    <Flex gap={3}>
                        <Image
                            onClick={navigateHome}
                            sx={{ cursor: "pointer" }}
                            width={"40px"}
                            objectFit={"cover"}
                            src={"/481368551588.png"}
                            borderRadius={"5px"}
                            alt={"Eridian Avatar"}
                        />
                        <Box pr={2} minW="80px" fontWeight="bold" fontSize="xl" sx={{ cursor: "default" }}>
                            Eridian
                        </Box>
                        {environment === "development" && (
                            <Button
                                aria-label="Create new card"
                                variant="outline"
                                borderColor={completedTheme}
                                borderWidth={2}
                                color={completedTheme}
                                borderRadius={10}
                                onClick={() => {
                                    setIsCardEditorOpen(true)
                                    setCardEditorData(cardDataTemplate[0])
                                }}
                                _hover={
                                    shouldExpandOnHover
                                        ? {
                                              backgroundColor: "transparent",
                                              "> div > div": {
                                                  maxWidth: "200px",
                                                  opacity: "1",
                                              },
                                          }
                                        : {}
                                }
                                px={0}
                            >
                                <Box display="flex" alignItems="center">
                                    <Box width="40px">
                                        <FontAwesomeIcon icon={faCirclePlus} size="lg" />
                                    </Box>
                                    <Box
                                        overflow="hidden"
                                        whiteSpace="nowrap"
                                        maxWidth="0"
                                        opacity="0"
                                        transition="max-width 0.3s ease, opacity 0.3s ease"
                                    >
                                        <Text pr={2}>Create new card</Text>
                                    </Box>
                                </Box>
                            </Button>
                        )}
                    </Flex>
                    <Flex direction={"row"} gap={3} alignItems={"top"}>
                        <Flex direction={"row"} wrap={"wrap"} gap={2} justifyContent={"right"}>
                            <Flex gap={2}>
                                <Link href={"https://docs.eridianalpha.com"} target="_blank">
                                    <IconButton
                                        bg={useColorModeValue(customTheme.contentBackground.color.light, customTheme.contentBackground.color.dark)}
                                        _hover={{
                                            bg: useColorModeValue(
                                                customTheme.contentBackground.hoverColor.light,
                                                customTheme.contentBackground.hoverColor.dark
                                            ),
                                        }}
                                        borderRadius={"20px"}
                                        aria-label={"Eridian Docs"}
                                    >
                                        <FontAwesomeIcon icon={faBook} size={"lg"} />
                                    </IconButton>
                                </Link>
                                <Link href={"https://github.com/EridianAlpha/eridianalpha.com"} target="_blank">
                                    <IconButton
                                        bg={useColorModeValue(customTheme.contentBackground.color.light, customTheme.contentBackground.color.dark)}
                                        _hover={{
                                            bg: useColorModeValue(
                                                customTheme.contentBackground.hoverColor.light,
                                                customTheme.contentBackground.hoverColor.dark
                                            ),
                                        }}
                                        borderRadius={"20px"}
                                        aria-label={"View GitHub Source"}
                                    >
                                        <FontAwesomeIcon icon={faGithub} size={"lg"} />
                                    </IconButton>
                                </Link>
                            </Flex>
                            <Flex gap={2}>
                                <Link href={"https://t.me/eridianalpha"} target="_blank">
                                    <IconButton
                                        bg={useColorModeValue(customTheme.contentBackground.color.light, customTheme.contentBackground.color.dark)}
                                        _hover={{
                                            bg: useColorModeValue(
                                                customTheme.contentBackground.hoverColor.light,
                                                customTheme.contentBackground.hoverColor.dark
                                            ),
                                        }}
                                        borderRadius={"20px"}
                                        aria-label={"Eridian Telegram Profile"}
                                    >
                                        <FontAwesomeIcon icon={faTelegram} size={"lg"} />
                                    </IconButton>
                                </Link>
                                <Link href={"https://twitter.com/EridianAlpha"} target="_blank">
                                    <IconButton
                                        bg={useColorModeValue(customTheme.contentBackground.color.light, customTheme.contentBackground.color.dark)}
                                        _hover={{
                                            bg: useColorModeValue(
                                                customTheme.contentBackground.hoverColor.light,
                                                customTheme.contentBackground.hoverColor.dark
                                            ),
                                        }}
                                        borderRadius={"20px"}
                                        aria-label={"Eridian Twitter Profile"}
                                    >
                                        <FontAwesomeIcon icon={faTwitter} size={"lg"} />
                                    </IconButton>
                                </Link>
                            </Flex>
                        </Flex>
                        <ColorModeToggle />
                        <Flex alignItems={"center"}></Flex>
                    </Flex>
                </Flex>
            </Box>
        </>
    )
}
