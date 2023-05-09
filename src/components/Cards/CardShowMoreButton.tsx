import React, { useState, useEffect, useRef, useCallback } from "react"
import NextLink from "next/link"
import { useTheme, useColorModeValue, Text, Flex, Link, Box, CardBody, Button } from "@chakra-ui/react"

export default function CardShowMoreButton({
    cardIndex,
    imageWidths,
    windowSize,
    backgroundColor,
    linkHoverColor,
    showMore,
    setShowMore,
}: {
    cardIndex: number
    imageWidths: any
    windowSize: any
    backgroundColor: string
    linkHoverColor: string
    showMore: any
    setShowMore: any
}) {
    const showMoreButtonRef = useRef(null)
    const [showMoreButtonWidth, setShowMoreButtonWidth] = useState(0)
    const toggleShowMore = useCallback((cardIndex: number) => {
        setShowMore((prevState: any) => prevState.map((value: boolean, index: number) => (index === cardIndex ? !value : value)))
    }, [])
    useEffect(() => {
        if (showMoreButtonRef.current) {
            setShowMoreButtonWidth(showMoreButtonRef.current.offsetWidth)
        }
    }, [windowSize.width, showMoreButtonRef.current, showMore])

    return (
        // TODO: Fix this by making a fully custom button using Box
        <CardBody paddingTop={0} sx={{ marginTop: "0 !important" }} paddingBottom={{ base: "10px", md: "20px" }}>
            <Flex grow={1} direction={"column"} alignItems={"center"}>
                <Button
                    ref={showMoreButtonRef}
                    bg={backgroundColor}
                    _hover={{
                        bg: linkHoverColor,
                    }}
                    borderTopRadius={
                        !showMore[cardIndex] && imageWidths[cardIndex][1] < showMoreButtonWidth
                            ? "30px"
                            : showMore[cardIndex] && imageWidths[cardIndex][imageWidths.length] < showMoreButtonWidth
                            ? "30px"
                            : "0px"
                    }
                    borderBottomRadius="30px"
                    onClick={() => toggleShowMore(cardIndex)}
                    width={"100%"}
                    minWidth={!showMore[cardIndex] ? `${imageWidths[cardIndex][1]}px` : `${imageWidths[cardIndex][imageWidths.length]}px`}
                >
                    {showMore[cardIndex] ? "Show less" : "Show more"}
                </Button>
            </Flex>
        </CardBody>
    )
}
