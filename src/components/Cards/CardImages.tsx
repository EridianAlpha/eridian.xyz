import React, { useState, useEffect, useRef } from "react"
import cardData from "../../../public/data/cardData.json"

import { Box, Image } from "@chakra-ui/react"

export default function CardImages({ windowSize, cardIndex, imageIndex, image, imageArray, cardRefs, imageRefs }) {
    const [roundedCorners, setRoundedCorners] = useState(cardData.map((_, index) => Object.values(cardData[index].images || {}).map(() => false)))

    useEffect(() => {
        const newRoundedCorners = cardData.map((card, cardIndex) =>
            Object.values(card?.images || {})
                .slice(1)
                .map((_, imageIndex) => {
                    if (!cardRefs[cardIndex]?.current || !imageRefs[cardIndex][imageIndex]?.current) {
                        return false
                    }
                    const cardWidth = cardRefs[cardIndex].current.offsetWidth
                    const imageWidth = imageRefs[cardIndex][imageIndex].current.offsetWidth
                    return cardWidth - 1 > imageWidth
                })
        )

        if (JSON.stringify(newRoundedCorners) !== JSON.stringify(roundedCorners)) {
            setRoundedCorners(newRoundedCorners)
        }
    }, [windowSize.width, imageRefs, cardData, roundedCorners, cardRefs])

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
                borderBottomRadius={imageIndex === imageArray.length - 1 ? "0px" : roundedCorners[cardIndex][imageIndex] ? "30px" : "0px"}
            />
        </Box>
    )
}
