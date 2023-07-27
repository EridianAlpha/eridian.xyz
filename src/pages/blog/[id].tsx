import fs from "fs"
import path from "path"
import ReactMarkdown from "react-markdown"
import ChakraUIRenderer from "chakra-ui-markdown-renderer"
import Header from "@/components/Header/Header"
import { Container, useColorModeValue, useTheme, Box } from "@chakra-ui/react"

export default function BlogPost({ content, windowSize, environment, setIsCardEditorOpen, setCardEditorData }) {
    const customTheme = useTheme()

    return (
        <Box w={"100vw"} bg={useColorModeValue(customTheme.pageBackground.light, customTheme.pageBackground.dark)}>
            <Container maxW="1600px" pb={20} bg={useColorModeValue(customTheme.pageBackground.light, customTheme.pageBackground.dark)}>
                <Header
                    windowSize={windowSize}
                    environment={environment}
                    setIsCardEditorOpen={setIsCardEditorOpen}
                    setCardEditorData={setCardEditorData}
                />
                <ReactMarkdown components={ChakraUIRenderer()}>{content}</ReactMarkdown>
            </Container>
        </Box>
    )
}

export async function getStaticPaths() {
    const blogsDirectory = path.join(process.cwd(), "public", "blogs")
    const filenames = fs.readdirSync(blogsDirectory)
    const paths = filenames.map((filename) => ({
        params: { id: filename.replace(/\.md$/, "") },
    }))

    return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
    const filePath = path.join(process.cwd(), "public", "blogs", `${params.id}.md`)
    const fileContents = fs.readFileSync(filePath, "utf8")

    return {
        props: {
            content: fileContents,
        },
    }
}
