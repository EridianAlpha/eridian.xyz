import React, { useState, useMemo } from "react"

import Masonry from "react-masonry-css"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"

import {
    useTheme,
    useColorModeValue,
    Card,
    Box,
    Heading,
    CardBody,
    Image,
    Flex,
    Stack,
    HStack,
    Text,
    Collapse,
    IconButton,
    Button,
    Container,
} from "@chakra-ui/react"

import CardDescription from "./CardDescription"
import CardLinks from "./CardLinks"
import CardImages from "./CardImages"
import CardStatus from "./CardStatus"
import CardShowMoreButton from "./CardShowMoreButton"
import CardEditor from "./CardEditor"

export default function CardGallery({
    windowSize,
    environment,
    cardData,
    sortedCardData,
    isCardEditorOpen,
    setIsCardEditorOpen,
    cardEditorData,
    setCardEditorData,
}) {
    let breakpointCols
    if (sortedCardData.length == 1) {
        breakpointCols = {
            default: 1,
        }
    } else if (sortedCardData.length == 2) {
        breakpointCols = {
            default: 2,
        }
    } else {
        breakpointCols = {
            default: 3,
            1400: 2,
            900: 1,
        }
    }

    const customTheme = useTheme()
    const backgroundColor = useColorModeValue(customTheme.pageBackground.light, customTheme.pageBackground.dark)
    const linkHoverColor = useColorModeValue(customTheme.contentBackground.hoverColor.light, customTheme.contentBackground.hoverColor.dark)
    const contentBackground = useColorModeValue(customTheme.contentBackground.color.light, customTheme.contentBackground.color.dark)
    const contentBackgroundHover = useColorModeValue(customTheme.contentBackground.hoverColor.light, customTheme.contentBackground.hoverColor.dark)
    const headingColor = useColorModeValue(customTheme.headingText.color.light, customTheme.headingText.color.dark)

    const [showMore, setShowMore] = useState(Array(sortedCardData.length).fill(false))
    // Updating this state causes the contents of the Collapse component to re-render
    // which is needed to update the image radiuses and button border radius
    // TODO: It's a hacky solution, but I couldn't find anything else that worked right now
    const [collapseReRender, setCollapseReRender] = useState(false)

    const cardRefs = useMemo(() => sortedCardData.map(() => React.createRef<HTMLDivElement>()), [sortedCardData])
    const imageRefs = useMemo(
        () => sortedCardData.map((_, index) => Object.values(sortedCardData[index].images || {}).map(() => React.createRef<HTMLImageElement>())),
        [sortedCardData]
    )
    const [imageWidths, setImageWidths] = useState(sortedCardData.map((_, index) => Object.values(sortedCardData[index].images || {}).map(() => 0)))

    return (
        <Flex width="100%">
            <Masonry breakpointCols={breakpointCols} className="my-masonry-grid" columnClassName="my-masonry-grid_column">
                {sortedCardData.map((card, cardIndex) => (
                    <Card
                        key={card.id}
                        ref={cardRefs[cardIndex]}
                        // maxW={sortedCardData?.length > 1 ? "100%" : { base: "100%", lg: "80%", xl: "75%" }}
                        maxW="100%"
                        bg={contentBackground}
                        overflow="hidden"
                        variant="outline"
                        borderRadius={"30px"}
                        borderWidth={0}
                        mx={
                            sortedCardData?.length > 1
                                ? { base: "0px", sm: "10px", md: "20px", xl: "30px" }
                                : { base: "0px", sm: "10px", md: "10%", xl: "15%" }
                        }
                    >
                        <Flex alignItems="center" justifyContent="center" flexDirection={{ base: "column", md: "row" }} width={"100%"}>
                            <Stack flexGrow={1} width="100%">
                                <HStack alignItems={"top"}>
                                    <Image
                                        bg={"#102026"}
                                        objectFit="contain"
                                        width="100px"
                                        height="100px"
                                        src={card?.images?.[0].image ? card?.images?.[0].image : "./481368551588.png"}
                                        alt={card?.images?.[0].alt}
                                        borderTopRightRadius={{ base: "0px" }}
                                        borderBottomRightRadius={{ base: "30px" }}
                                        borderBottomLeftRadius={{ base: "0px" }}
                                    />
                                    <Flex direction={"column"} grow={1} width="100%">
                                        <Flex direction={"row"} justifyContent={"space-between"}>
                                            <Heading size="md" color={headingColor} pt={3} px={1} pb={2}>
                                                {card.name}
                                            </Heading>
                                            {environment === "development" && (
                                                <IconButton
                                                    bg={backgroundColor}
                                                    _hover={{
                                                        bg: contentBackgroundHover,
                                                    }}
                                                    borderBottomLeftRadius={"10px"}
                                                    borderTopRightRadius={"30px"}
                                                    borderTopLeftRadius={"0px"}
                                                    borderBottomRightRadius={"0px"}
                                                    borderTop={"6px solid"}
                                                    borderRight={"6px solid"}
                                                    borderColor={contentBackground}
                                                    aria-label={"Edit card"}
                                                    onClick={() => {
                                                        setIsCardEditorOpen(true)
                                                        setCardEditorData(card)
                                                    }}
                                                >
                                                    <Box mt={1} mr={1}>
                                                        <FontAwesomeIcon icon={faEdit} size={"lg"} />
                                                    </Box>
                                                </IconButton>
                                            )}
                                        </Flex>
                                        <Box pl={1} pr={3} pt={1}>
                                            <Text fontWeight={"medium"}>{card?.summary}</Text>
                                        </Box>
                                    </Flex>
                                </HStack>
                                <Box px={2} pt={5}>
                                    <CardStatus cardData={card} />
                                </Box>
                                {card?.externalLinks?.[0] || card?.description?.[0] ? (
                                    <CardBody>
                                        {card?.externalLinks?.[0] && (
                                            <Box>
                                                <CardLinks cardData={card} backgroundColor={backgroundColor} linkHoverColor={linkHoverColor} />
                                            </Box>
                                        )}
                                        {card?.description?.[0] && (
                                            <Box pt={5} mt={2}>
                                                <CardDescription index={0} cardData={card} />
                                            </Box>
                                        )}
                                    </CardBody>
                                ) : null}
                                {card?.images?.[1] && (
                                    <CardImages
                                        windowSize={windowSize}
                                        cardIndex={cardIndex}
                                        card={card}
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
                                {(Object.entries(card?.description || {}).some(([key]) => key !== "0") ||
                                    Object.entries(card?.images || {}).some(([key]) => key !== "0" && key !== "1")) && (
                                    <>
                                        <Collapse in={showMore[cardIndex]} style={{ marginTop: 0 }}>
                                            {Array.from({
                                                length: Math.max(
                                                    Object.values(card?.description || {})?.length || 0,
                                                    Object.values(card?.images || {})?.length - 2 || 0
                                                ),
                                            }).map((_, index) => (
                                                <React.Fragment key={index}>
                                                    {card?.description?.[index + 1] && (
                                                        <CardBody>
                                                            <CardDescription index={index + 1} cardData={card} />
                                                        </CardBody>
                                                    )}
                                                    {card?.images?.[index + 2] && (
                                                        <CardImages
                                                            key={index + 2}
                                                            windowSize={windowSize}
                                                            card={card}
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
                                                </React.Fragment>
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
                                            setCollapseReRender={setCollapseReRender}
                                        />
                                    </>
                                )}
                            </Stack>
                        </Flex>
                    </Card>
                ))}
            </Masonry>
            {environment === "development" && (
                <CardEditor
                    windowSize={windowSize}
                    isOpen={isCardEditorOpen}
                    onClose={() => setIsCardEditorOpen(false)}
                    cardEditorData={cardEditorData}
                    setCardEditorData={setCardEditorData}
                    cardData={cardData}
                />
            )}
        </Flex>
    )
}
