import React, { useState, useRef } from "react"
import axios from "axios"

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
    Input,
} from "@chakra-ui/react"

const updateCardData = (cardData, cardEditorData, input1Ref) => {
    if (input1Ref?.current?.value != cardEditorData?.name) {
        const updatedCardData = cardData.map((card) => {
            if (card.name === cardEditorData?.name) {
                return { ...card, name: input1Ref?.current.value }
            }
            return card
        })

        // Send a POST request to the updateData API route
        axios
            .post("/api/updateData", updatedCardData)
            .then((response) => {
                console.log(response.data.message)
            })
            .catch((error) => {
                console.error("Error updating data:", error)
            })
    }
}

export default function CardEditor({ windowSize, isOpen, onClose, cardEditorData, cardData }) {
    // const btnRef = React.useRef(null)
    const input1Ref = React.useRef(null)

    const customTheme = useTheme()
    const contentBackground = useColorModeValue(customTheme.contentBackground.color.light, customTheme.contentBackground.color.dark)

    return (
        <Modal closeOnOverlayClick={false} onClose={onClose} isOpen={isOpen} scrollBehavior="inside">
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
            <ModalContent bg={contentBackground} minW="50vw" minH="80vh" maxH={"90vh"} borderRadius={"30px"}>
                <ModalHeader>Edit: {cardEditorData?.name}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Input ref={input1Ref} placeholder="Add title..." defaultValue={cardEditorData?.name} />
                </ModalBody>
                <ModalFooter>
                    <Button
                        onClick={() => {
                            updateCardData(cardData, cardEditorData, input1Ref)
                            // TODO: Add a check here to only close if it successfully saves
                            onClose()
                        }}
                    >
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
