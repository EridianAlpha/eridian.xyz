import React, { useState, useEffect, useRef } from "react"
import NextLink from "next/link"
import {
    useTheme,
    useColorModeValue,
    Card,
    CardHeader,
    Heading,
    Text,
    CardBody,
    CardFooter,
    Image,
    Flex,
    Stack,
    HStack,
    Link,
} from "@chakra-ui/react"

interface LinkObject {
    url: string
    label: string
}

export default function CardLinks({ cardData }) {
    if (cardData.externalLinks) {
        const linksArray: LinkObject[] = Object.values(cardData.externalLinks)

        return (
            <ul>
                {linksArray.map((link, index) => (
                    <li key={index}>
                        <Link as={NextLink} href={link?.url} isExternal>
                            {link?.label}
                        </Link>
                    </li>
                ))}
            </ul>
        )
    }
}
