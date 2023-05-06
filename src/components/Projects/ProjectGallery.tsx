import React from "react"
import projectsData from "../../../public/data/projects.json"
import ProjectCard from "./ProjectCard"
import Masonry from "react-masonry-css"

import { useTheme, Container, useColorModeValue, Text, SimpleGrid, Wrap, Box } from "@chakra-ui/react"

export default function ProjectsGallery({ windowSize }) {
    const breakpointCols = {
        default: 3, // 3 columns on large screens
        1400: 2, // 2 columns on medium screens
        800: 1, // 1 column on small screens
    }

    return (
        <Box width="100%">
            <Masonry breakpointCols={breakpointCols} className="my-masonry-grid" columnClassName="my-masonry-grid_column">
                {projectsData.map((project, index) => (
                    <ProjectCard key={index} project={project} windowSize={windowSize} />
                ))}
            </Masonry>
        </Box>
    )
}
