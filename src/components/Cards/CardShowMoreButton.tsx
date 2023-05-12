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
    setCollapseReRender,
}: {
    cardIndex: number
    imageWidths: any
    windowSize: any
    backgroundColor: string
    linkHoverColor: string
    showMore: any
    setShowMore: any
    setCollapseReRender: any
}) {
    const showMoreButtonRef = useRef(null)
    const [showMoreButtonWidth, setShowMoreButtonWidth] = useState(0)
    const toggleShowMore = useCallback(
        (cardIndex: number) => {
            setShowMore((prevState: any) => prevState.map((value: boolean, index: number) => (index === cardIndex ? !value : value)))
        },
        [setShowMore]
    )
    useEffect(() => {
        if (showMoreButtonRef.current) {
            setShowMoreButtonWidth(showMoreButtonRef.current.offsetWidth)
        }
    }, [windowSize.width, showMore])

    // Dynamic calculation of the top border radius of the showMore button
    const calculateTopBorderRadius = () => {
        const borderRadius = 10
        if (!showMore[cardIndex]) {
            if (imageWidths[cardIndex][1] >= showMoreButtonWidth - borderRadius) {
                return `${showMoreButtonWidth - imageWidths[cardIndex][1]}px`
            } else {
                return `${borderRadius}px`
            }
        } else if (showMore[cardIndex]) {
            if (imageWidths[cardIndex][imageWidths.length] > showMoreButtonWidth - borderRadius) {
                return `${showMoreButtonWidth - imageWidths[cardIndex][imageWidths.length]}px`
            } else {
                return `${borderRadius}px`
            }
        } else {
            return `${borderRadius}px`
        }
    }

    return (
        // TODO: Fix this by making a fully custom button using Box
        <CardBody paddingTop={0} sx={{ marginTop: "0 !important" }} paddingBottom={3}>
            <Flex grow={1} direction={"column"} alignItems={"center"}>
                <Button
                    ref={showMoreButtonRef}
                    bg={backgroundColor}
                    _hover={{
                        bg: linkHoverColor,
                    }}
                    borderTopRadius={calculateTopBorderRadius()}
                    borderBottomRadius="30px"
                    onClick={() => {
                        toggleShowMore(cardIndex)
                        // Hacky way to make the content of the collapse rerender after opening
                        for (let delay = 50; delay <= 250; delay += 50) {
                            setTimeout(() => {
                                setCollapseReRender((prevState: boolean) => !prevState)
                            }, delay)
                        }
                    }}
                    width={"100%"}
                    minWidth={!showMore[cardIndex] ? `${imageWidths[cardIndex][1]}px` : `${imageWidths[cardIndex][imageWidths.length]}px`}
                >
                    {showMore[cardIndex] ? "Show less" : "Show more"}
                </Button>
            </Flex>
        </CardBody>
    )
}
