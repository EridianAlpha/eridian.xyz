import React, { useState } from "react"
import axios from "axios"
import { unset, isEqual } from "lodash"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashCan, faRefresh } from "@fortawesome/free-solid-svg-icons"

import {
    useTheme,
    useToast,
    useColorModeValue,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Text,
    Input,
    Textarea,
    Flex,
    Box,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverBody,
    Heading,
    Image,
    InputGroup,
    InputLeftAddon,
} from "@chakra-ui/react"

function generateRandomId(): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""

    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length)
        result += characters.charAt(randomIndex)
    }

    return result
}

function customSet(obj, path, value) {
    const pathParts = Array.isArray(path) ? path : path.split(".")

    if (pathParts.length === 1) {
        if (pathParts[0].includes("description.")) {
            const descriptionKey = pathParts[0].split(".")[1]
            obj["description"] = obj["description"] || {}
            obj["description"][descriptionKey] = value
        } else {
            obj[pathParts[0]] = value
        }
    } else {
        const [head, ...rest] = pathParts
        obj[head] = obj[head] || {}
        customSet(obj[head], rest, value)
    }
}

export default function CardEditor({ windowSize, isOpen, onClose, cardEditorData, setCardEditorData, cardData }) {
    const [inputVisibility, setInputVisibility] = React.useState<{ [key: string]: boolean }>({})
    const [imageSrcs, setImageSrcs] = useState({})
    const toast = useToast()

    const customTheme = useTheme()
    const contentBackground = useColorModeValue(customTheme.contentBackground.color.light, customTheme.contentBackground.color.dark)
    const contentBackgroundLighter = useColorModeValue(customTheme.contentBackground.hoverColor.light, customTheme.contentBackground.hoverColor.dark)
    const labelColor = useColorModeValue(customTheme.headingText.color.light, customTheme.headingText.color.dark)

    const renderInputs = (cardEditorData) => {
        if (!cardEditorData) {
            return { inputs: [], inputRefs: new Map() }
        }

        const InputLabel = ({ children, htmlFor }) => {
            return (
                <Text as="label" htmlFor={htmlFor} fontSize="lg" fontWeight="bold" color={labelColor} mb="8px" mt="16px" display="block">
                    {children}
                </Text>
            )
        }

        const inputRefs = new Map()

        const cardIdRef = React.createRef<HTMLInputElement>()
        inputRefs.set("id", cardIdRef)
        const cardIdInput = (
            <>
                <InputLabel htmlFor={"id"}>Card Id</InputLabel>
                <Input id="cardId" ref={cardIdRef} disabled={true} defaultValue={cardEditorData?.id} />
            </>
        )

        const nameRef = React.createRef<HTMLInputElement>()
        inputRefs.set("name", nameRef)
        const nameInput = (
            <>
                <InputLabel htmlFor={"name"}>Name</InputLabel>
                <Input id="name" ref={nameRef} placeholder="Add name..." defaultValue={cardEditorData.name} />
            </>
        )

        const summaryRef = React.createRef<HTMLInputElement>()
        inputRefs.set("summary", summaryRef)
        const summaryInput = (
            <>
                <InputLabel htmlFor={"summary"}>Summary</InputLabel>
                <Input id="summary" ref={summaryRef} placeholder="Add summary..." defaultValue={cardEditorData.summary} />
            </>
        )

        const startDateRef = React.createRef<HTMLInputElement>()
        inputRefs.set("startDate", startDateRef)
        const startDateInput = (
            <>
                <InputLabel htmlFor={"startDate"}>Start Date</InputLabel>
                <Input id="startDate" ref={startDateRef} placeholder="Add start date..." defaultValue={cardEditorData.startDate} />
            </>
        )

        const endDateRef = React.createRef<HTMLInputElement>()
        inputRefs.set("endDate", endDateRef)
        const endDateInput = (
            <>
                <InputLabel htmlFor={"endDate"}>End Date</InputLabel>
                <Input id="endDate" ref={endDateRef} placeholder="Add end date..." defaultValue={cardEditorData.endDate} />
            </>
        )

        const handleAddDescription = () => {
            const nextKey = Object.keys(cardEditorData?.description || {}).length
            const newDescription = { [nextKey]: "" }
            setCardEditorData((prevState) => ({
                ...prevState,
                description: {
                    ...(prevState?.description || {}),
                    ...newDescription,
                },
            }))
        }
        const descriptionInputs = () => {
            if (Object.entries(cardEditorData?.description || {}).length > 0) {
                return [
                    <InputLabel key="description-heading" htmlFor="descriptions">
                        Descriptions
                    </InputLabel>,
                    ...Object.entries(cardEditorData?.description).map(([key, value]) => {
                        const descriptionRef = React.createRef<HTMLTextAreaElement>()
                        const fullPathKey = `description.${key}`
                        inputRefs.set(fullPathKey, descriptionRef)
                        return (
                            <React.Fragment key={`description-fragment-${key}`}>
                                <InputLabel htmlFor={`description-${key}`}>Description {key}</InputLabel>
                                <Textarea
                                    id={`description-${key}`}
                                    key={`description-${key}`}
                                    ref={descriptionRef}
                                    placeholder={`Add description ${key}...`}
                                    defaultValue={value as string}
                                    mb="8px"
                                />
                            </React.Fragment>
                        )
                    }),
                    <Button onClick={handleAddDescription} key="add-description-button" mt="8px">
                        Add Description
                    </Button>,
                ]
            }
        }

        const handleAddImage = () => {
            const nextKey = Object.keys(cardEditorData?.images || {}).length
            const newImage = { [nextKey]: "" }
            setCardEditorData((prevState) => ({
                ...prevState,
                images: {
                    ...(prevState?.images || {}),
                    ...newImage,
                },
            }))
        }
        const handleRefreshImage = (key: string, src: string) => {
            setImageSrcs((prevSrcs) => ({
                ...prevSrcs,
                [key]: src,
            }))
        }
        const deleteImage = (key: string, imageRef: React.RefObject<HTMLInputElement>, altRef: React.RefObject<HTMLInputElement>) => {
            imageRef.current ? (imageRef.current.value = "") : null
            altRef.current ? (altRef.current.value = "") : null
            setInputVisibility((prevState) => ({
                ...prevState,
                [key]: false,
            }))
        }
        const imageInputs = () => {
            interface ImageData {
                image: string
                alt: string
            }
            if (Object.entries(cardEditorData?.images || {}).length > 0) {
                return [
                    <InputLabel key="images-heading" htmlFor="images">
                        Images
                    </InputLabel>,
                    ...Object.entries(cardEditorData?.images).map(([key, value]) => {
                        const imageData = value as ImageData
                        const imageRef = React.createRef<HTMLInputElement>()
                        const altRef = React.createRef<HTMLInputElement>()
                        const imageFullPathKey = `images.${key}.image`
                        const altFullPathKey = `images.${key}.alt`
                        inputRefs.set(imageFullPathKey, imageRef)
                        inputRefs.set(altFullPathKey, altRef)
                        const isVisible = inputVisibility[key] !== false
                        return (
                            <React.Fragment key={`images-fragment-${key}`}>
                                <Box style={{ display: isVisible ? null : "none" }}>
                                    <Flex alignItems={"baseline"} columnGap={2}>
                                        <InputLabel htmlFor={`images-${key}`}>
                                            {key === "0" ? "Icon Image" : key === "1" ? "Cover Image" : "Additional Image"}
                                            {key != "0" && (
                                                <Button
                                                    onClick={() => deleteImage(key, imageRef, altRef)}
                                                    size="sm"
                                                    borderRadius={"20px"}
                                                    colorScheme={"red"}
                                                    variant="ghost"
                                                    mb={1}
                                                >
                                                    <FontAwesomeIcon icon={faTrashCan} size={"lg"} />
                                                </Button>
                                            )}
                                        </InputLabel>
                                    </Flex>
                                    <Flex alignItems={"center"}>
                                        <Image
                                            id={`images-${key}-preview`}
                                            key={`images-${key}-preview`}
                                            objectFit="contain"
                                            width="90px"
                                            src={imageSrcs[key] || imageData.image}
                                            alt={imageData.alt}
                                            borderRadius={"10px"}
                                        />
                                        <Button
                                            onClick={() => handleRefreshImage(key, imageRef.current?.value)}
                                            size="sm"
                                            ml="8px"
                                            borderRadius={"20px"}
                                        >
                                            <FontAwesomeIcon icon={faRefresh} size={"lg"} />
                                            <Text pl={3}>Refresh image</Text>
                                        </Button>
                                    </Flex>
                                    <InputGroup>
                                        <InputLeftAddon width="90px">Source</InputLeftAddon>
                                        <Input
                                            id={`images-${key}`}
                                            key={`images-${key}`}
                                            ref={imageRef}
                                            placeholder={`Add image ${key}...`}
                                            defaultValue={imageData.image}
                                            mb="8px"
                                        />
                                    </InputGroup>
                                    <InputGroup>
                                        <InputLeftAddon width="90px">Alt Text</InputLeftAddon>
                                        <Input
                                            id={`alt-${key}`}
                                            key={`alt-${key}`}
                                            ref={altRef}
                                            placeholder={`Add alt text ${key}...`}
                                            defaultValue={imageData.alt}
                                            mb="8px"
                                        />
                                    </InputGroup>
                                </Box>
                            </React.Fragment>
                        )
                    }),
                    <Button onClick={handleAddImage} key="add-image-button" mt="8px">
                        Add Image
                    </Button>,
                ]
            }
        }

        return {
            inputs: [
                <React.Fragment key="card-id-input">{cardIdInput}</React.Fragment>,
                <React.Fragment key="name-input">{nameInput}</React.Fragment>,
                <React.Fragment key="summary-input">{summaryInput}</React.Fragment>,
                <React.Fragment key="start-date-input">{startDateInput}</React.Fragment>,
                <React.Fragment key="end-date-input">{endDateInput}</React.Fragment>,
                <React.Fragment key="description-inputs">{descriptionInputs()}</React.Fragment>,
                <React.Fragment key="image-inputs">{imageInputs()}</React.Fragment>,
            ],
            inputRefs,
        }
    }

    const { inputs, inputRefs } = renderInputs(cardEditorData)

    const getUpdatedCardData = (cardData, inputRefs, cardEditorData) => {
        let idExists = false
        let deleteCard = false

        const updatedCardData = cardData.map((card) => {
            if (card.id === cardEditorData?.id) {
                idExists = true
                let updatedCard = { ...card }

                inputRefs.forEach((inputRef, key) => {
                    const inputValue = inputRef?.current?.value
                    const originalValue = key.split(".").reduce((obj, k) => (obj && obj[k] !== undefined ? obj[k] : null), card)

                    // Delete a card by setting its id to an empty string
                    if (key === "id" && inputValue === "") {
                        deleteCard = true
                    } else if (key != "description.0" && key.includes("description") && inputValue === "") {
                        unset(updatedCard, key)
                    } else if (key.includes("images") && !(key.includes("images.0") || key.includes("images.1")) && inputValue === "") {
                        unset(updatedCard, key.split(".").slice(0, 2).join("."))
                    } else if (inputValue !== originalValue) {
                        customSet(updatedCard, key, inputValue)
                    }
                })
                return updatedCard
            }
            return card
        })

        if (!idExists) {
            // Generate a unique ID for the new card
            // Check all the existing IDs to confirm that the new ID is unique
            // If the new ID is not unique, generate a new ID until it is unique
            const newId = () => {
                const isUniqueId = (randomId: string): boolean => {
                    return !cardData.some((card) => card.id === randomId)
                }
                let randomId = generateRandomId()
                while (!isUniqueId(randomId)) {
                    randomId = generateRandomId()
                }
                return randomId
            }

            let newCard = { id: newId() }
            inputRefs.forEach((inputRef, key) => {
                if (key !== "id") {
                    const inputValue = inputRef?.current?.value
                    customSet(newCard, key, inputValue)
                }
            })
            updatedCardData.push(newCard)
        }

        if (deleteCard) {
            // Remove the card with the matching ID if an empty ID is submitted
            return cardData.filter((card) => card.id !== cardEditorData.id)
        }
        return updatedCardData
    }

    function closeEditor() {
        toast.closeAll()
        setImageSrcs({})
        setInputVisibility({})
        onClose()
    }

    return (
        <Modal
            isCentered
            closeOnOverlayClick={true}
            onClose={() => {
                if (!isEqual(getUpdatedCardData(cardData, inputRefs, cardEditorData), cardData)) {
                    if (!toast.isActive("data-changed")) {
                        toast({
                            id: "data-changed",
                            title: "Data has changed",
                            status: "warning",
                            isClosable: true,
                            position: "top",
                            description: "Save or cancel the changes",
                            duration: 3000,
                        })
                    }
                } else {
                    closeEditor()
                }
            }}
            isOpen={isOpen}
            scrollBehavior="inside"
        >
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
            <ModalContent bg={contentBackground} minW="50vw" minH="80vh" maxH={"90vh"} borderRadius={"30px"}>
                <ModalHeader bg={contentBackgroundLighter} borderTopRadius={"30px"}>
                    <Flex justifyContent="space-between" alignItems="center">
                        {cardEditorData?.id != "NEW_CARD" ? <Text>Edit: {cardEditorData?.name}</Text> : <Text>Create new card</Text>}
                    </Flex>
                </ModalHeader>
                <ModalBody>{inputs}</ModalBody>
                <ModalFooter bg={contentBackgroundLighter} borderBottomRadius={"30px"}>
                    <Flex grow={1} justifyContent={"space-between"}>
                        {cardEditorData?.id != "NEW_CARD" ? (
                            <Popover>
                                <PopoverTrigger>
                                    <Button variant="outline" colorScheme="red">
                                        <FontAwesomeIcon icon={faTrashCan} size={"lg"} />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent borderWidth={3} borderRadius={"30px"} bg={contentBackground}>
                                    <PopoverArrow />
                                    <PopoverBody pb={10}>
                                        <Flex direction={"column"} alignItems={"center"}>
                                            <Heading fontSize={"xl"} pb={5} pt={3}>
                                                Are you sure...?
                                            </Heading>
                                            <Button
                                                colorScheme="red"
                                                onClick={async () => {
                                                    try {
                                                        // Clear the id field to delete the card
                                                        inputRefs?.get("id").current ? (inputRefs.get("id").current.value = "") : null
                                                        await axios.post("/api/updateData", getUpdatedCardData(cardData, inputRefs, cardEditorData))
                                                        closeEditor()
                                                    } catch (error) {
                                                        if (!toast.isActive("error-deleting-data")) {
                                                            toast({
                                                                id: "error-deleting-data",
                                                                title: "Error deleting data",
                                                                status: "error",
                                                                isClosable: true,
                                                                position: "top",
                                                                description: error.message || "Unknown error 😞 Please try again later.",
                                                                duration: 3000,
                                                            })
                                                        }
                                                    }
                                                }}
                                            >
                                                Yes, I&apos;m sure - kill it!
                                            </Button>
                                        </Flex>
                                    </PopoverBody>
                                </PopoverContent>
                            </Popover>
                        ) : (
                            <Box></Box>
                        )}
                        <Box>
                            <Button
                                mr={5}
                                colorScheme="blue"
                                onClick={() => {
                                    closeEditor()
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                colorScheme="green"
                                onClick={async () => {
                                    try {
                                        await axios.post("/api/updateData", getUpdatedCardData(cardData, inputRefs, cardEditorData))
                                        closeEditor()
                                    } catch (error) {
                                        if (!toast.isActive("error-saving-data")) {
                                            toast({
                                                id: "error-saving-data",
                                                title: "Error saving data",
                                                status: "error",
                                                isClosable: true,
                                                position: "top",
                                                description: error.message || "Unknown error 😞 Please try again later.",
                                                duration: 3000,
                                            })
                                        }
                                    }
                                }}
                            >
                                Save
                            </Button>
                        </Box>
                    </Flex>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
