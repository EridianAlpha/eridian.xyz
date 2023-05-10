import React, { useState, useMemo } from "react"
import cardData from "../../../public/data/cardData.json"
import Masonry from "react-masonry-css"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"

import { useTheme, useColorModeValue, Card, Box, Heading, CardBody, Image, Flex, Stack, HStack, Text, Collapse, IconButton } from "@chakra-ui/react"

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
    const contentBackground = useColorModeValue(customTheme.contentBackground.color.light, customTheme.contentBackground.color.dark)
    const contentBackgroundHover = useColorModeValue(customTheme.contentBackground.hoverColor.light, customTheme.contentBackground.hoverColor.dark)
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
                        bg={contentBackground}
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
                                    <Flex direction={"column"}>
                                        <Flex direction={"row"} justifyContent={"space-between"}>
                                            <Heading size="md" color={headingColor} pt={3} px={1} pb={2}>
                                                {card.name}
                                            </Heading>
                                            {process.env.NODE_ENV === "development" && (
                                                <IconButton
                                                    bg={contentBackground}
                                                    _hover={{
                                                        bg: contentBackgroundHover,
                                                    }}
                                                    borderBottomLeftRadius={"10px"}
                                                    aria-label={"View GitHub Source"}
                                                >
                                                    <Box mt={1} mr={1}>
                                                        <FontAwesomeIcon icon={faEdit} size={"lg"} />
                                                    </Box>
                                                </IconButton>
                                            )}
                                        </Flex>
                                        <Box px={1} pt={1}>
                                            <Text fontWeight={"medium"}>{card?.summary}</Text>
                                        </Box>
                                    </Flex>
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
                                        <Collapse in={showMore[cardIndex]} style={{ marginTop: 0 }}>
                                            {Array.from({
                                                length: Math.max(
                                                    Object.values(card?.description || {})?.length || 0,
                                                    Object.values(card?.images || {})?.length - 2 || 0
                                                ),
                                            }).map((_, index) => (
                                                <>
                                                    {card?.description[index + 1] && (
                                                        <CardBody>
                                                            <CardDescription index={index + 1} cardData={card} />
                                                        </CardBody>
                                                    )}
                                                    {card?.images[index + 2] && (
                                                        <CardImages
                                                            key={index + 2}
                                                            windowSize={windowSize}
                                                            cardIndex={cardIndex}
                                                            imageIndex={index + 2}
                                                            image={card?.images[index + 2]}
                                                            imageArray={Object.values(card?.images || {})}
                                                            cardRefs={cardRefs}
                                                            imageRefs={imageRefs}
                                                            sortedCardData={sortedCardData}
                                                            showMore={showMore}
                                                            imageWidths={imageWidths}
                                                            setImageWidths={setImageWidths}
                                                        />
                                                    )}
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
