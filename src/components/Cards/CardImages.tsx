import React, { useState, useEffect, useRef } from "react"
import { Box, Image } from "@chakra-ui/react"

export default function CardImages({
    windowSize,
    cardIndex,
    imageIndex,
    image,
    imageArray,
    cardRefs,
    imageRefs,
    sortedCardData,
    showMore,
}: {
    windowSize: { width: number; height: number }
    cardIndex: number
    imageIndex: number
    image: { image: string; alt: string }
    imageArray: Array<{ image: string; alt: string }>
    cardRefs: Array<React.RefObject<HTMLDivElement>>
    imageRefs: Array<Array<React.RefObject<HTMLImageElement>>>
    sortedCardData: Array<any>
    showMore: Array<boolean>
}) {
    const [roundedCorners, setRoundedCorners] = useState(
        sortedCardData.map((_, index) => Object.values(sortedCardData[index].images || {}).map(() => false))
    )

    useEffect(() => {
        const newRoundedCorners = sortedCardData.map((card, cardIndex) =>
            Object.values(card?.images || {})
                .slice(1)
                .map((_, imageIndex) => {
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
    }, [windowSize.width, imageRefs, sortedCardData, roundedCorners, cardRefs])

    return (
        <Box width="100%" display="flex" alignItems="center" justifyContent="center">
            <Image
                ref={imageRefs[cardIndex][imageIndex]}
                key={imageIndex}
                objectFit="contain"
                maxH={"30vh"}
                src={image.image}
                alt={image.alt}
                borderTopRadius={
                    imageIndex === imageArray.length - 1 && roundedCorners[cardIndex][imageIndex]
                        ? "30px"
                        : roundedCorners[cardIndex][imageIndex]
                        ? "30px"
                        : "0px"
                }
                borderBottomRadius={
                    imageIndex === imageArray.length - 1 || (imageIndex === 2 && !showMore[cardIndex])
                        ? "0px"
                        : roundedCorners[cardIndex][imageIndex]
                        ? "30px"
                        : "0px"
                }
            />
        </Box>
    )
}
