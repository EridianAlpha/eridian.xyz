import React, { useMemo } from "react"
import cardData from "../../../public/data/cardData.json"
import Masonry from "react-masonry-css"

import { useTheme, useColorModeValue, Card, Box, CardHeader, Heading, CardBody, Image, Flex, Stack, HStack } from "@chakra-ui/react"

import CardDescription from "./CardDescription"
import CardLinks from "./CardLinks"
import CardImages from "./CardImages"
import CardStatus from "./CardStatus"

export default function CardGallery({ windowSize }) {
    const customTheme = useTheme()
    const cardBackground = useColorModeValue(customTheme.contentBackground.color.light, customTheme.contentBackground.color.dark)
    const cardRefs = useMemo(() => cardData.map(() => React.createRef<HTMLDivElement>()), [])
    const imageRefs = useMemo(
        () => cardData.map((_, index) => Object.values(cardData[index].images || {}).map(() => React.createRef<HTMLImageElement>())),
        []
    )

    const breakpointCols = {
        default: 3,
        1400: 2,
        700: 1,
    }

    return (
        <Box width="100%">
            <Masonry breakpointCols={breakpointCols} className="my-masonry-grid" columnClassName="my-masonry-grid_column">
                {cardData.map((card, cardIndex) => (
                    <Card
                        key={cardIndex}
                        ref={cardRefs[cardIndex]}
                        maxW={"100%"}
                        bg={cardBackground}
                        overflow="hidden"
                        variant="outline"
                        borderRadius={"30px"}
                        borderWidth={0}
                    >
                        <Flex alignItems="center" justifyContent="center" flexDirection={{ base: "column", md: "row" }} width={"100%"}>
                            <Stack flexGrow={1} width="100%">
                                <HStack>
                                    {card?.images?.[0] && (
                                        <Image
                                            objectFit="contain"
                                            width="100px"
                                            height="100px"
                                            src={card?.images?.[0].image}
                                            alt={card?.images?.[0].alt}
                                            borderTopRightRadius={{ base: "0px" }}
                                            borderBottomRightRadius={{ base: "30px" }}
                                            borderBottomLeftRadius={{ base: "0px" }}
                                        />
                                    )}
                                    <CardHeader>
                                        <Heading size="md">{card.name}</Heading>
                                    </CardHeader>
                                </HStack>
                                <CardBody>
                                    <CardDescription cardData={card} />
                                    <CardLinks cardData={card} />
                                </CardBody>
                                <Box paddingX={2} paddingY={5}>
                                    <CardStatus cardData={card} />
                                </Box>
                                {Object.values(card?.images || {})
                                    .slice(1)
                                    .map((image, imageIndex, imageArray) => (
                                        <CardImages
                                            key={imageIndex}
                                            windowSize={windowSize}
                                            cardIndex={cardIndex}
                                            imageIndex={imageIndex}
                                            image={image}
                                            imageArray={imageArray}
                                            cardRefs={cardRefs}
                                            imageRefs={imageRefs}
                                        />
                                    ))}
                            </Stack>
                        </Flex>
                    </Card>
                ))}
            </Masonry>
        </Box>
    )
}
