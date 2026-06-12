import React, { useEffect, useRef, useState } from "react"
import axios from "axios"
import { unset, cloneDeep } from "lodash"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashCan, faRefresh, faUpload, faPaste } from "@fortawesome/free-solid-svg-icons"

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
    Select,
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

function compareObjects(obj1, obj2, parentKey = "") {
    let differences = []

    for (const key in obj1) {
        const currentKey = parentKey ? `${parentKey}.${key}` : key

        if (typeof obj1[key] === "object" && obj1[key] !== null && !Array.isArray(obj1[key])) {
            differences = [...differences, ...compareObjects(obj1[key], obj2[key], currentKey)]
        } else if (obj1[key] !== obj2[key]) {
            differences.push({
                key: currentKey,
                value1: obj1[key],
                value2: obj2[key],
            })
        }
    }

    for (const key in obj2) {
        const currentKey = parentKey ? `${parentKey}.${key}` : key

        if (typeof obj2[key] === "object" && obj2[key] !== null && !Array.isArray(obj2[key]) && !(key in obj1)) {
            differences = [...differences, ...compareObjects(obj1[key], obj2[key], currentKey)]
        } else if (!(key in obj1)) {
            differences.push({
                key: currentKey,
                value1: undefined,
                value2: obj2[key],
            })
        }
    }

    return differences
}

function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
            const result = reader.result as string
            resolve(result.split(",")[1])
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

const MIME_TO_EXTENSION: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/svg+xml": "svg",
    "image/tiff": "tiff",
    "image/bmp": "bmp",
}

const PREFERRED_CLIPBOARD_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/tiff", "image/bmp", "image/svg+xml"]

function isAllowedImageFile(file: File): boolean {
    if (file.type.startsWith("image/")) {
        return true
    }

    // macOS paste events sometimes omit the MIME type even for valid image data.
    return file.size > 0
}

function normalizeImageFile(file: File, isPasted = false): File {
    if (file.type.startsWith("image/")) {
        return file
    }

    return new File([file], getDefaultImageFilename(file, isPasted), { type: "image/png" })
}

function getExtensionFromFile(file: File): string {
    if (file.type && MIME_TO_EXTENSION[file.type]) {
        return `.${MIME_TO_EXTENSION[file.type]}`
    }

    const extensionMatch = file.name.match(/\.[a-zA-Z0-9]+$/)
    if (extensionMatch) {
        return extensionMatch[0].toLowerCase()
    }

    return ".png"
}

function sanitizeFilenameInput(filename: string): string {
    return filename.trim().replace(/[^a-zA-Z0-9._-]/g, "")
}

function resolveUploadFilename(filename: string, file: File): string | null {
    const sanitizedBase = sanitizeFilenameInput(filename)

    if (!sanitizedBase) {
        return null
    }

    const hasExtension = /\.[a-zA-Z0-9]+$/.test(sanitizedBase)
    const resolvedFilename = hasExtension ? sanitizedBase : `${sanitizedBase}${getExtensionFromFile(file)}`
    const extension = resolvedFilename.slice(resolvedFilename.lastIndexOf(".")).toLowerCase()
    const allowedExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".tiff", ".bmp"]

    if (!allowedExtensions.includes(extension) || !/^[a-zA-Z0-9._-]+$/.test(resolvedFilename)) {
        return null
    }

    return resolvedFilename
}

function getDefaultImageFilename(file: File, isPasted = false): string {
    if (file.name && !isPasted) {
        const sanitizedName = sanitizeFilenameInput(file.name)
        if (!sanitizedName) {
            return `pasted-image${getExtensionFromFile(file)}`
        }

        if (/\.[a-zA-Z0-9]+$/.test(sanitizedName)) {
            return sanitizedName
        }

        return `${sanitizedName}${getExtensionFromFile(file)}`
    }

    const extension = MIME_TO_EXTENSION[file.type] || "png"
    return `pasted-image.${extension}`
}

function dataUrlToFile(dataUrl: string): File | null {
    const match = dataUrl.match(/^data:(image\/[^;]+);base64,([\s\S]+)$/)
    if (!match) {
        return null
    }

    const mimeType = match[1]
    const base64 = match[2]
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)

    for (let index = 0; index < binary.length; index++) {
        bytes[index] = binary.charCodeAt(index)
    }

    return new File([bytes], getDefaultImageFilename(new File([bytes], "", { type: mimeType }), true), { type: mimeType })
}

