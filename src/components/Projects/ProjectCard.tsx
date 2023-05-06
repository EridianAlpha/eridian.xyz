import React from "react"

import { useTheme, useColorModeValue, Card, CardHeader, Heading, Text, CardBody, CardFooter, Image, Flex, Stack } from "@chakra-ui/react"

const ProjectCardSmall = ({ project, windowSize }) => {
    const customTheme = useTheme()

    return (
        <Card
            maxW={"100%"}
            bg={useColorModeValue(customTheme.contentBackground.color.light, customTheme.contentBackground.color.dark)}
            overflow="hidden"
            variant="outline"
            borderRadius={"30px"}
            borderWidth={0}
        >
            <Flex alignItems="center" justifyContent="center" flexDirection={{ base: "column", md: "row" }} width={"100%"}>
                <Stack flexGrow={1} width="100%">
                    {/* TODO: Make this better */}
                    {project?.images?.[0] && (
                        <Image
                            objectFit="cover"
                            maxW={{ base: "100px" }}
                            src="./481368551588.png"
                            alt="Eridian Avatar"
                            // borderBottomRadius={{ base: "0px", sm: "30px", md: "30px" }}
                            borderTopRightRadius={{ base: "0px" }}
                            borderBottomRightRadius={{ base: "30px" }}
                            borderBottomLeftRadius={{ base: "0px" }}
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
        </Card>
    )
}

const ProjectCardMedium = ({ project, windowSize }) => {
    const customTheme = useTheme()

    return (
        <Card
            maxW={"100%"}
            bg={useColorModeValue(customTheme.contentBackground.color.light, customTheme.contentBackground.color.dark)}
            overflow="hidden"
            variant="outline"
            borderRadius={"30px"}
            borderWidth={0}
        >
            <Flex alignItems="center" justifyContent="center" flexDirection={"column"} width={"100%"}>
                <Stack flexGrow={1} align="center">
                    {/* TODO: Make this better */}
                    {project?.images?.[0] && (
                        <Image
                            objectFit="cover"
                            maxW={{ base: "100%", sm: "200px", md: "280px" }}
                            src="./481368551588.png"
                            alt="Eridian Avatar"
                            borderBottomRadius={{ base: "0px", sm: "30px" }}
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
        </Card>
    )
}

const ProjectCardLarge = ({ project, windowSize }) => {
    const customTheme = useTheme()

    return (
        <Card
            maxW={"100%"}
            bg={useColorModeValue(customTheme.contentBackground.color.light, customTheme.contentBackground.color.dark)}
            overflow="hidden"
            variant="outline"
            borderRadius={"30px"}
            borderWidth={0}
        >
            <Flex alignItems="center" justifyContent="center" flexDirection={{ base: "column", md: "row" }} width={"100%"}>
                <Stack flexGrow={1} align="center">
                    {/* TODO: Make this better */}
                    {project?.images?.[0] && (
                        <Image
                            objectFit="cover"
                            maxW={{ base: "100%", sm: "200px", md: "280px" }}
                            src="./481368551588.png"
                            alt="Eridian Avatar"
                            borderBottomRadius={{ base: "0px", sm: "30px" }}
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
                            objectFit="cover"
                            maxW={{ base: "100%", sm: "200px", md: "280px" }}
                            src="./481368551588.png"
                            alt="Eridian Avatar"
                            borderTopRadius={{ base: "0px", sm: "30px" }}
                        />
                    )}
                </Stack>
            </Flex>
        </Card>
    )
}

export default function ProjectCard({ project, windowSize }) {
    const customTheme = useTheme()
    return (
        <>
            {project.displayConfig.cardSize == "small" && <ProjectCardSmall project={project} windowSize={windowSize} />}
            {project.displayConfig.cardSize == "medium" && <ProjectCardMedium project={project} windowSize={windowSize} />}
            {project.displayConfig.cardSize == "large" && <ProjectCardLarge project={project} windowSize={windowSize} />}
        </>
    )
}
