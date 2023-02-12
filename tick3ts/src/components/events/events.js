import React from "react";
import { Flex, Box } from "@chakra-ui/react";
import Event from "./event";

function Events({ events, rate }) {
  return (
    <Box ml={16} mr={16} alignItems="center" gap="2">
      {events.map((_event, i) => {
        return (
          <Flex key={i}>
            {_event.map((e) => {
              return (
                <Box m={3} p="4" key={e.id}>
                  <Event {...e} rate={rate} key={e.id} />
                </Box>
              );
            })}
          </Flex>
        );
      })}
    </Box>
  );
}

export default Events;
