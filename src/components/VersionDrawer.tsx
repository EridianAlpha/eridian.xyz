import React, { useState, useEffect } from "react"
import { useDisclosure } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClockRotateLeft } from "@fortawesome/free-solid-svg-icons"

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
} from "@chakra-ui/react"

const CommitCard = ({ commit, message, date }) => {
    const router = useRouter()

    const handleClick = () => {
        router.push(`/${commit}${router.asPath}`)
    }

    return (
        <Box
            borderWidth="1px"
            borderRadius="lg"
            padding="4"
            cursor="pointer"
            width="100%"
            _hover={{
                bg: useColorModeValue("gray.100", "gray.700"),
            }}
            onClick={handleClick}
        >
            <Text fontWeight="bold">{commit}</Text>
            <Text>{message}</Text>
            <Text fontSize="sm" color="gray.500">
                {date.split(" (")[0]}
                <br />({date.split(" (")[1]})
            </Text>
        </Box>
    )
}

export default function VersionDrawer() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef()

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
                height="50px"
                borderTopLeftRadius="10px"
                backgroundColor={useColorModeValue("gray.100", "#1B2236")}
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
                    <DrawerCloseButton />
                    <DrawerHeader>Select commit</DrawerHeader>

                    <DrawerBody>
                        <VStack spacing={4}>
                            {commitHashes.map(({ hash, message, date }) => (
                                <CommitCard key={hash} commit={hash} message={message} date={date} />
                            ))}
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}
