import React, { useState, useMemo } from "react"
import cardData from "../../../public/data/cardData.json"
import Masonry from "react-masonry-css"

import { useTheme, useColorModeValue, Card, Box, Heading, CardBody, Image, Flex, Stack, HStack, Text, Collapse } from "@chakra-ui/react"

import CardDescription from "./CardDescription"
import CardLinks from "./CardLinks"
import CardImages from "./CardImages"
import CardStatus from "./CardStatus"
import CardShowMoreButton from "./CardShowMoreButton"

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

    const cardRefs = useMemo(() => sortedCardData.map(() => React.createRef<HTMLDivElement>()), [])
    const imageRefs = useMemo(
        () => sortedCardData.map((_, index) => Object.values(sortedCardData[index].images || {}).map(() => React.createRef<HTMLImageElement>())),
        []
    )
    const [imageWidths, setImageWidths] = useState(sortedCardData.map((_, index) => Object.values(sortedCardData[index].images || {}).map(() => 0)))

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
                                        <CardLinks cardData={card} backgroundColor={backgroundColor} linkHoverColor={linkHoverColor} />
                                    </Box>
                                    <Box pt={5} mt={2}>
                                        <CardDescription index={0} cardData={card} />
                                    </Box>
                                </CardBody>
                                {card?.images?.[1] && (
                                    <CardImages
                                        windowSize={windowSize}
                                        cardIndex={cardIndex}
                                        imageIndex={1}
                                        image={card?.images?.[1]}
                                        imageArray={Object.values(card?.images || {})}
                                        cardRefs={cardRefs}
                                        imageRefs={imageRefs}
                                        sortedCardData={sortedCardData}
                                        showMore={showMore}
                                        imageWidths={imageWidths}
                                        setImageWidths={setImageWidths}
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
                                                            key={imageIndex + 2}
                                                            windowSize={windowSize}
                                                            cardIndex={cardIndex}
                                                            imageIndex={imageIndex + 2}
                                                            image={image}
                                                            imageArray={imageArray}
                                                            cardRefs={cardRefs}
                                                            imageRefs={imageRefs}
                                                            sortedCardData={sortedCardData}
                                                            showMore={showMore}
                                                            imageWidths={imageWidths}
                                                            setImageWidths={setImageWidths}
                                                        />
                                                    </>
                                                ))}
                                        </Collapse>
                                        <CardShowMoreButton
                                            cardIndex={cardIndex}
                                            imageWidths={imageWidths}
                                            windowSize={windowSize}
                                            backgroundColor={backgroundColor}
                                            linkHoverColor={linkHoverColor}
                                            showMore={showMore}
                                            setShowMore={setShowMore}
                                        />
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
