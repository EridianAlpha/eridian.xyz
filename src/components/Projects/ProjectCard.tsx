import React, { useState, useEffect, useRef } from "react"

import { useTheme, useColorModeValue, Card, CardHeader, Heading, Text, CardBody, CardFooter, Image, Flex, Stack, HStack } from "@chakra-ui/react"

const StandardCard = ({ children, cardRef }) => {
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

const ProjectCardSmall = ({ project, windowSize, cardRef }) => {
    return (
        <Flex alignItems="center" justifyContent="center" flexDirection={{ base: "column", md: "row" }} width={"100%"}>
            <Stack flexGrow={1} width="100%">
                <HStack>
                    {project?.images?.[0] && (
                        <Image
                            objectFit="cover"
                            // maxW={{ base: "100px" }}
                            // maxH="100px"
                            // maxW="100px"
                            width="100px"
                            height="100px"
                            src={project?.images?.[0].image}
                            alt={project?.images?.[0].alt}
                            borderTopRightRadius={{ base: "0px" }}
                            borderBottomRightRadius={{ base: "30px" }}
                            borderBottomLeftRadius={{ base: "0px" }}
                        />
                    )}
                    <CardHeader>
                        <Heading size="md">{project.name}</Heading>
                    </CardHeader>
                </HStack>

                <CardBody>
                    <Text>{project.description}</Text>
                </CardBody>
                <CardFooter>{/* <Button>View here</Button> */}</CardFooter>
            </Stack>
        </Flex>
    )
}

const ProjectCardMedium = ({ project, windowSize, cardRef }) => {
    const imageRef = useRef<HTMLImageElement>(null)
    const [roundedCorners, setRoundedCorners] = useState(false)

    useEffect(() => {
        if (cardRef.current && imageRef.current) {
            const cardWidth = cardRef.current.offsetWidth
            const imageWidth = imageRef.current.offsetWidth
            setRoundedCorners(cardWidth - 1 > imageWidth)
        }
    }, [windowSize.width])
    return (
        <Flex alignItems="center" justifyContent="center" flexDirection={"column"} width={"100%"}>
            <Stack flexGrow={1} align="center">
                {project?.images?.[0] && (
                    <Image
                        ref={imageRef}
                        objectFit="cover"
                        maxH={"30vh"}
                        src={project?.images?.[0].image}
                        alt={project?.images?.[0].alt}
                        borderBottomRadius={roundedCorners ? "30px" : "0px"}
                    />
                )}
                <CardHeader>
                    <Heading size="md">{project.name}</Heading>
                </CardHeader>
                <CardBody>
                    <Text>{project.description}</Text>
                </CardBody>
                <CardFooter>{/* <Button>View here</Button> */}</CardFooter>
            </Stack>
        </Flex>
    )
}

const ProjectCardLarge = ({ project, windowSize, cardRef }) => {
    const imageRefTop = useRef<HTMLImageElement>(null)
    const [roundedCornersTop, setRoundedCornersTop] = useState(false)
    const imageRefBottom = useRef<HTMLImageElement>(null)
    const [roundedCornersBottom, setRoundedCornersBottom] = useState(false)

    useEffect(() => {
        if (cardRef.current && imageRefBottom.current) {
            const cardWidth = cardRef.current.offsetWidth
            const imageWidthBottom = imageRefBottom.current.offsetWidth
            setRoundedCornersBottom(cardWidth - 1 > imageWidthBottom)
        }
        if (cardRef.current && imageRefTop.current) {
            const cardWidth = cardRef.current.offsetWidth
            const imageWidthTop = imageRefTop.current.offsetWidth
            setRoundedCornersTop(cardWidth - 1 > imageWidthTop)
        }
    }, [windowSize.width])

    return (
        <Flex alignItems="center" justifyContent="center" flexDirection={{ base: "column", md: "row" }} width={"100%"}>
            <Stack flexGrow={1} align="center">
                {project?.images?.[0] && (
                    <Image
                        ref={imageRefTop}
                        objectFit="cover"
                        maxH={"30vh"}
                        src={project?.images?.[0].image}
                        alt={project?.images?.[0].alt}
                        borderBottomRadius={roundedCornersTop ? "30px" : "0px"}
                    />
                )}
                <CardHeader>
                    <Heading size="md">{project.name}</Heading>
                </CardHeader>
                <CardBody>
                    <Text>{project.description}</Text>
                </CardBody>
                <CardFooter>{/* <Button>View here</Button> */}</CardFooter>
                {project?.images?.[1] && (
                    <Image
                        ref={imageRefBottom}
                        objectFit="cover"
                        maxH={"30vh"}
                        src={project?.images?.[1].image}
                        alt={project?.images?.[1].alt}
                        borderTopRadius={roundedCornersBottom ? "30px" : "0px"}
                    />
                )}
            </Stack>
        </Flex>
    )
}

export default function ProjectCard({ project, windowSize }) {
    const cardRef = useRef<HTMLDivElement>(null)
    return (
        <>
            {project.displayConfig.cardSize == "small" && (
                <StandardCard cardRef={cardRef}>
                    <ProjectCardSmall project={project} windowSize={windowSize} cardRef={cardRef} />
                </StandardCard>
            )}
            {project.displayConfig.cardSize == "medium" && (
                <StandardCard cardRef={cardRef}>
                    <ProjectCardMedium project={project} windowSize={windowSize} cardRef={cardRef} />
                </StandardCard>
            )}
            {project.displayConfig.cardSize == "large" && (
                <StandardCard cardRef={cardRef}>
                    <ProjectCardLarge project={project} windowSize={windowSize} cardRef={cardRef} />
                </StandardCard>
            )}
        </>
    )
}