function blobToImageFile(blob: Blob, type: string): File | null {
    if (!type.startsWith("image/") || blob.size === 0) {
        return null
    }

    return new File([blob], getDefaultImageFilename(new File([blob], "", { type }), true), { type })
}

async function getImageFileFromClipboardItems(clipboardItems: ClipboardItem[]): Promise<File | null> {
    for (const clipboardItem of clipboardItems) {
        for (const type of PREFERRED_CLIPBOARD_IMAGE_TYPES) {
            if (clipboardItem.types.includes(type)) {
                const file = blobToImageFile(await clipboardItem.getType(type), type)
                if (file) {
                    return file
                }
            }
        }

        for (const type of clipboardItem.types) {
            if (type.startsWith("image/") && !PREFERRED_CLIPBOARD_IMAGE_TYPES.includes(type)) {
                const file = blobToImageFile(await clipboardItem.getType(type), type)
                if (file) {
                    return file
                }
            }
        }
    }

    for (const clipboardItem of clipboardItems) {
        if (clipboardItem.types.includes("text/html")) {
            const html = await (await clipboardItem.getType("text/html")).text()
            const dataUrlMatch = html.match(/src=["'](data:image\/[^"']+)["']/i)
            if (dataUrlMatch) {
                const file = dataUrlToFile(dataUrlMatch[1])
                if (file) {
                    return file
                }
            }
        }

        if (clipboardItem.types.includes("text/plain")) {
            const text = (await (await clipboardItem.getType("text/plain")).text()).trim()
            if (text.startsWith("data:image/")) {
                const file = dataUrlToFile(text)
                if (file) {
                    return file
                }
            }
        }
    }

    return null
}

function getImageFileFromPasteEvent(event: ClipboardEvent): File | null {
    const clipboardData = event.clipboardData
    if (!clipboardData) {
        return null
    }

    if (clipboardData.files.length > 0) {
        for (const file of Array.from(clipboardData.files)) {
            if (isAllowedImageFile(file)) {
                return file
            }
        }
    }

    for (const type of PREFERRED_CLIPBOARD_IMAGE_TYPES) {
        const item = Array.from(clipboardData.items).find((clipboardItem) => clipboardItem.type === type)
        const file = item?.getAsFile()
        if (file && isAllowedImageFile(file)) {
            return file
        }
    }

    for (const item of Array.from(clipboardData.items)) {
        if (item.type.startsWith("image/")) {
            const file = item.getAsFile()
            if (file && isAllowedImageFile(file)) {
                return file
            }
        }
    }

    const html = clipboardData.getData("text/html")
    if (html) {
        const dataUrlMatch = html.match(/src=["'](data:image\/[^"']+)["']/i)
        if (dataUrlMatch) {
            const file = dataUrlToFile(dataUrlMatch[1])
            if (file) {
                return file
            }
        }
    }

    const plainText = clipboardData.getData("text/plain").trim()
    if (plainText.startsWith("data:image/")) {
        return dataUrlToFile(plainText)
    }

    return null
}

