import React, { useState, useEffect, useCallback } from "react"
import { Box, Image } from "@chakra-ui/react"

export default function CardImages({
    windowSize,
    card,
    cardIndex,
    imageIndex,
    image,
    imageArray,
    cardRefs,
    imageRefs,
    sortedCardData,
    showMore,
    imageWidths,
    setImageWidths,
}: {
    windowSize: { width: number; height: number }
    card: any
    cardIndex: number
    imageIndex: number
    image: { image: string; alt: string }
    imageArray: Array<{ image: string; alt: string }>
    cardRefs: Array<React.RefObject<HTMLDivElement>>
    imageRefs: Array<Array<React.RefObject<HTMLImageElement>>>
    sortedCardData: Array<any>
    showMore: Array<boolean>
    imageWidths: Array<Array<number>>
    setImageWidths: React.Dispatch<React.SetStateAction<Array<any>>>
}) {
    const [roundedCorners, setRoundedCorners] = useState(
        sortedCardData.map((_, index) => Object.values(sortedCardData[index].images || {}).map(() => false))
    )

    const calculateImageWidths = useCallback(() => {
        return sortedCardData.map((card, cardIndex) =>
            Object.values(card?.images || {}).map((_, imageIndex) => {
                if (!cardRefs[cardIndex]?.current || !imageRefs[cardIndex][imageIndex]?.current) {
                    return 0
                }
                const imageWidth = imageRefs[cardIndex][imageIndex].current.offsetWidth
                return imageWidth
            })
        )
    }, [sortedCardData, cardRefs, imageRefs])

    useEffect(() => {
        // Calculate image widths
        const newImageWidths = calculateImageWidths()
        if (JSON.stringify(newImageWidths) !== JSON.stringify(imageWidths)) {
            setImageWidths(newImageWidths)
        }

        const newRoundedCorners = sortedCardData.map((card, cardIndex) =>
            Object.values(card?.images || {}).map((_, imageIndex) => {
                if (!cardRefs[cardIndex]?.current || !imageRefs[cardIndex][imageIndex]?.current) {
                    return false
                }
                const cardWidth = cardRefs[cardIndex].current.offsetWidth
                const imageWidth = imageRefs[cardIndex][imageIndex].current.offsetWidth
                return cardWidth > imageWidth
            })
        )

        if (JSON.stringify(newRoundedCorners) !== JSON.stringify(roundedCorners)) {
            setRoundedCorners(newRoundedCorners)
        }
    }, [windowSize.width, imageRefs, sortedCardData, roundedCorners, cardRefs, imageWidths, showMore, calculateImageWidths, setImageWidths])

    return (
        <Box width="100%" display="flex" alignItems="center" justifyContent="center">
            <Image
                ref={imageRefs[cardIndex][imageIndex]}
                key={imageIndex}
                objectFit="contain"
                maxH={"30vh"}
                src={image.image}
                alt={image.alt}
                borderTopRadius={roundedCorners[cardIndex]?.[imageIndex] ? "30px" : "0px"}
                borderBottomRadius={
                    (imageIndex === imageArray.length - 1 &&
                        Object.values(card?.description || {})?.length < Object.values(card?.images || {})?.length) ||
                    (imageIndex === 1 && !showMore[cardIndex])
                        ? "0px"
                        : roundedCorners[cardIndex]?.[imageIndex]
                        ? "30px"
                        : "0px"
                }
            />
        </Box>
    )
}
