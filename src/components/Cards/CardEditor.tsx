import React, { useState, useRef } from "react"
import axios from "axios"
import { set } from "lodash"

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
    Textarea,
} from "@chakra-ui/react"

// TODO: Make the renderInput function this parent function
// TODO: Remove InputLabel as a separate component and just use it directly in renderInputElement
const renderInputs = (cardEditorData) => {
    if (!cardEditorData) {
        return { inputs: [], inputRefs: new Map() }
    }

    const inputRefs = new Map()

    const renderInput = (key, value, path) => {
        const renderInputElement = (elementType, ref) => {
            inputRefs.set(path, ref)
            return (
                <>
                    <InputLabel key={path} htmlFor={path}>
                        {path}
                    </InputLabel>
                    {React.cloneElement(elementType, {
                        key: path,
                        ref: ref,
                        placeholder: `Add ${key}...`,
                        defaultValue: value,
                    })}
                </>
            )
        }

        if (typeof value === "object") {
            return Object.entries(value).map(([nestedKey, nestedValue]) =>
                // If it's an object, loop through the children again using this same function
                renderInput(nestedKey, nestedValue, path ? `${path}.${nestedKey}` : nestedKey)
            )
        } else {
            if (key === "id") {
                return renderInputElement(<Input disabled={true} />, React.createRef<HTMLInputElement>())
            } else if (key === "summary" || path.includes("description")) {
                return renderInputElement(<Textarea />, React.createRef<HTMLTextAreaElement>())
            } else {
                return renderInputElement(<Input />, React.createRef<HTMLInputElement>())
            }
        }
    }

    const InputLabel = ({ children, htmlFor }) => {
        const customTheme = useTheme()
        const labelColor = useColorModeValue(customTheme.headingText.color.light, customTheme.headingText.color.dark)
        return (
            <Text as="label" htmlFor={htmlFor} fontSize="lg" fontWeight="bold" color={labelColor} mb="8px" mt="16px" display="block">
                {children}
            </Text>
        )
    }

    const inputs = Object.entries(cardEditorData).map(([key, value]) => renderInput(key, value, key))
    return { inputs, inputRefs }
}

const getUpdatedCardData = (cardData, inputRefs, cardEditorData) => {
    const updatedCardData = cardData.map((card) => {
        if (card.id === cardEditorData?.id) {
            let updatedCard = { ...card }

            inputRefs.forEach((inputRef, key) => {
                const inputValue = inputRef?.current?.value
                const originalValue = key.split(".").reduce((obj, k) => (obj && obj[k] !== undefined ? obj[k] : null), card)

                if (inputValue !== originalValue) {
                    set(updatedCard, key, inputValue)
                }
            })
            return updatedCard
        }
        return card
    })
    return updatedCardData
}

const updateCardData = (cardData, inputRefs, cardEditorData): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
        const updatedCardData = getUpdatedCardData(cardData, inputRefs, cardEditorData)

        try {
            const response = await axios.post("/api/updateData", updatedCardData)
            console.log(response.data.message)
            resolve()
        } catch (error) {
            console.error("Error updating data:", error)
            reject()
        }
    })
}

export default function CardEditor({ windowSize, isOpen, onClose, cardEditorData, cardData }) {
    const { inputs, inputRefs } = renderInputs(cardEditorData)

    const toast = useToast()

    const customTheme = useTheme()
    const contentBackground = useColorModeValue(customTheme.contentBackground.color.light, customTheme.contentBackground.color.dark)

    return (
        <Modal closeOnOverlayClick={false} onClose={onClose} isOpen={isOpen} scrollBehavior="inside">
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
            <ModalContent bg={contentBackground} minW="50vw" minH="80vh" maxH={"90vh"} borderRadius={"30px"}>
                <ModalHeader>Edit: {cardEditorData?.name}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>{inputs}</ModalBody>
                <ModalFooter>
                    <Button
                        onClick={async () => {
                            try {
                                await updateCardData(cardData, inputRefs, cardEditorData)
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
