import React, { useState, useEffect } from "react";
import { Flex, Input } from "@chakra-ui/react";

function Search({ setFilter }) {
  const [text, setText] = useState("");
  const handleTextChange = (e) => setText(e.target.value);
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      setFilter({ name: text });
      setText("");
    }
  };
  return (
    <Flex align="center" ml={8} mr={8}>
      <Input
        onKeyDown={handleKeyDown}
        onChange={handleTextChange}
        value={text}
      />
    </Flex>
  );
}

export default Search;
