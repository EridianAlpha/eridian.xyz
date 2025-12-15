import fs from "fs"
import path from "path"
import ReactMarkdown from "react-markdown"
import ChakraUIRenderer from "chakra-ui-markdown-renderer"
import { Link } from "@chakra-ui/react"
import Header from "@/components/Header/Header"
import { Container, useColorModeValue, useTheme, Box } from "@chakra-ui/react"

export default function BlogPost({ content, windowSize, environment, setIsCardEditorOpen, setCardEditorData }) {
    const customTheme = useTheme()

    const markdownComponents = ChakraUIRenderer({
        a: (props) => (
            <Link
                href={props.href}
                isExternal={props.href?.startsWith("http")}
                textDecoration="underline"
                color="teal.300"
                _hover={{ textDecoration: "underline", color: "teal.200" }}
            >
                {props.children}
            </Link>
        ),
    })

    return (
        <Box w={"100vw"} bg={useColorModeValue(customTheme.pageBackground.light, customTheme.pageBackground.dark)}>
            <Container maxW="1000px" pb={20} bg={useColorModeValue(customTheme.pageBackground.light, customTheme.pageBackground.dark)}>
                <Header
                    windowSize={windowSize}
                    environment={environment}
                    setIsCardEditorOpen={setIsCardEditorOpen}
                    setCardEditorData={setCardEditorData}
                />
                <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
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
