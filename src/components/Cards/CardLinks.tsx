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

const CardLink = ({ link, index, backgroundColor, linkHoverColor }) => {
    return (
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
                        icon={link?.type == "twitter" ? faTwitter : link?.type == "github" ? faGithub : link?.type == "discord" ? faDiscord : faLink}
                        size={"lg"}
                    />
                    <Text pl={2} pr={1}>
                        {link?.label}
                    </Text>
                </Flex>
            </Box>
        </Link>
    )
}

export default function CardLinks({ cardData, backgroundColor, linkHoverColor }) {
    if (cardData.externalLinks) {
        const linksArray: LinkObject[] = Object.values(cardData.externalLinks)
        return (
            // This complex solution is required to get the links to wrap properly
            <Flex flexDirection={"row"} wrap={"wrap"} columnGap={"20px"} rowGap={"20px"} justifyContent={"center"}>
                {linksArray.map((link, index) => {
                    if (index === linksArray.length - 2) {
                        return (
                            <Flex wrap={"wrap"} columnGap={"20px"} rowGap={"20px"} justifyContent={"center"} key={index}>
                                <CardLink link={link} index={index} backgroundColor={backgroundColor} linkHoverColor={linkHoverColor} />
                                <CardLink
                                    link={linksArray[index + 1]}
                                    index={index + 1}
                                    backgroundColor={backgroundColor}
                                    linkHoverColor={linkHoverColor}
                                />
                            </Flex>
                        )
                    }

                    if (index == 0 || index !== linksArray.length - 1) {
                        return <CardLink key={index} link={link} index={index} backgroundColor={backgroundColor} linkHoverColor={linkHoverColor} />
                    }
                })}
            </Flex>
        )
    }
}
