import React, { useState, useEffect, useRef } from "react"

import { useTheme, useColorModeValue, Card, CardHeader, Heading, Text, CardBody, CardFooter, Image, Flex, Stack, HStack } from "@chakra-ui/react"

export default function CardSmall({ cardData, windowSize, cardRef }) {
    return (
        <Flex alignItems="center" justifyContent="center" flexDirection={{ base: "column", md: "row" }} width={"100%"}>
            <Stack flexGrow={1} width="100%">
                <HStack>
                    {cardData?.images?.[0] && (
                        <Image
                            objectFit="cover"
                            width="100px"
                            height="100px"
                            src={cardData?.images?.[0].image}
                            alt={cardData?.images?.[0].alt}
                            borderTopRightRadius={{ base: "0px" }}
                            borderBottomRightRadius={{ base: "30px" }}
                            borderBottomLeftRadius={{ base: "0px" }}
                        />
                    )}
                    <CardHeader>
                        <Heading size="md">{cardData.name}</Heading>
                    </CardHeader>
                </HStack>
                <CardBody>
                    <Text>{cardData.description}</Text>
                </CardBody>
                <CardFooter>{/* <Button>View here</Button> */}</CardFooter>
            </Stack>
        </Flex>
    )
}
