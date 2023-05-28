import fs from "fs"
import path from "path"
import ReactMarkdown from "react-markdown"
import ChakraUIRenderer from "chakra-ui-markdown-renderer"

import { Container } from "@chakra-ui/react"

// Your blog post component
export default function BlogPost({ content }) {
    return (
        <Container maxW="1600px" pb={20}>
            <ReactMarkdown components={ChakraUIRenderer()}>{content}</ReactMarkdown>
        </Container>
    )
}

export async function getStaticPaths() {
    // Replace this with actual logic to retrieve all possible ids
    const blogsDirectory = path.join(process.cwd(), "public", "blogs")
    const filenames = fs.readdirSync(blogsDirectory)
    const paths = filenames.map((filename) => ({
        params: { id: filename.replace(/\.md$/, "") },
    }))

    return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
    // Fetch necessary data for the blog post using params.id
    const filePath = path.join(process.cwd(), "public", "blogs", `${params.id}.md`)
    const fileContents = fs.readFileSync(filePath, "utf8")

    // If your markdown files are encoded differently, replace 'utf8' with the correct encoding
    return {
        props: {
            content: fileContents,
        },
    }
}
