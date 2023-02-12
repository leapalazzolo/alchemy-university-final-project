import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Button,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import Confirm from "./confirm";

function Form({ isOpen, onClose }) {
  const [confirm, setConfirm] = React.useState(false);
  const openModal = () => {
    if (isValidForm) {
      setConfirm(true);
    }
  };
  const closeModal = () => {
    setConfirm(false);
  };
  const minPrice = 0.0001;
  const maxPrice = 1;

  const [name, setName] = useState("");
  const [tags, setTags] = useState([]);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState(0);
  const [capacity, setCapacity] = useState(0);
  const [location, setLocation] = useState("");

  const handleNameChange = (e) => setName(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleImageChange = (e) => setImage(e.target.value);
  const handleDateChange = (e) => setDate(e.target.value);
  const handlePriceChange = (value) => setPrice(value);
  const handleCapacityChange = (value) => setCapacity(value);
  const handleLocationChange = (e) => setLocation(e.target.value);
  const handleTagsChange = (e) => setTags(e.target.value.split(","));

  const isNameError = name === "";
  const isImageError = image === "";
  const isDateError =
    date === "" || new Date(date).getTime() < Date.now() + 3600000;

  const isCapacityError = capacity === 0;
  const isPriceError = price < minPrice || price > maxPrice;

  const isValidForm =
    !isNameError &&
    !isImageError &&
    !isDateError &&
    !isCapacityError &&
    !isPriceError;
  return (
    <>
      {confirm && (
        <Confirm
          name={name}
          description={description}
          image={image}
          date={date}
          price={price}
          capacity={capacity}
          tags={tags}
          location={location}
          onOpen={setConfirm}
          isOpen={confirm}
          onClose={closeModal}
          onSuccess={onClose}
        />
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(90deg)"
        />
        <ModalContent>
          <ModalHeader>Create your event</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired isInvalid={isNameError}>
              <FormLabel>Name</FormLabel>
              <Input
                value={name}
                onChange={handleNameChange}
                placeholder="My awesome event"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Here is a Description"
              />
            </FormControl>
            <FormControl isInvalid={isImageError} isRequired mt={4}>
              <FormLabel>Image</FormLabel>
              <Input
                value={image}
                onChange={handleImageChange}
                placeholder="Image"
              />
            </FormControl>
            <FormControl isRequired isInvalid={isDateError} mt={4}>
              <FormLabel>Date</FormLabel>
              <Input
                value={date}
                onChange={handleDateChange}
                placeholder="Select Date and Time"
                size="md"
                type="datetime-local"
              />
            </FormControl>
            <FormControl mt={4} isInvalid={isCapacityError}>
              <FormLabel>Capacity</FormLabel>
              <NumberInput
                step={1}
                min={1}
                max={10000}
                onChange={handleCapacityChange}
                value={capacity}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {/* </InputGroup> */}
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Price</FormLabel>
              <NumberInput
                isRequired
                isInvalid={isPriceError}
                precision={2}
                step={0.1}
                min={minPrice}
                max={maxPrice}
                onChange={handlePriceChange}
                value={price}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {/* </InputGroup> */}
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Location</FormLabel>
              <Input
                value={location}
                onChange={handleLocationChange}
                placeholder="Location"
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Tags</FormLabel>
              <Input
                value={tags}
                onChange={handleTagsChange}
                placeholder="Tags separated by ','"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={openModal} colorScheme="blue" mr={3}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Form;
