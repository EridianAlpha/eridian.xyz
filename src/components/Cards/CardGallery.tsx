import React, { useState, useEffect, useRef } from "react"
import cardData from "../../../public/data/cardData.json"
import Masonry from "react-masonry-css"

import { useTheme, useColorModeValue, Card, Box } from "@chakra-ui/react"

import CardSmall from "./CardSmall"
import CardMedium from "./CardMedium"
import CardLarge from "./CardLarge"

export default function CardGallery({ windowSize }) {
    const cardRef = useRef<HTMLDivElement>(null)

    const breakpointCols = {
        default: 3, // 3 columns on large screens
        1400: 2, // 2 columns on medium screens
        700: 1, // 1 column on small screens
    }

    const CardTheme = ({ children, cardRef }) => {
        const customTheme = useTheme()

        return (
            <Card
                ref={cardRef}
                maxW={"100%"}
                bg={useColorModeValue(customTheme.contentBackground.color.light, customTheme.contentBackground.color.dark)}
                overflow="hidden"
                variant="outline"
                borderRadius={"30px"}
                borderWidth={0}
            >
                {children}
            </Card>
        )
    }

    return (
        <Box width="100%">
            <Masonry breakpointCols={breakpointCols} className="my-masonry-grid" columnClassName="my-masonry-grid_column">
                {cardData.map((cardData, index) => (
                    <CardTheme key={index} cardRef={cardRef}>
                        {cardData?.displayConfig.cardSize == "small" && <CardSmall cardData={cardData} windowSize={windowSize} cardRef={cardRef} />}
                        {cardData?.displayConfig.cardSize == "medium" && <CardMedium cardData={cardData} windowSize={windowSize} cardRef={cardRef} />}
                        {cardData?.displayConfig.cardSize == "large" && <CardLarge cardData={cardData} windowSize={windowSize} cardRef={cardRef} />}
                    </CardTheme>
                ))}
            </Masonry>
        </Box>
    )
}
