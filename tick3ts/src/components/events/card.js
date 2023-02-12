import React from "react";
import { Image, Box, Flex, Badge, AspectRatio, Text } from "@chakra-ui/react";
import { getBadge, formatTags } from "../../utils/utils";

function Card({ name, description, price, image, location, date, tags }) {
  return (
    <Box
      maxW="md"
      maxH="md"
      minW="sm"
      minH="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
    >
      <AspectRatio objectFit="cover" maxW="400px" ratio={16 / 9}>
        <Image src={image} />
      </AspectRatio>

      <Box p="6">
        <Box display="flex" alignItems="baseline">
          <Badge borderRadius="full" px="2" colorScheme="teal">
            {getBadge(new Date(date))}
          </Badge>
          <Box
            color="gray.500"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="xs"
            textTransform="uppercase"
            ml="2"
          >
            {formatTags(tags)}
          </Box>
        </Box>

        <Box
          mt="1"
          fontWeight="semibold"
          as="h2"
          fontSize="2xl"
          lineHeight="tight"
          noOfLines={1}
        >
          {name}
        </Box>
        <Text fontSize="sm" as="abbr">
          {date.toLocaleString()}
        </Text>
        <br />
        <Text fontSize="xs" as="samp">
          {location}
        </Text>
        <Box>
          {price === "0" ? (
            <Text as="mark">FREE</Text>
          ) : (
            <Text fontSize="md"> ETH {Number(price).toFixed(2)}</Text>
          )}
        </Box>

        <Box>
          <Flex direction="column">
            <Text as="cite">{description}</Text>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}

export default Card;
