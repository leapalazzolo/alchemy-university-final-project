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
  Text,
} from "@chakra-ui/react";
import {
  useSwitchNetwork,
  useNetwork,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import abi from "../../utils/abi.json";
import { chainId, contract, withdraw } from "../../utils/config";
import { useToast } from "@chakra-ui/react";

function Withdraw({ id, price, rate, isOpen, onClose }) {
  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const toast = useToast();
  const [message, setMessage] = useState("Loading");

  const showError = () => {
    toast({
      title: "Error withdrawing the event. Try later!",
      status: "error",
      isClosable: true,
    });
  };
  const showSuccess = () => {
    toast({
      title: "Withdraw succesful!",
      status: "success",
      isClosable: true,
    });
    onClose(true);
  };
  const { config } = usePrepareContractWrite({
    address: contract,
    abi: abi,
    chainId: chainId,
    functionName: withdraw,
    args: [id],
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
  });

  const loading = writeIsLoading || isLoading;
  const error = writeError || isError;
  const success = writeSuccess && isSuccess;
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

  useEffect(() => {
    const usd = price * rate;
    setMessage(
      `Do you want to withdraw ETH ${Number(price).toFixed(
        2
      )}  (USD ${usd.toFixed(2)})?`
    );
  }, [price, rate]);

  const handleOnClick = async () => {
    if (chain.id !== chainId) {
      await switchNetworkAsync(chainId);
    }
    write();
  };
  return (
    <>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Withdraw event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="lg">{message}</Text>
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={loading}
              colorScheme="blue"
              mr={3}
              onClick={handleOnClick}
            >
              Withdraw
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

export default Withdraw;
