import React, { useState, useEffect, useRef } from "react"

import { useTheme, useColorModeValue, Card, CardHeader, Heading, Text, CardBody, CardFooter, Image, Flex, Stack, HStack } from "@chakra-ui/react"

export default function CardMedium({ cardData, windowSize, cardRef }) {
    const imageRef = useRef<HTMLImageElement>(null)
    const [roundedCorners, setRoundedCorners] = useState(false)

    useEffect(() => {
        if (cardRef.current && imageRef.current) {
            const cardWidth = cardRef.current.offsetWidth
            const imageWidth = imageRef.current.offsetWidth
            setRoundedCorners(cardWidth - 1 > imageWidth)
        }
    }, [windowSize.width])
    return (
        <Flex alignItems="center" justifyContent="center" flexDirection={"column"} width={"100%"}>
            <Stack flexGrow={1} align="center">
                {cardData?.images?.[0] && (
                    <Image
                        ref={imageRef}
                        objectFit="cover"
                        maxH={"30vh"}
                        src={cardData?.images?.[0].image}
                        alt={cardData?.images?.[0].alt}
                        borderBottomRadius={roundedCorners ? "30px" : "0px"}
                    />
                )}
                <CardHeader>
                    <Heading size="md">{cardData.name}</Heading>
                </CardHeader>
                <CardBody>
                    <Text>{cardData.description}</Text>
                </CardBody>
                <CardFooter>{/* <Button>View here</Button> */}</CardFooter>
            </Stack>
        </Flex>
    )
}
