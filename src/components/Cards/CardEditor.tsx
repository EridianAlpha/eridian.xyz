import React, { useState, useRef } from "react"
import axios from "axios"

import {
    useTheme,
    useToast,
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

const updateCardData = (cardData, cardEditorData, input1Ref): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
        if (input1Ref?.current?.value != cardEditorData?.name) {
            const updatedCardData = cardData.map((card) => {
                if (card.name === cardEditorData?.name) {
                    return { ...card, name: input1Ref?.current.value }
                }
                return card
            })

            try {
                const response = await axios.post("/api/updateData", updatedCardData)
                console.log(response.data.message)
                resolve()
            } catch (error) {
                console.error("Error updating data:", error)
                reject()
            }
        } else {
            resolve()
        }
    })
}

export default function CardEditor({ windowSize, isOpen, onClose, cardEditorData, cardData }) {
    const input1Ref = useRef(null)

    const toast = useToast()

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
                        onClick={async () => {
                            try {
                                await updateCardData(cardData, cardEditorData, input1Ref)
                                onClose()
                            } catch (error) {
                                toast({
                                    title: "Error saving data",
                                    status: "error",
                                    isClosable: true,
                                    position: "top",
                                    description: error || "Unknown error 😞 Please try again later.",
                                    duration: 3000,
                                })
                                console.error("Error saving data:", error)
                            }
                        }}
                    >
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
