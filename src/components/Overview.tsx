import {
    useTheme,
    Container,
    Flex,
    HStack,
    useColorModeValue,
    Image,
    Card,
    Stack,
    CardBody,
    Heading,
    Text,
    VStack,
    Divider,
    Link,
} from "@chakra-ui/react"

import focusAreasDataImport from "../../public/data/focusAreas.json"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMoneyBill, faServer, faImage, faRobot, faCircleUp, faNetworkWired } from "@fortawesome/free-solid-svg-icons"

const focusAreaIconMapping = {
    faServer,
    faMoneyBill,
    faImage,
    faRobot,
    faCircleUp,
    faNetworkWired,
}

import NextLink from "next/link"

export default function Overview() {
    const customTheme = useTheme()

    const focusAreasData = focusAreasDataImport.map((item) => ({
        ...item,
        icon: focusAreaIconMapping[item.icon],
    }))

    return (
        <>
            <Container
                bg={useColorModeValue(customTheme.pageBackground.light, customTheme.pageBackground.dark)}
                maxW="1200px"
                py={5}
                px={{ base: 0, lg: 5 }}
                pb={"50px"}
            >
                <Card
                    direction={{ base: "column", lg: "row" }}
                    overflow="hidden"
                    variant="outline"
                    borderRadius={"30px"}
                    borderWidth={0}
                    bg={useColorModeValue(customTheme.contentBackground.color.light, customTheme.contentBackground.color.dark)}
                >
                    <Flex alignItems="center" justifyContent="center" flexDirection={{ base: "column", lg: "row" }} width={"100%"}>
                        <Image
                            objectFit="cover"
                            maxW={{ base: "100%", md: "300px", lg: "350px", xl: "410px" }}
                            src="./Eridian.webp"
                            alt="Eridian Avatar"
                            borderBottomRadius={{ base: "0px", sm: "30px", lg: "30px" }}
                            borderTopRightRadius={{ base: "0px", sm: "0px", lg: "30px" }}
                            borderBottomRightRadius={{ base: "0px", sm: "30px", lg: "30px" }}
                            borderBottomLeftRadius={{ base: "0px", sm: "30px", lg: "0px" }}
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
                                <VStack alignItems={"start"} gap={1}>
                                    <Text fontWeight={"bold"}>Full-Stack Ethereum Developer 💻</Text>
                                    <Text>
                                        Hey 👋 I&apos;m Eridian and I&apos;m a full-stack Ethereum developer. I have experience in Ethereum staking,
                                        web app design and coding, educational content, writing Solidity smart contracts, community creation,
                                        incentives and rewards programs. This portfolio website shows my projects, skills, and experiences since I
                                        joined the Ethereum community.
                                    </Text>
                                    <Text>
                                        I&apos;m always exploring new projects so reach out to me on{" "}
                                        <Link as={NextLink} href={"https://t.me/eridianalpha"} textDecoration={"underline"} target="_blank">
                                            TG
                                        </Link>{" "}
                                        or{" "}
                                        <Link as={NextLink} href={"https://x.com/EridianAlpha"} textDecoration={"underline"} target="_blank">
                                            X
                                        </Link>{" "}
                                        if you want to connect!
                                    </Text>
                                </VStack>
                                <VStack pt="20px">
                                    <Divider borderColor={useColorModeValue("gray.700", "gray.100")} />
                                    <Heading
                                        color={useColorModeValue(customTheme.headingText.color.light, customTheme.headingText.color.dark)}
                                        fontSize={"xl"}
                                        py="10px"
                                    >
                                        Current Areas of Focus
                                    </Heading>
                                    <Flex
                                        flexDirection={"row"}
                                        wrap={"wrap"}
                                        columnGap={"20px"}
                                        rowGap={"20px"}
                                        justifyContent={"space-around"}
                                        w={"100%"}
                                    >
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
