import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";
import {
  useSwitchNetwork,
  useNetwork,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  useAccount,
} from "wagmi";
import Card from "./card";
import abi from "../../utils/abi.json";
import { saveEvent } from "../../utils/utils";
import { contract, chainId, createEvent } from "../../utils/config";
import { ethers } from "ethers";
import { useToast } from "@chakra-ui/react";

function Confirm({
  name,
  description,
  image,
  date,
  price,
  capacity,
  tags,
  location,
  onOpen,
  isOpen,
  onClose,
  onSuccess,
}) {
  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const [saveEventLoading, setSaveEventLoading] = useState(false);
  const [saveEventError, setSaveEventError] = useState(false);
  const [saveEventSuccess, setSaveEventSuccess] = useState(false);
  const timestamp = new Date(date).getTime() / 1000;
  const toast = useToast();
  const { address } = useAccount();
  const showError = () => {
    toast({
      title: "Error saving the event. Try later!",
      status: "error",
      isClosable: true,
    });
  };
  const showSuccess = () => {
    toast({
      title: "Event saved!",
      status: "success",
      isClosable: true,
    });
    onClose(true);
    onSuccess();
  };
  const convertedPrice = ethers.utils.parseUnits(price, "ether");

  const { config, isError: prepareError } = usePrepareContractWrite({
    address: contract,
    abi: abi,
    chainId: chainId,
    functionName: createEvent,
    args: [capacity, convertedPrice, timestamp],
  });
  const {
    isLoading: writeIsLoading,
    isSuccess: writeSuccess,
    isError: writeError,
    data: writeData,
    write,
  } = useContractWrite(config);

  const { isError, isSuccess, isLoading } = useWaitForTransaction({
    hash: writeData?.hash,
    onSuccess(data) {
      let abi =
        '[{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "user","type": "address"},{"indexed": false,"internalType": "uint256","name": "id","type": "uint256"},{"indexed": false,"internalType": "bool","name": "isOwner","type": "bool"}],"name": "UserEvents","type": "event"}]';
      let iface = new ethers.utils.Interface(abi);

      const logs = iface.parseLog(data.logs[0]);
      const id = logs.args.id.toNumber();

      setSaveEventLoading(true);
      saveEvent(
        id,
        name,
        description,
        image,
        price,
        timestamp,
        location,
        address,
        tags
      )
        .catch(() => setSaveEventError(true))
        .then(() => setSaveEventSuccess(true))
        .finally(() => setSaveEventLoading(false));
    },
  });

  const loading = writeIsLoading || isLoading || saveEventLoading;
  const error = writeError || isError || saveEventError;
  const success = writeSuccess && isSuccess && saveEventSuccess;

  useEffect(() => {
    if (error) {
      showError();
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      showSuccess();
    }
  }, [success]);

  const handleOnClick = async () => {
    if (!prepareError) {
      if (chain.id !== chainId) {
        await switchNetworkAsync(chainId);
      }

      write();
    } else {
    }
  };
  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Card
              name={name}
              description={description}
              image={image}
              date={date}
              price={price}
              location={location}
              tags={tags}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={loading}
              colorScheme="blue"
              mr={3}
              onClick={handleOnClick}
            >
              Create
            </Button>
            <Button onClick={onClose} variant="ghost">
              Go back
            </Button>{" "}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Confirm;
