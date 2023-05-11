import React, { useState, useMemo } from "react"

import {
    useTheme,
    useColorModeValue,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Text,
} from "@chakra-ui/react"

export default function CardEditor({ windowSize, isOpen, onClose, cardEditorData }) {
    const btnRef = React.useRef(null)

    const customTheme = useTheme()
    const contentBackground = useColorModeValue(customTheme.contentBackground.color.light, customTheme.contentBackground.color.dark)

    return (
        <Modal closeOnOverlayClick={false} onClose={onClose} finalFocusRef={btnRef} isOpen={isOpen} scrollBehavior="inside">
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
            <ModalContent bg={contentBackground} minW="50vw" minH="80vh" maxH={"90vh"} borderRadius={"30px"}>
                <ModalHeader>Edit: {cardEditorData?.name}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text>{cardEditorData?.name}</Text>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={onClose}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
