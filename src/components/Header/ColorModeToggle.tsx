import { useTheme, useColorModeValue, Button, ButtonProps, Flex, useColorMode } from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons"

export default function ColorModeToggle(props: ButtonProps) {
    const customTheme = useTheme()
    const { colorMode, toggleColorMode } = useColorMode()

    return (
        <Flex justifyContent="center" alignItems="top">
            <Button
                bg={useColorModeValue(customTheme.contentBackground.color.light, customTheme.contentBackground.color.dark)}
                _hover={{ bg: useColorModeValue(customTheme.contentBackground.hoverColor.light, customTheme.contentBackground.hoverColor.dark) }}
                marginLeft={"20px"}
                padding={"0px"}
                borderRadius={"20px"}
                aria-label="Toggle Color Mode"
                onClick={() => {
                    toggleColorMode()
                }}
                _focus={{ boxShadow: "none" }}
                w="fit-content"
                {...props}
            >
                {colorMode === "light" ? <FontAwesomeIcon icon={faMoon} size={"lg"} /> : <FontAwesomeIcon icon={faSun} size={"lg"} />}
            </Button>
        </Flex>
    )
}
