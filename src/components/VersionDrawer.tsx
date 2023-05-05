import React, { useState, useEffect } from "react"
import { useDisclosure } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faClockRotateLeft,
    faCodeCommit,
    faFile,
    faCirclePlus,
    faCircleMinus,
    faMagnifyingGlass,
    faTimesCircle,
} from "@fortawesome/free-solid-svg-icons"

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
    Input,
    InputGroup,
    InputRightElement,
    IconButton,
    Collapse,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from "@chakra-ui/react"

const CommitCard = ({ commit, message, date, author, diff, currentVersion }) => {
    // This line is used by the dev script build_all_commits.sh so needs to remain here
    // This line also shouldn't be duplicated anywhere in this file, otherwise the script will break
    // TODO: Find a better way to do this
    const router = useRouter()

    // DON'T MODIFY THIS FUNCTION
    // It's used by the dev script build_all_commits.sh
    // TODO: Find a better way to do this
    const handleClick = () => {
        router.push(`/${commit}${router.asPath}`)
    }

    const hoverBackgroundColor = useColorModeValue("gray.100", "gray.700")

    return (
        <Box
            borderRadius="lg"
            padding="3"
            width="100%"
            border={currentVersion == commit ? hoverBackgroundColor : ""}
            borderWidth={currentVersion == commit ? "3px" : "1px"}
            borderColor={currentVersion == commit ? "green" : ""}
            cursor={currentVersion == commit ? "default" : "pointer"}
            onClick={currentVersion == commit ? undefined : handleClick}
            _hover={{
                bg: currentVersion == commit ? "" : hoverBackgroundColor,
            }}
        >
            {currentVersion == commit && (
                <Text align={"center"} fontWeight="bold" borderRadius={"10px"} bg="green" mb={3}>
                    👀 &nbsp; Currently viewing
                </Text>
            )}
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
    const isSSR = typeof window === "undefined"

    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef()
    const router_VersionDrawer = useRouter()

    const [commitHashes, setCommitHashes] = useState([])
    const [currentVersion, setCurrentVersion] = useState("")

    const [showSearch, setShowSearch] = useState(() => {
        if (!isSSR) {
            return window.localStorage.getItem("commitSearch") ? true : false
        }
        return ""
    })
    const [searchText, setSearchText] = useState(() => {
        if (!isSSR) {
            return window.localStorage.getItem("commitSearch") || ""
        }
        return ""
    })

    const hoverBackgroundColor = useColorModeValue("gray.100", "gray.700")

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("/api/commits")
            const data = await response.json()
            setCommitHashes(data)

            const pathMatch = router_VersionDrawer.asPath.substring(1, 8)
            console.log("pathMatch", pathMatch)

            // If the pathMatch is empty, then you're on the latest version
            // The regular expression is needed in case there is additional params in the URL
            if (!pathMatch || !/^[a-f0-9]{7}/.test(pathMatch)) {
                setCurrentVersion("latest")
            } else {
                setCurrentVersion(pathMatch)
            }
        }

        fetchData()
    }, [router_VersionDrawer.asPath])

    useEffect(() => {
        if (!isSSR) {
            if (searchText) {
                window.localStorage.setItem("commitSearch", searchText)
            } else {
                window.localStorage.removeItem("commitSearch")
            }
        }
    }, [searchText])

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
                <DrawerContent bg={useColorModeValue("white", "gray.900")} borderLeftRadius="30px" minW="320px">
                    <DrawerCloseButton mt={2} mr={2} />
                    <DrawerHeader>
                        <Flex>
                            <Code px={3} cursor={"default"} fontSize={"xl"} borderRadius={6}>
                                Select commit
                            </Code>
                            <Box
                                borderWidth="1px"
                                borderRadius="lg"
                                px={3}
                                cursor="pointer"
                                marginLeft={3}
                                _hover={{
                                    bg: useColorModeValue("gray.100", "gray.700"),
                                }}
                                onClick={() => {
                                    setSearchText("")
                                    setShowSearch(!showSearch)
                                }}
                            >
                                <FontAwesomeIcon icon={faMagnifyingGlass} size="sm" />
                            </Box>
                        </Flex>
                        <Collapse in={Boolean(showSearch)}>
                            <InputGroup mt={3} borderRadius="lg">
                                <Input placeholder="Search commit messages..." value={searchText} onChange={(e) => setSearchText(e.target.value)} />
                                {searchText && (
                                    <InputRightElement>
                                        <IconButton
                                            icon={<FontAwesomeIcon icon={faTimesCircle} />}
                                            variant="ghost"
                                            onClick={() => setSearchText("")}
                                            aria-label="Clear search"
                                        />
                                    </InputRightElement>
                                )}
                            </InputGroup>
                        </Collapse>
                    </DrawerHeader>

                    <DrawerBody>
                        <VStack spacing={4}>
                            <Box
                                borderRadius="lg"
                                paddingX="3"
                                paddingY="2"
                                border={currentVersion == "latest" ? hoverBackgroundColor : ""}
                                borderWidth={currentVersion == "latest" ? "3px" : "1px"}
                                borderColor={currentVersion == "latest" ? "green" : ""}
                                cursor={currentVersion == "latest" ? "default" : "pointer"}
                                width="100%"
                                _hover={{
                                    bg: currentVersion == "latest" ? "" : hoverBackgroundColor,
                                }}
                                onClick={async () => {
                                    if (currentVersion !== "latest") {
                                        const pathAfterCommit = router_VersionDrawer.asPath.substring(8)
                                        await router_VersionDrawer.push(`${pathAfterCommit}`)
                                        router_VersionDrawer.reload()
                                    }
                                }}
                            >
                                <Text fontWeight="bold" fontSize="lg">
                                    {currentVersion == "latest" ? "👀 \u00A0 Viewing latest version" : "⭐️ \u00A0 Latest version"}
                                </Text>
                            </Box>
                            {commitHashes
                                .filter(({ message }) => message.toLowerCase().includes(searchText.toLowerCase()))
                                .map(({ hash, message, date, author, diff }) => (
                                    <CommitCard
                                        key={hash}
                                        commit={hash}
                                        message={message}
                                        date={date}
                                        author={author}
                                        diff={diff}
                                        currentVersion={currentVersion}
                                    />
                                ))}
                            {commitHashes.toString() &&
                                commitHashes.filter(({ message }) => message.toLowerCase().includes(searchText.toLowerCase())).toString() == "" && (
                                    <VStack spacing={0}>
                                        <Text fontSize={"xx-large"}>🧐</Text>
                                        <Text>No commits found for search query</Text>
                                    </VStack>
                                )}
                            {!commitHashes.toString() && (
                                <VStack spacing={5}>
                                    <VStack spacing={0}>
                                        <Text fontSize={"xx-large"}>🚧</Text>
                                        <Text>No commits returned from API</Text>
                                    </VStack>
                                    <Alert status="info" flexDirection="column" alignItems="flex-start" borderRadius={15}>
                                        <HStack pb={4}>
                                            <AlertIcon />
                                            <AlertTitle fontSize="lg">Server Info</AlertTitle>
                                        </HStack>
                                        <AlertDescription>
                                            <Text>
                                                Run <Code>yarn commits</Code> to build all commit versions before starting the dev server.
                                            </Text>
                                            <Text pt={3}>
                                                Run <Code>yarn dev-commits</Code> to build all commit versions and automatically start the dev server.
                                            </Text>
                                        </AlertDescription>
                                    </Alert>
                                </VStack>
                            )}
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}
