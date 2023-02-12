import React, { useState, useEffect } from "react";
import {
  contract,
  chainId,
  buyTicket,
  getBalance,
  hasATicket,
  isOwner,
} from "../../utils/config";
import { getBadge, formatTags } from "../../utils/utils";
import {
  Image,
  Box,
  Flex,
  ButtonGroup,
  Badge,
  AspectRatio,
  Button,
  Text,
} from "@chakra-ui/react";
import abi from "../../utils/abi.json";
import {
  useAccount,
  useSwitchNetwork,
  useNetwork,
  useContractWrite,
  usePrepareContractWrite,
  useContractRead,
} from "wagmi";
import { ethers } from "ethers";
import Withdraw from "./withdraw";
import { useToast } from "@chakra-ui/react";

function Event({
  id,
  name,
  description,
  price,
  image,
  location,
  timestamp,
  rate,
  tags,
}) {
  const toast = useToast();

  const showSuccess = () => {
    toast({
      title: "Ticket bought!",
      status: "success",
      isClosable: true,
    });
  };
  const today = new Date();
  const eventDay = new Date(timestamp);
  const expired = eventDay >= today;
  const [enableReadMore, setEnableReadMore] = useState(false);
  const [openNewEventModal, setOpenNewEventModal] = useState(false);
  const [canWithdraw, setCanWithdraw] = useState(false);
  const [eventBalance, setEventBalance] = useState(false);
  function toggleReadMore() {
    setEnableReadMore(!enableReadMore);
  }
  const openModal = () => {
    setOpenNewEventModal(true);
  };
  const closeModal = () => {
    setOpenNewEventModal(false);
  };
  const date = new Date(timestamp * 1000);
  const { address, isConnected } = useAccount();

  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();

  const { config } = usePrepareContractWrite({
    address: contract,
    abi: abi,
    chainId: chainId,
    functionName: buyTicket,
    args: [id],
    overrides: {
      value: ethers.utils.parseEther(price.toString()),
    },
  });
  const {
    isLoading: writeIsLoading,
    isSuccess: writeSuccess,
    write,
  } = useContractWrite(config);

  const {
    data: eventMoney,
    isLoading: moneyIsLoading,
    isSuccess: moneyIsSuccess,
  } = useContractRead({
    address: contract,
    abi: abi,
    functionName: getBalance,
    args: [id],
  });

  const { data: userHasATicket } = useContractRead({
    address: contract,
    abi: abi,
    functionName: hasATicket,
    args: [id, address],
  });
  useEffect(() => {
    if (moneyIsSuccess) {
      const balance = ethers.utils.formatEther(eventMoney);
      setEventBalance(balance);
      setCanWithdraw(Number(balance) > 0);
    }
  }, [moneyIsSuccess, eventMoney]);
  const { data: userIsOwner, isLoading: isOwnerLoading } = useContractRead({
    address: contract,
    abi: abi,
    functionName: isOwner,
    args: [id, address],
  });
  const usd = price * rate;
  const handleOnClick = async () => {
    if (chain.id !== chainId) {
      await switchNetworkAsync(chainId);
    }
    if (!userHasATicket) {
      write();
    }
  };
  useEffect(() => {
    if (writeSuccess) {
      showSuccess();
    }
  }, [writeSuccess]);

  return (
    <Box
      maxW="md"
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
            {getBadge(eventDay)}
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
        <br />
        <br />
        <Box>
          {price === "0" ? (
            <Text as="mark">FREE</Text>
          ) : (
            <Text fontSize="md">
              ETH {Number(price).toFixed(2)}
              {" - "}
              (USD {usd.toFixed(2)})
            </Text>
          )}
        </Box>
        {enableReadMore && (
          <Box>
            <Flex direction="column">
              <Text as="cite">{description}</Text>
            </Flex>
          </Box>
        )}
        <Box display="flex" mt="2" alignItems="center">
          <ButtonGroup gap="4">
            <Button
              isLoading={writeIsLoading || moneyIsLoading || isOwnerLoading}
              isDisabled={
                expired ||
                !isConnected ||
                (!userIsOwner && userHasATicket) ||
                writeSuccess ||
                (userIsOwner && !canWithdraw)
              }
              colorScheme={
                userIsOwner
                  ? "blue"
                  : userHasATicket || writeSuccess
                  ? "pink"
                  : "teal"
              }
              variant="solid"
              onClick={userIsOwner ? openModal : handleOnClick}
            >
              {expired
                ? "Expired"
                : !isConnected
                ? "Connect first!"
                : userIsOwner
                ? canWithdraw
                  ? "Wtihdraw"
                  : "No funds yet"
                : userHasATicket || writeSuccess
                ? "You have tickets"
                : "Get tickets"}
            </Button>
            {openNewEventModal && (
              <Withdraw
                id={id}
                price={eventBalance}
                rate={rate}
                isOpen={openNewEventModal}
                onClose={closeModal}
              />
            )}
            {description && (
              <Button
                colorScheme="teal"
                variant="ghost"
                onClick={toggleReadMore}
              >
                Read {enableReadMore ? "less" : "more"}
              </Button>
            )}
          </ButtonGroup>
        </Box>
      </Box>
    </Box>
  );
}

export default Event;
