import {
    Container,
    Box,
    Flex,
    HStack,
    IconButton,
    useColorModeValue,
    Image,
    Card,
    Stack,
    CardBody,
    Heading,
    CardFooter,
    Text,
    Button,
    VStack,
    Divider,
} from "@chakra-ui/react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faMoneyBill,
    faServer,
    faImage,
    faLaptopCode,
    faCodeFork,
    faHouseChimney,
} from "@fortawesome/free-solid-svg-icons"

import Link from "next/link"

export default function Header({ windowSize }) {
    const isSSR = typeof window === "undefined"

    return (
        <>
            <Container bg={useColorModeValue("white", "gray.900")} maxW="1200px" padding={5}>
                <Card
                    direction={{ base: "column", md: "row" }}
                    overflow="hidden"
                    variant="outline"
                    borderRadius={"30px"}
                    borderColor={useColorModeValue("gray.700", "white")}
                    borderWidth={1}
                >
                    <Flex
                        alignItems="center"
                        justifyContent="center"
                        flexDirection={{ base: "column", md: "row" }}
                    >
                        <Image
                            objectFit="cover"
                            maxW={{ base: "100%", sm: "200px", md: "280px" }}
                            src="./481368551588.png"
                            alt="Eridian Avatar"
                            borderBottomRadius={{ base: "0px", sm: "30px", md: "30px" }}
                            borderTopRightRadius={{ base: "0px", sm: "0px", md: "30px" }}
                            borderBottomRightRadius={{ base: "0px", sm: "30px", md: "30px" }}
                            borderBottomLeftRadius={{ base: "0px", sm: "30px", md: "00px" }}
                        />

                        <Stack>
                            <CardBody>
                                <Flex
                                    direction={"row"}
                                    wrap={"wrap"}
                                    justifyContent={"space-between"}
                                    alignItems={"baseline"}
                                >
                                    <Heading size="xl" pr="30px">
                                        Eridian.eth
                                    </Heading>
                                    <HStack py="15px">
                                        <Text as="b">Journey Started:</Text>
                                        <Text>April 2021</Text>
                                        {/* TODO calculate "(x Days ago)"" number to dynamically update */}
                                    </HStack>
                                </Flex>
                                <Text>
                                    This website is public tracker of all the projects and ideas
                                    I've worked and currently work on in the Ethereum ecosystem.
                                </Text>
                                <VStack pt="20px">
                                    <Divider borderColor={useColorModeValue("gray.700", "white")} />
                                    <Heading fontSize={"xl"} py="10px">
                                        Current Areas of Focus
                                    </Heading>
                                    <Flex
                                        flexDirection={"row"}
                                        wrap={"wrap"}
                                        columnGap={"20px"}
                                        rowGap={"20px"}
                                        justifyContent={"space-around"}
                                    >
                                        {/* TODO Make into a variable, pass in the name, color, icon and amount */}
                                        <VStack>
                                            <Heading fontSize={"md"}>Staking</Heading>
                                            <HStack spacing={1}>
                                                <FontAwesomeIcon
                                                    icon={faServer}
                                                    size={"lg"}
                                                    color={"blue"}
                                                />
                                                <FontAwesomeIcon
                                                    icon={faServer}
                                                    size={"lg"}
                                                    color={"blue"}
                                                />
                                                <FontAwesomeIcon
                                                    icon={faServer}
                                                    size={"lg"}
                                                    color={"blue"}
                                                />
                                                <FontAwesomeIcon
                                                    icon={faServer}
                                                    size={"lg"}
                                                    color={"blue"}
                                                />
                                                <FontAwesomeIcon
                                                    icon={faServer}
                                                    size={"lg"}
                                                    color={"blue"}
                                                />
                                            </HStack>
                                        </VStack>
                                        <VStack>
                                            <Heading fontSize={"md"}>DeFi</Heading>
                                            <HStack spacing={1}>
                                                <FontAwesomeIcon
                                                    icon={faMoneyBill}
                                                    size={"lg"}
                                                    color={"green"}
                                                />
                                                <FontAwesomeIcon
                                                    icon={faMoneyBill}
                                                    size={"lg"}
                                                    color={"green"}
                                                />
                                                <FontAwesomeIcon
                                                    icon={faMoneyBill}
                                                    size={"lg"}
                                                    color={"green"}
                                                />
                                                <FontAwesomeIcon
                                                    icon={faMoneyBill}
                                                    size={"lg"}
                                                    color={"green"}
                                                />
                                                <FontAwesomeIcon
                                                    icon={faMoneyBill}
                                                    size={"lg"}
                                                    color={"gray"}
                                                    opacity="0.3"
                                                />
                                            </HStack>
                                        </VStack>
                                        <VStack>
                                            <Heading fontSize={"md"}>NFTs</Heading>
                                            <HStack spacing={1}>
                                                <FontAwesomeIcon
                                                    icon={faImage}
                                                    size={"lg"}
                                                    color={"gray"}
                                                    opacity="0.3"
                                                />
                                                <FontAwesomeIcon
                                                    icon={faImage}
                                                    size={"lg"}
                                                    color={"gray"}
                                                    opacity="0.3"
                                                />
                                                <FontAwesomeIcon
                                                    icon={faImage}
                                                    size={"lg"}
                                                    color={"gray"}
                                                    opacity="0.3"
                                                />
                                                <FontAwesomeIcon
                                                    icon={faImage}
                                                    size={"lg"}
                                                    color={"gray"}
                                                    opacity="0.3"
                                                />
                                                <FontAwesomeIcon
                                                    icon={faImage}
                                                    size={"lg"}
                                                    color={"gray"}
                                                    opacity="0.3"
                                                />
                                            </HStack>
                                        </VStack>
                                        <VStack>
                                            <Heading fontSize={"md"}>Solidity</Heading>
                                            <HStack spacing={1}>
                                                <FontAwesomeIcon
                                                    icon={faLaptopCode}
                                                    size={"lg"}
                                                    color={"red"}
                                                />
                                                <FontAwesomeIcon
                                                    icon={faLaptopCode}
                                                    size={"lg"}
                                                    color={"gray"}
                                                    opacity="0.3"
                                                />
                                                <FontAwesomeIcon
                                                    icon={faLaptopCode}
                                                    size={"lg"}
                                                    color={"gray"}
                                                    opacity="0.3"
                                                />
                                                <FontAwesomeIcon
                                                    icon={faLaptopCode}
                                                    size={"lg"}
                                                    color={"gray"}
                                                    opacity="0.3"
                                                />
                                                <FontAwesomeIcon
                                                    icon={faLaptopCode}
                                                    size={"lg"}
                                                    color={"gray"}
                                                    opacity="0.3"
                                                />
                                            </HStack>
                                        </VStack>
                                        <VStack>
                                            <Heading fontSize={"md"}>L2s</Heading>
                                            <HStack spacing={1}>
                                                <FontAwesomeIcon
                                                    icon={faCodeFork}
                                                    size={"lg"}
                                                    color={"yellow"}
                                                />
                                                <FontAwesomeIcon
                                                    icon={faCodeFork}
                                                    size={"lg"}
                                                    color={"gray"}
                                                    opacity="0.3"
                                                />
                                                <FontAwesomeIcon
                                                    icon={faCodeFork}
                                                    size={"lg"}
                                                    color={"gray"}
                                                    opacity="0.3"
                                                />
                                                <FontAwesomeIcon
                                                    icon={faCodeFork}
                                                    size={"lg"}
                                                    color={"gray"}
                                                    opacity="0.3"
                                                />
                                                <FontAwesomeIcon
                                                    icon={faCodeFork}
                                                    size={"lg"}
                                                    color={"gray"}
                                                    opacity="0.3"
                                                />
                                            </HStack>
                                        </VStack>
                                        <VStack>
                                            <Heading fontSize={"md"}>Personal Life</Heading>
                                            <HStack spacing={1}>
                                                <FontAwesomeIcon
                                                    icon={faHouseChimney}
                                                    size={"lg"}
                                                    color={"purple"}
                                                />
                                                <FontAwesomeIcon
                                                    icon={faHouseChimney}
                                                    size={"lg"}
                                                    color={"purple"}
                                                />
                                                <FontAwesomeIcon
                                                    icon={faHouseChimney}
                                                    size={"lg"}
                                                    color={"gray"}
                                                    opacity="0.3"
                                                />
                                                <FontAwesomeIcon
                                                    icon={faHouseChimney}
                                                    size={"lg"}
                                                    color={"gray"}
                                                    opacity="0.3"
                                                />
                                                <FontAwesomeIcon
                                                    icon={faHouseChimney}
                                                    size={"lg"}
                                                    color={"gray"}
                                                    opacity="0.3"
                                                />
                                            </HStack>
                                        </VStack>
                                    </Flex>
                                </VStack>
                            </CardBody>
                        </Stack>
                    </Flex>
                </Card>
                <Box></Box>
            </Container>
        </>
    )
}
