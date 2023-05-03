import React, { useState, useEffect } from "react"
import { useDisclosure } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClockRotateLeft, faCodeCommit, faFile, faCirclePlus, faCircleMinus } from "@fortawesome/free-solid-svg-icons"

import {
    Box,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    useColorModeValue,
    VStack,
    Text,
    Code,
    Flex,
    HStack,
} from "@chakra-ui/react"

const CommitCard = ({ commit, message, date, author, diff }) => {
    const router = useRouter()

    const handleClick = () => {
        router.push(`/${commit}${router.asPath}`)
    }

    return (
        <Box
            borderWidth="1px"
            borderRadius="lg"
            padding="3"
            cursor="pointer"
            width="100%"
            _hover={{
                bg: useColorModeValue("gray.100", "gray.700"),
            }}
            onClick={handleClick}
        >
            <Flex alignItems="center" pb={1} gap={3} justifyContent={"space-between"}>
                <Flex alignItems="center">
                    <Box as="span" pr={2}>
                        <FontAwesomeIcon icon={faCodeCommit} />
                    </Box>
                    <Code fontWeight="bold">{commit}</Code>
                </Flex>
                <DiffStats diff={diff} />
            </Flex>
            <Text fontWeight="bold" fontSize="lg" pb={1}>
                {message}
            </Text>
            <Flex justifyContent={"space-between"}>
                <Text fontSize="sm" color="gray.500">
                    {date.split(" (")[0]}
                    <br />({date.split(" (")[1].slice(0, -1)})
                </Text>
                <Text fontSize="sm" color="gray.500">
                    {author}
                </Text>
            </Flex>
        </Box>
    )
}

const DiffStats = ({ diff }) => {
    const regex = /(\d+)\sfiles\schanged,\s(\d+)\sinsertions\(\+\),\s(\d+)\sdeletions\(-\)/
    const match = diff.match(regex)
    const filesChanged = match ? parseInt(match[1], 10) : 0
    const insertions = match ? parseInt(match[2], 10) : 0
    const deletions = match ? parseInt(match[3], 10) : 0

    return (
        <HStack spacing={3}>
            <HStack>
                <Text fontSize="small">{filesChanged}</Text>
                <FontAwesomeIcon icon={faFile} size={"sm"} />
            </HStack>
            <HStack>
                <Text fontSize="small" color="green.500">
                    {insertions}
                </Text>
                <FontAwesomeIcon icon={faCirclePlus} size={"sm"} color="green" />
            </HStack>
            <HStack>
                <Text fontSize="small" color="red.500">
                    {deletions}
                </Text>
                <FontAwesomeIcon icon={faCircleMinus} size={"sm"} color="red" />
            </HStack>
        </HStack>
    )
}

export default function VersionDrawer({ windowSize }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef()
    const router_VersionDrawer = useRouter()

    const [commitHashes, setCommitHashes] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("/api/commits")
            const data = await response.json()
            setCommitHashes(data)
        }

        fetchData()
    }, [])

    return (
        <>
            <Box
                as="button"
                position="fixed"
                bottom="0"
                right="0"
                width="50px"
                height={windowSize.width > 1500 ? "100vh" : "50px"}
                borderTopLeftRadius={windowSize.width > 1500 ? "30px" : "20px"}
                borderBottomLeftRadius={windowSize.width > 1500 ? "30px" : "0px"}
                backgroundColor={useColorModeValue("gray.100", "#1B2236")}
                borderColor={windowSize.width > 500 ? "transparent" : "gray"}
                borderLeftWidth={windowSize.width > 500 ? "0px" : "1px"}
                borderTopWidth={windowSize.width > 500 ? "0px" : "1px"}
                _hover={{
                    backgroundColor: useColorModeValue("gray.200", "gray.700"),
                    cursor: "pointer",
                }}
                onClick={onOpen}
                zIndex="modal"
            >
                <FontAwesomeIcon icon={faClockRotateLeft} size={"xl"} />
            </Box>
            <Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef}>
                <DrawerOverlay />
                <DrawerContent bg={useColorModeValue("white", "gray.900")} borderLeftRadius="30px">
                    <DrawerCloseButton mt={2} mr={2} />
                    <DrawerHeader>
                        <Code fontSize={"xl"} borderRadius={6}>
                            Select commit
                        </Code>
                    </DrawerHeader>

                    <DrawerBody>
                        <VStack spacing={4}>
                            <Box
                                borderWidth="1px"
                                borderRadius="lg"
                                padding="3"
                                cursor="pointer"
                                width="100%"
                                _hover={{
                                    bg: useColorModeValue("gray.100", "gray.700"),
                                }}
                                onClick={() => router_VersionDrawer.push("/")}
                            >
                                <Text fontWeight="bold" fontSize="lg">
                                    Latest version
                                </Text>
                            </Box>
                            {commitHashes.map(({ hash, message, date, author, diff }) => (
                                <CommitCard key={hash} commit={hash} message={message} date={date} author={author} diff={diff} />
                            ))}
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}
