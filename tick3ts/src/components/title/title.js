import { Flex, Box, Text, Heading, Spacer } from "@chakra-ui/react";

function Header() {
  return (
    <Flex m={8} alignItems="center" gap="2">
      <Spacer />

      <Box maxW="32rem">
        <Heading>Tick3ts</Heading>
        <Text fontSize="xl">All the web3 events</Text>
      </Box>
      <Spacer />
    </Flex>
  );
}

export default Header;