function customSet(obj, path, value) {
    const pathParts = Array.isArray(path) ? path : path.split(".")

    if (pathParts.length === 1) {
        if (pathParts[0] === "description") {
            const descriptionKey = pathParts[1]
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
    const [uploadImageKey, setUploadImageKey] = useState<string | null>(null)
    const [imageUploadModal, setImageUploadModal] = useState<{ isOpen: boolean; file: File | null; filename: string }>({
        isOpen: false,
        file: null,
        filename: "",
    })
    const [isUploading, setIsUploading] = useState(false)
    const [isWaitingForPaste, setIsWaitingForPaste] = useState(false)
    const [pasteTargetKey, setPasteTargetKey] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const toast = useToast()

    const customTheme = useTheme()
    const contentBackground = useColorModeValue(customTheme.contentBackground.color.light, customTheme.contentBackground.color.dark)
    const contentBackgroundLighter = useColorModeValue(customTheme.contentBackground.hoverColor.light, customTheme.contentBackground.hoverColor.dark)
    const labelColor = useColorModeValue(customTheme.headingText.color.light, customTheme.headingText.color.dark)

    const handleRefreshImage = (key: string, src: string) => {
        setImageSrcs((prevSrcs) => ({
            ...prevSrcs,
            [key]: src,
        }))
    }

    const handleUploadClick = (key: string) => {
        setUploadImageKey(key)
        fileInputRef.current?.click()
    }

    const openImageSaveModal = (file: File, isPasted = false) => {
        setImageUploadModal({
            isOpen: true,
            file,
            filename: getDefaultImageFilename(file, isPasted),
        })
    }

    const processImageFile = (file: File | null, imageKey: string | null, isPasted = false): boolean => {
        if (!file || !imageKey) {
            return false
        }

        if (!isAllowedImageFile(file)) {
            toast({
                title: "Invalid file type",
                status: "error",
                isClosable: true,
                position: "top",
                description: "Please use a PNG, JPG, GIF, WebP, SVG, TIFF, or BMP image.",
                duration: 3000,
            })
            return false
        }

        setUploadImageKey(imageKey)
        setIsWaitingForPaste(false)
        setPasteTargetKey(null)
        openImageSaveModal(normalizeImageFile(file, isPasted), isPasted)
        return true
    }

    const startWaitingForPaste = (key: string) => {
        setPasteTargetKey(key)
        setUploadImageKey(key)
        setIsWaitingForPaste(true)
        toast({
            title: "Paste image",
            status: "info",
            isClosable: true,
            position: "top",
            description: "Press Cmd+V (or Ctrl+V) to paste from your clipboard.",
            duration: 5000,
        })
    }

    useEffect(() => {
        if (!isWaitingForPaste || !pasteTargetKey) {
            return
        }

        const handleDocumentPaste = (event: ClipboardEvent) => {
            const file = getImageFileFromPasteEvent(event)

            if (!file) {
                setIsWaitingForPaste(false)
                setPasteTargetKey(null)
                toast({
                    title: "No image in clipboard",
                    status: "warning",
                    isClosable: true,
                    position: "top",
                    description: "Copy an image first, then try again.",
                    duration: 3000,
                })
                return
            }

            if (processImageFile(file, pasteTargetKey, true)) {
                event.preventDefault()
            }
        }

        document.addEventListener("paste", handleDocumentPaste)
        return () => document.removeEventListener("paste", handleDocumentPaste)
    }, [isWaitingForPaste, pasteTargetKey, toast])

    const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        event.target.value = ""

        if (!file) {
            return
        }

        processImageFile(file, uploadImageKey)
    }

    const handlePasteClick = async (key: string) => {
        setIsWaitingForPaste(false)
        setPasteTargetKey(null)

        try {
            const clipboardItems = await navigator.clipboard.read()
            const file = await getImageFileFromClipboardItems(clipboardItems)

            if (file && processImageFile(file, key, true)) {
                return
            }
        } catch {
            // Fall through to keyboard paste, which is more reliable in many browsers.
        }

        startWaitingForPaste(key)
    }

    const closeImageUploadModal = () => {
        setImageUploadModal({ isOpen: false, file: null, filename: "" })
        setUploadImageKey(null)
    }

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

        const cardTypeRef = React.createRef<HTMLSelectElement>()
        inputRefs.set("displayConfig.cardType", cardTypeRef)
        const cardTypeInput = (
            <>
                <InputLabel htmlFor={"cardType"}>Type</InputLabel>
                <Select id="cardType" ref={cardTypeRef} defaultValue={cardEditorData.displayConfig.cardType}>
                    <option value="highlight">Highlight</option>
                    <option value="project">Project</option>
                    <option value="tweet">Tweet</option>
                    <option value="event">Event</option>
                </Select>
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

        const handleAddLink = () => {
            const nextKey = Object.keys(cardEditorData?.externalLinks || {}).length
            const newLink = { [nextKey]: "" }
            setCardEditorData((prevState) => ({
                ...prevState,
                externalLinks: {
                    ...(prevState?.externalLinks || {}),
                    ...newLink,
                },
            }))
        }
        const deleteLink = (
            key: string,
            linkRef: React.RefObject<HTMLInputElement>,
            labelRef: React.RefObject<HTMLInputElement>,
            typeRef: React.RefObject<HTMLSelectElement>
        ) => {
            linkRef.current ? (linkRef.current.value = "") : null
            setInputVisibility((prevState) => ({
                ...prevState,
                [key]: false,
            }))
            labelRef.current ? (labelRef.current.value = "") : null
            setInputVisibility((prevState) => ({
                ...prevState,
                [key]: false,
            }))
            typeRef.current ? (typeRef.current.value = "") : null
            setInputVisibility((prevState) => ({
                ...prevState,
                [key]: false,
            }))
        }
        const linkInputs = () => {
            interface LinkData {
                url: string
                label: string
                type: string
            }
            if (Object.entries(cardEditorData?.externalLinks || {}).length > 0) {
                return [
                    <InputLabel key="links-heading" htmlFor="links">
                        Links
                    </InputLabel>,
                    ...Object.entries(cardEditorData?.externalLinks).map(([key, value]) => {
                        const linkData = value as LinkData
                        const linksRef = React.createRef<HTMLInputElement>()
                        const labelRef = React.createRef<HTMLInputElement>()
                        const typeRef = React.createRef<HTMLSelectElement>()
                        const urlFullPathKey = `externalLinks.${key}.url`
                        const labelFullPathKey = `externalLinks.${key}.label`
                        const typeFullPathKey = `externalLinks.${key}.type`
                        inputRefs.set(urlFullPathKey, linksRef)
                        inputRefs.set(labelFullPathKey, labelRef)
                        inputRefs.set(typeFullPathKey, typeRef)

                        const isVisible = inputVisibility[key] !== false
                        return (
                            <React.Fragment key={`links-fragment-${key}`}>
                                <Box style={{ display: isVisible ? null : "none" }}>
                                    <Flex alignItems={"baseline"} columnGap={2}>
                                        <InputLabel htmlFor={`links-${key}`}>
                                            Link
                                            <Button
                                                onClick={() => deleteLink(key, linksRef, labelRef, typeRef)}
                                                size="sm"
                                                borderRadius={"20px"}
                                                colorScheme={"red"}
                                                variant="ghost"
                                                mb={1}
                                            >
                                                <FontAwesomeIcon icon={faTrashCan} size={"lg"} />
                                            </Button>
                                        </InputLabel>
                                    </Flex>
                                    <InputGroup>
                                        <InputLeftAddon width="90px">URL</InputLeftAddon>
                                        <Input
                                            id={`url-${key}`}
                                            key={`url-${key}`}
                                            ref={linksRef}
                                            placeholder={`Add link URL ${key}...`}
                                            defaultValue={linkData.url}
                                            mb="8px"
                                        />
                                    </InputGroup>
                                    <InputGroup>
                                        <InputLeftAddon width="90px">Label</InputLeftAddon>
                                        <Input
                                            id={`label-${key}`}
                                            key={`label-${key}`}
                                            ref={labelRef}
                                            placeholder={`Add link label ${key}...`}
                                            defaultValue={linkData.label}
                                            mb="8px"
                                        />
                                    </InputGroup>
                                    <InputGroup>
                                        <InputLeftAddon width="90px">Type</InputLeftAddon>
                                        <Select
                                            id={`type-${key}`}
                                            key={`type-${key}`}
                                            ref={typeRef}
                                            defaultValue={linkData.type}
                                            mb="8px"
                                            borderLeftRadius="0px"
                                        >
                                            <option value="website">Website</option>
                                            <option value="twitter">Twitter</option>
                                            <option value="discord">Discord</option>
                                            <option value="github">Github</option>
                                        </Select>
                                    </InputGroup>
                                </Box>
                            </React.Fragment>
                        )
                    }),
                    <Button onClick={handleAddLink} key="add-links-button" mt="8px">
                        Add Link
                    </Button>,
                ]
            }
        }
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
        const deleteDescription = (key: string, descriptionRef: React.RefObject<HTMLTextAreaElement>) => {
            descriptionRef.current ? (descriptionRef.current.value = "") : null
            setInputVisibility((prevState) => ({
                ...prevState,
                [key]: false,
            }))
        }
        const descriptionInputs = () => {
            if (Object.entries(cardEditorData?.description || {}).length > 0) {
                return [
                    <InputLabel key="description-heading" htmlFor="descriptions">
                        Descriptions
                    </InputLabel>,
                    ...Object.entries(cardEditorData?.description).map(([key, value]) => {
                        const descriptionKeyRef = React.createRef<HTMLInputElement>()
                        const descriptionRef = React.createRef<HTMLTextAreaElement>()
                        const fullPathKey = `description.${key}`
                        inputRefs.set(`descriptionKey-${key}`, descriptionKeyRef)
                        inputRefs.set(fullPathKey, descriptionRef)
                        const isVisible = inputVisibility[key] !== false
                        return (
                            <React.Fragment key={`description-fragment-${key}`}>
                                <Box style={{ display: isVisible ? null : "none" }}>
                                    <Flex alignItems={"baseline"} columnGap={2}>
                                        <InputLabel htmlFor={`description-${key}`}>
                                            {key === "0" ? "Main Description" : "Additional Description"}
                                            {key != "0" && (
                                                <>
                                                    <Button
                                                        onClick={() => deleteDescription(key, descriptionRef)}
                                                        size="sm"
                                                        borderRadius={"20px"}
                                                        colorScheme={"red"}
                                                        variant="ghost"
                                                        mb={1}
                                                    >
                                                        <FontAwesomeIcon icon={faTrashCan} size={"lg"} />
                                                    </Button>
                                                </>
                                            )}
                                        </InputLabel>
                                        {key != "0" && (
                                            <>
                                                <InputGroup maxW={"150px"}>
                                                    <InputLeftAddon>Key</InputLeftAddon>
                                                    <Input
                                                        id={`descriptionKey-${key}`}
                                                        key={`descriptionKey-${key}`}
                                                        ref={descriptionKeyRef}
                                                        defaultValue={key}
                                                        mb="8px"
                                                    />
                                                </InputGroup>
                                                <Button
                                                    onClick={async () => {
                                                        try {
                                                            updatedCardIndexes(cardData, inputRefs, cardEditorData)
                                                        } catch (error) {
                                                            if (!toast.isActive("error-saving-data")) {
                                                                toast({
                                                                    id: "error-updating-index",
                                                                    title: "Error updating index",
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
                                                    Update Index
                                                </Button>
                                            </>
                                        )}
                                    </Flex>
                                    <Textarea
                                        id={`description-${key}`}
                                        key={`description-${key}`}
                                        ref={descriptionRef}
                                        placeholder={`Add description ${key}...`}
                                        defaultValue={value as string}
                                        mb="8px"
                                    />
                                </Box>
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
                                            src={imageSrcs[key] || imageData.image || "./Eridian.webp"}
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
                                    <Flex alignItems="center" mb="8px" gap={2}>
                                        <InputGroup flex={1}>
                                            <InputLeftAddon width="90px">Source</InputLeftAddon>
                                            <Input
                                                id={`images-${key}`}
                                                key={`images-${key}-${imageData.image}`}
                                                ref={imageRef}
                                                placeholder={`Add image ${key}...`}
                                                defaultValue={imageData.image}
                                            />
                                        </InputGroup>
                                        <Button size="sm" borderRadius="20px" onClick={() => handleUploadClick(key)}>
                                            <FontAwesomeIcon icon={faUpload} size={"lg"} />
                                            <Text pl={3}>Upload</Text>
                                        </Button>
                                        <Button size="sm" borderRadius="20px" onClick={() => handlePasteClick(key)}>
                                            <FontAwesomeIcon icon={faPaste} size={"lg"} />
                                            <Text pl={3}>Paste</Text>
                                        </Button>
                                    </Flex>
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
                        Add another image
                    </Button>,
                ]
            }
        }

        return {
            inputs: [
                <React.Fragment key="card-id-input">{cardIdInput}</React.Fragment>,
                <React.Fragment key="name-input">{nameInput}</React.Fragment>,
                <React.Fragment key="cardType-input">{cardTypeInput}</React.Fragment>,
                <React.Fragment key="summary-input">{summaryInput}</React.Fragment>,
                <React.Fragment key="start-date-input">{startDateInput}</React.Fragment>,
                <React.Fragment key="end-date-input">{endDateInput}</React.Fragment>,
                <React.Fragment key="link-inputs">{linkInputs()}</React.Fragment>,
                <React.Fragment key="description-inputs">{descriptionInputs()}</React.Fragment>,
                <React.Fragment key="image-inputs">{imageInputs()}</React.Fragment>,
            ],
            inputRefs,
        }
    }

    const { inputs, inputRefs } = renderInputs(cardEditorData)

    const handleImageUploadConfirm = async () => {
        const { file, filename } = imageUploadModal

        if (!file || !filename.trim() || !uploadImageKey) {
            return
        }

        const resolvedFilename = resolveUploadFilename(filename, file)
        if (!resolvedFilename) {
            toast({
                title: "Invalid filename",
                status: "error",
                isClosable: true,
                position: "top",
                description: "Use letters, numbers, dots, dashes, and underscores. Extension is added automatically if omitted.",
                duration: 4000,
            })
            return
        }

        setIsUploading(true)

        try {
            const data = await fileToBase64(file)
            const response = await axios.post("/api/uploadImage", {
                filename: resolvedFilename,
                data,
            })

            const imagePath = response.data.path
            const imageRef = inputRefs.get(`images.${uploadImageKey}.image`)

            setCardEditorData((prevState) => ({
                ...prevState,
                images: {
                    ...(prevState?.images || {}),
                    [uploadImageKey]: {
                        ...(typeof prevState?.images?.[uploadImageKey] === "object" && prevState.images[uploadImageKey] !== null
                            ? prevState.images[uploadImageKey]
                            : { image: "", alt: "" }),
                        image: imagePath,
                    },
                },
            }))

            if (imageRef?.current) {
                imageRef.current.value = imagePath
            }

            handleRefreshImage(uploadImageKey, imagePath)
            closeImageUploadModal()

            toast({
                title: "Image uploaded",
                status: "success",
                isClosable: true,
                position: "top",
                description: `Saved as ${resolvedFilename}`,
                duration: 3000,
            })
        } catch (error) {
            toast({
                title: "Error uploading image",
                status: "error",
                isClosable: true,
                position: "top",
                description: error.response?.data?.error || error.message || "Unknown error. Please try again.",
                duration: 4000,
            })
        } finally {
            setIsUploading(false)
        }
    }

    const updatedCardIndexes = (cardData, inputRefs, cardEditorData) => {
        const updatedCardData = cloneDeep(cardData)

        updatedCardData.map((card, index) => {
            if (card.id === cardEditorData?.id) {
                getEditorData(cardData, inputRefs, cardEditorData)

                let updatedCard = { ...cardEditorData }

                inputRefs.forEach((inputRef, key) => {
                    if (key.includes("descriptionKey")) {
                        const pathParts = Array.isArray(key) ? key : key.split(".")

                        let oldKey
                        if (inputRef?.current?.id && inputRef?.current?.id.includes("descriptionKey")) {
                            oldKey = inputRef?.current?.id.split("-")[1]
                        }
                        if (oldKey != inputRef?.current?.value && pathParts.length === 1) {
                            if (pathParts[0].includes("descriptionKey")) {
                                updatedCard["description"] = updatedCard["description"] || {}
                                if (oldKey) {
                                    updatedCard["description"][inputRef?.current?.value] = updatedCard["description"][oldKey]
                                    delete updatedCard["description"][oldKey]
                                }
                            }
                        }
                    }
                })
            }
        })
    }

    const getEditorData = (cardData, inputRefs, cardEditorData) => {
        let idExists = false
        let cardIndex
        let deleteCard = false

        const updatedCardData = cloneDeep(cardData)

        updatedCardData.map((card, index) => {
            if (card.id === cardEditorData?.id) {
                idExists = true
                cardIndex = index
                let updatedCard = { ...cardEditorData }

                inputRefs.forEach((inputRef, key) => {
                    const inputValue = inputRef?.current?.value
                    const originalValue = key.split(".").reduce((obj, k) => (obj && obj[k] !== undefined ? obj[k] : null), card)

                    if (key === "id" && inputValue === "") {
                        // Delete a card by setting its id to an empty string
                        deleteCard = true
                    } else if (key != "description.0" && key.includes("description") && inputValue === "") {
                        // Delete a description by setting its value to an empty string
                        unset(updatedCard, key)
                    } else if (key.includes("descriptionKey")) {
                        // Do nothing
                    } else if (key.includes("images") && !(key.includes("images.0") || key.includes("images.1")) && inputValue === "") {
                        // Delete an image by setting its value to an empty string
                        unset(updatedCard, key.split(".").slice(0, 2).join("."))
                    } else if (key.includes("externalLinks") && inputValue === "") {
                        console.log("HERE1")
                        // Delete an image by setting its value to an empty string
                        unset(updatedCard, key.split(".").slice(0, 2).join("."))
                    } else if (inputValue !== originalValue) {
                        // Update the card data if the input value has changed
                        customSet(updatedCard, key, inputValue)
                    }
                })
                updatedCardData[index] = updatedCard
            }
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
                const inputValue = inputRef?.current?.value
                if (key != "description.0" && key.includes("description") && inputValue === "") {
                    unset(newCard, key)
                } else if (key.includes("images") && !(key.includes("images.0") || key.includes("images.1")) && inputValue === "") {
                    unset(newCard, key.split(".").slice(0, 2).join("."))
                } else if (key !== "id") {
                    customSet(newCard, key, inputValue)
                }
            })
            updatedCardData.push(newCard)
        }

        if (deleteCard) {
            // Remove the card with the matching ID if an empty ID is submitted
            return cardData.filter((card) => card.id !== cardEditorData.id)
        }
        setCardEditorData(updatedCardData[cardIndex])
        return updatedCardData
    }

    const checkEditorDataChanges = (cardData, inputRefs, cardEditorData) => {
        const updatedCardData = cloneDeep(cardData)

        updatedCardData.map((card, index) => {
            if (card.id === cardEditorData?.id) {
                let updatedCard = { ...card }

                inputRefs.forEach((inputRef, key) => {
                    if (!key.includes("descriptionKey")) {
                        const inputValue = inputRef?.current?.value
                        const originalValue = key.split(".").reduce((obj, k) => (obj && obj[k] !== undefined ? obj[k] : null), card)

                        if (inputValue !== originalValue) {
                            customSet(updatedCard, key, inputValue)
                        }
                    }
                })
                updatedCardData[index] = updatedCard
            }
        })
        return updatedCardData
    }

    function closeEditor() {
        toast.closeAll()
        setImageSrcs({})
        setInputVisibility({})
        setIsWaitingForPaste(false)
        setPasteTargetKey(null)
        onClose()
    }

    return (
        <>
            <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml" hidden onChange={handleFileSelected} />
            <Modal isOpen={imageUploadModal.isOpen} onClose={closeImageUploadModal} isCentered size="md">
                <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
                <ModalContent bg={contentBackground} borderRadius="30px">
                    <ModalHeader bg={contentBackgroundLighter} borderTopRadius="30px">
                        Save image as
                    </ModalHeader>
                    <ModalBody>
                        <Text mb={2} fontSize="sm" color={labelColor}>
                            Selected file: {imageUploadModal.file?.name}
                        </Text>
                        <Text as="label" htmlFor="image-upload-filename" fontSize="lg" fontWeight="bold" color={labelColor} mb="8px" display="block">
                            Filename
                        </Text>
                        <Input
                            id="image-upload-filename"
                            value={imageUploadModal.filename}
                            onChange={(event) =>
                                setImageUploadModal((prevState) => ({
                                    ...prevState,
                                    filename: event.target.value,
                                }))
                            }
                            placeholder="MyImage.png (extension optional)"
                        />
                        <Text mt={3} fontSize="sm" color={labelColor}>
                            Image will be saved to public/images/. The source field will be set to ./images/your-filename
                        </Text>
                    </ModalBody>
                    <ModalFooter bg={contentBackgroundLighter} borderBottomRadius="30px">
                        <Button mr={3} onClick={closeImageUploadModal}>
                            Cancel
                        </Button>
                        <Button colorScheme="green" onClick={handleImageUploadConfirm} isLoading={isUploading}>
                            Upload
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal
            isCentered
            closeOnOverlayClick={true}
            onClose={() => {
                if (!(JSON.stringify(checkEditorDataChanges(cardData, inputRefs, cardEditorData)) === JSON.stringify(cardData))) {
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
                                                        await axios.post("/api/updateData", getEditorData(cardData, inputRefs, cardEditorData))
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
                                        await axios.post("/api/updateData", getEditorData(cardData, inputRefs, cardEditorData))
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
        </>
    )
}
