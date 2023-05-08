import React, { useState, useEffect, useRef } from "react"
import NextLink from "next/link"
import { useTheme, useColorModeValue, Text, Flex, Link, Box } from "@chakra-ui/react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGithub, faTwitter, faDiscord } from "@fortawesome/free-brands-svg-icons"
import { faLink } from "@fortawesome/free-solid-svg-icons"

interface LinkObject {
    url: string
    label: string
    type: string
}

export default function CardLinks({ cardData }) {
    const customTheme = useTheme()
    const backgroundColor = useColorModeValue(customTheme.pageBackground.light, customTheme.pageBackground.dark)
    const linkHoverColor = useColorModeValue(customTheme.contentBackground.hoverColor.light, customTheme.contentBackground.hoverColor.dark)

    if (cardData.externalLinks) {
        const linksArray: LinkObject[] = Object.values(cardData.externalLinks)

        return (
            <Flex flexDirection={"row"} wrap={"wrap"} columnGap={"20px"} rowGap={"10px"} justifyContent={"space-evenly"}>
                {linksArray.map((link, index) => (
                    <Link key={index} as={NextLink} href={link?.url} isExternal>
                        <Box
                            borderStyle="solid"
                            borderRadius="50px"
                            bg={backgroundColor}
                            display="inline-flex"
                            _hover={{
                                bg: linkHoverColor,
                            }}
                        >
                            <Flex alignItems={"center"} py={1} px={2}>
                                <FontAwesomeIcon
                                    icon={
                                        link?.type == "twitter"
                                            ? faTwitter
                                            : link?.type == "github"
                                            ? faGithub
                                            : link?.type == "discord"
                                            ? faDiscord
                                            : faLink
                                    }
                                    size={"lg"}
                                />
                                <Text pl={2} pr={1}>
                                    {link?.label}
                                </Text>
                            </Flex>
                        </Box>
                    </Link>
                ))}
            </Flex>
        )
    }
}
