import { useTheme, Box, Flex, HStack, IconButton, useColorModeValue, Image } from "@chakra-ui/react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons"

import ColorModeToggle from "./ColorModeToggle"
import Link from "next/link"

export default function Header({ windowSize }) {
    const customTheme = useTheme()
    const isSSR = typeof window === "undefined"

    function navigateHome() {
        if (!isSSR) {
            window.history.replaceState({}, "", `${window.location.pathname}`)
            window.location.reload()
        }
    }

    return (
        <>
            <Box bg={useColorModeValue(customTheme.pageBackground.light, customTheme.pageBackground.dark)}>
                <Flex h={20} alignItems={"center"} justifyContent={"space-between"}>
                    <HStack spacing={3} alignItems={"center"}>
                        <Image
                            onClick={navigateHome}
                            sx={{ cursor: "pointer" }}
                            width={"40px"}
                            objectFit={"cover"}
                            src={"./481368551588.png"}
                            borderRadius={"5px"}
                        />
                        <Box pr={2} minW="120px" fontWeight="bold" fontSize="xl" sx={{ cursor: "default" }}>
                            Eridian
                        </Box>
                    </HStack>
                    <HStack spacing={3}>
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
                        <ColorModeToggle />
                        <Flex alignItems={"center"}></Flex>
                    </HStack>
                </Flex>
            </Box>
        </>
    )
}
