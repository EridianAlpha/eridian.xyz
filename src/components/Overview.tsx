import { useTheme, Container, Flex, HStack, useColorModeValue, Image, Card, Stack, CardBody, Heading, Text, VStack, Divider } from "@chakra-ui/react"

import focusAreasDataImport from "../../public/data/focusAreas.json" // Import the JSON data

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMoneyBill, faServer, faImage, faLaptopCode, faCodeFork } from "@fortawesome/free-solid-svg-icons"

const focusAreaIconMapping = {
    faServer,
    faMoneyBill,
    faImage,
    faLaptopCode,
    faCodeFork,
}

export default function Overview({ windowSize, environment }) {
    const customTheme = useTheme()
    const isSSR = typeof window === "undefined"

    const focusAreasData = focusAreasDataImport.map((item) => ({
        ...item,
        icon: focusAreaIconMapping[item.icon],
    }))

    return (
        <>
            <Container
                bg={useColorModeValue(customTheme.pageBackground.light, customTheme.pageBackground.dark)}
                maxW="1200px"
                padding={5}
                pb={"50px"}
            >
                <Card
                    direction={{ base: "column", md: "row" }}
                    overflow="hidden"
                    variant="outline"
                    borderRadius={"30px"}
                    borderWidth={0}
                    bg={useColorModeValue(customTheme.contentBackground.color.light, customTheme.contentBackground.color.dark)}
                >
                    <Flex alignItems="center" justifyContent="center" flexDirection={{ base: "column", md: "row" }} width={"100%"}>
                        <Image
                            objectFit="cover"
                            maxW={{ base: "100%", sm: "200px", md: "280px" }}
                            src="./481368551588.png"
                            alt="Eridian Avatar"
                            borderBottomRadius={{ base: "0px", sm: "30px", md: "30px" }}
                            borderTopRightRadius={{ base: "0px", sm: "0px", md: "30px" }}
                            borderBottomRightRadius={{ base: "0px", sm: "30px", md: "30px" }}
                            borderBottomLeftRadius={{ base: "0px", sm: "30px", md: "0px" }}
                        />

                        <Stack flexGrow={1}>
                            <CardBody>
                                <Flex direction={"row"} wrap={"wrap"} justifyContent={"space-between"} alignItems={"baseline"}>
                                    <Heading
                                        color={useColorModeValue(customTheme.headingText.color.light, customTheme.headingText.color.dark)}
                                        size="xl"
                                        pr="30px"
                                    >
                                        eridian.eth
                                    </Heading>
                                    <Flex py="25px" flexWrap="wrap" gap="10px">
                                        <Text as="b">🏡 Ethereum Settler:</Text>
                                        <HStack spacing={3}>
                                            <Text>April 2021</Text>
                                            <Text>
                                                ({Math.floor((new Date().getTime() - new Date("2021-04-01").getTime()) / (1000 * 60 * 60 * 24))} days
                                                ago)
                                            </Text>
                                        </HStack>
                                    </Flex>
                                </Flex>
                                <Text>
                                    This website is a public tracker of my past and current Ethereum ecosystem projects and ideas. It is built and
                                    maintained by me using Next.js and Chakra UI, and is deployed on Vercel.
                                    <br />
                                    <br />
                                    It is currently under active development as I try out new design ideas 🏗️
                                </Text>
                                <VStack pt="20px">
                                    <Divider borderColor={useColorModeValue("gray.700", "gray.100")} />
                                    <Heading
                                        color={useColorModeValue(customTheme.headingText.color.light, customTheme.headingText.color.dark)}
                                        fontSize={"xl"}
                                        py="10px"
                                    >
                                        Current Areas of Focus
                                    </Heading>
                                    <Flex flexDirection={"row"} wrap={"wrap"} columnGap={"20px"} rowGap={"20px"} justifyContent={"space-around"}>
                                        {focusAreasData
                                            .sort((a, b) => b.count - a.count)
                                            .map(({ title, icon, color, count }) => (
                                                <VStack key={title}>
                                                    <Heading fontSize={"md"}>{title}</Heading>
                                                    <HStack spacing={1}>
                                                        {Array.from({ length: 5 }).map((_, index) => (
                                                            <FontAwesomeIcon
                                                                key={index}
                                                                icon={icon}
                                                                size={"lg"}
                                                                color={index < count ? color : "gray"}
                                                                opacity={index < count ? "1" : "0.3"}
                                                            />
                                                        ))}
                                                    </HStack>
                                                </VStack>
                                            ))}
                                    </Flex>
                                </VStack>
                            </CardBody>
                        </Stack>
                    </Flex>
                </Card>
            </Container>
        </>
    )
}
