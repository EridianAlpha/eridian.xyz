import React, { useState, useEffect, useMemo, useCallback } from "react"
import cardData from "../../../public/data/cardData.json"
import Masonry from "react-masonry-css"

import { useTheme, useColorModeValue, Card, Box, Heading, CardBody, Image, Flex, Stack, HStack, Text, Collapse, Button } from "@chakra-ui/react"

import CardDescription from "./CardDescription"
import CardLinks from "./CardLinks"
import CardImages from "./CardImages"
import CardStatus from "./CardStatus"

export default function CardGallery({ windowSize }) {
    const breakpointCols = {
        default: 3,
        1400: 2,
        900: 1,
    }

    const customTheme = useTheme()
    const backgroundColor = useColorModeValue(customTheme.pageBackground.light, customTheme.pageBackground.dark)
    const linkHoverColor = useColorModeValue(customTheme.contentBackground.hoverColor.light, customTheme.contentBackground.hoverColor.dark)
    const cardBackground = useColorModeValue(customTheme.contentBackground.color.light, customTheme.contentBackground.color.dark)
    const headingColor = useColorModeValue(customTheme.headingText.color.light, customTheme.headingText.color.dark)

    const sortedCardData = [...cardData].sort((a, b) => {
        const dateA = new Date(a.startDate)
        const dateB = new Date(b.startDate)
        return dateB.getTime() - dateA.getTime()
    })

    const [showMore, setShowMore] = useState(Array(sortedCardData.length).fill(false))
    const toggleShowMore = useCallback((cardIndex: number) => {
        setShowMore((prevState) => prevState.map((value, index) => (index === cardIndex ? !value : value)))
    }, [])

    const cardRefs = useMemo(() => sortedCardData.map(() => React.createRef<HTMLDivElement>()), [])
    const imageRefs = useMemo(
        () => sortedCardData.map((_, index) => Object.values(sortedCardData[index].images || {}).map(() => React.createRef<HTMLImageElement>())),
        []
    )

    return (
        <Box width="100%">
            <Masonry breakpointCols={breakpointCols} className="my-masonry-grid" columnClassName="my-masonry-grid_column">
                {sortedCardData.map((card, cardIndex) => (
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
                                <HStack alignItems={"top"}>
                                    <Image
                                        objectFit="contain"
                                        width="100px"
                                        height="100px"
                                        src={card?.images?.[0].image ? card?.images?.[0].image : "./481368551588.png"}
                                        alt={card?.images?.[0].alt}
                                        borderTopRightRadius={{ base: "0px" }}
                                        borderBottomRightRadius={{ base: "30px" }}
                                        borderBottomLeftRadius={{ base: "0px" }}
                                    />
                                    <Box px={1} paddingTop={3}>
                                        <Heading size="md" pb={2} color={headingColor}>
                                            {card.name}
                                        </Heading>
                                        <Text>{card?.summary}</Text>
                                    </Box>
                                </HStack>
                                <Box px={2} pt={5}>
                                    <CardStatus cardData={card} />
                                </Box>
                                <CardBody>
                                    <Box>
                                        <CardLinks cardData={card} />
                                    </Box>
                                    <Box pt={5} mt={2}>
                                        <CardDescription index={0} cardData={card} />
                                    </Box>
                                </CardBody>
                                {card?.images?.[1] && (
                                    <CardImages
                                        key={1}
                                        windowSize={windowSize}
                                        cardIndex={cardIndex}
                                        imageIndex={2}
                                        image={card?.images?.[1]}
                                        imageArray={Object.values(card?.images || {})}
                                        cardRefs={cardRefs}
                                        imageRefs={imageRefs}
                                        sortedCardData={sortedCardData}
                                        showMore={showMore}
                                    />
                                )}
                                {(card?.description?.[1] || card?.images?.[2]) && (
                                    <>
                                        <Collapse in={showMore[cardIndex]}>
                                            {Object.values(card?.images || {})
                                                .slice(2)
                                                .map((image, imageIndex, imageArray) => (
                                                    <>
                                                        {card?.description[imageIndex + 1] ? (
                                                            <CardBody>
                                                                <CardDescription index={imageIndex} cardData={card} />
                                                            </CardBody>
                                                        ) : null}
                                                        <CardImages
                                                            key={imageIndex}
                                                            windowSize={windowSize}
                                                            cardIndex={cardIndex}
                                                            imageIndex={imageIndex}
                                                            image={image}
                                                            imageArray={imageArray}
                                                            cardRefs={cardRefs}
                                                            imageRefs={imageRefs}
                                                            sortedCardData={sortedCardData}
                                                            showMore={showMore}
                                                        />
                                                    </>
                                                ))}
                                        </Collapse>
                                        {/* TODO: Fix this by making a fully custom button using Box */}
                                        <CardBody paddingTop={0} sx={{ marginTop: "0 !important" }}>
                                            <Button
                                                bg={backgroundColor}
                                                _hover={{
                                                    bg: linkHoverColor,
                                                }}
                                                borderRadius={"30px"}
                                                onClick={() => toggleShowMore(cardIndex)}
                                                width={"100%"}
                                            >
                                                {showMore[cardIndex] ? "Show less" : "Show more"}
                                            </Button>
                                        </CardBody>
                                    </>
                                )}
                            </Stack>
                        </Flex>
                    </Card>
                ))}
            </Masonry>
        </Box>
    )
}
