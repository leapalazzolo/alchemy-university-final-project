import React, { useState } from "react";
import { Spacer, Heading, Flex, Box } from "@chakra-ui/react";
import User from "./user";
import NewEvent from "../events/form";

function Header({ setFilter, onReset, reloadEvents }) {
  const [openNewEventModal, setOpenNewEventModal] = useState(false);
  const openModal = () => {
    setOpenNewEventModal(true);
  };
  const closeModal = () => {
    setOpenNewEventModal(false);
    reloadEvents();
  };
  return (
    <Flex m={2}>
      <Box p="2">
        <Heading as={"button"} onClick={onReset} size="md">
          Tick3ts
        </Heading>
      </Box>
      <Spacer />
      <Box>
        <User createEvent={openModal} setFilter={setFilter} />
      </Box>
      {openNewEventModal && (
        <NewEvent isOpen={openNewEventModal} onClose={closeModal} />
      )}
    </Flex>
  );
}

export default Header;
