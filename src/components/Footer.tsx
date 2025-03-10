import { Flex, Text, useColorModeValue, useTheme } from "@chakra-ui/react"

export default function Footer() {
    const customTheme = useTheme()

    return (
        <Flex direction={"row"} alignItems={"center"} justifyContent={"center"} w={"100%"} pb={5} px={3} gap={1} fontWeight={"bold"}>
            <Text>Built with ❤️ by </Text>
            <Text color={useColorModeValue(customTheme.statusColors.inProgress.light, customTheme.statusColors.inProgress.dark)}>Eridian</Text>
        </Flex>
    )
}
