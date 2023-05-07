import React, { useState, useEffect, useRef } from "react"

import { useTheme, useColorModeValue, Card, CardHeader, Heading, Text, CardBody, CardFooter, Image, Flex, Stack, HStack } from "@chakra-ui/react"

export default function CardLarge({ cardData, windowSize, cardRef }) {
    const imageRefTop = useRef<HTMLImageElement>(null)
    const [roundedCornersTop, setRoundedCornersTop] = useState(false)
    const imageRefBottom = useRef<HTMLImageElement>(null)
    const [roundedCornersBottom, setRoundedCornersBottom] = useState(false)

    useEffect(() => {
        if (cardRef.current && imageRefBottom.current) {
            const cardWidth = cardRef.current.offsetWidth
            const imageWidthBottom = imageRefBottom.current.offsetWidth
            setRoundedCornersBottom(cardWidth - 1 > imageWidthBottom)
        }
        if (cardRef.current && imageRefTop.current) {
            const cardWidth = cardRef.current.offsetWidth
            const imageWidthTop = imageRefTop.current.offsetWidth
            setRoundedCornersTop(cardWidth - 1 > imageWidthTop)
        }
    }, [windowSize.width])

    return (
        <Flex alignItems="center" justifyContent="center" flexDirection={{ base: "column", md: "row" }} width={"100%"}>
            <Stack flexGrow={1} align="center">
                {cardData?.images?.[0] && (
                    <Image
                        ref={imageRefTop}
                        objectFit="cover"
                        maxH={"30vh"}
                        src={cardData?.images?.[0].image}
                        alt={cardData?.images?.[0].alt}
                        borderBottomRadius={roundedCornersTop ? "30px" : "0px"}
                    />
                )}
                <CardHeader>
                    <Heading size="md">{cardData.name}</Heading>
                </CardHeader>
                <CardBody>
                    <Text>{cardData.description}</Text>
                </CardBody>
                <CardFooter>{/* <Button>View here</Button> */}</CardFooter>
                {cardData?.images?.[1] && (
                    <Image
                        ref={imageRefBottom}
                        objectFit="cover"
                        maxH={"30vh"}
                        src={cardData?.images?.[1].image}
                        alt={cardData?.images?.[1].alt}
                        borderTopRadius={roundedCornersBottom ? "30px" : "0px"}
                    />
                )}
            </Stack>
        </Flex>
    )
}
