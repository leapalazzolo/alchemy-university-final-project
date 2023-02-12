import { Menu, Button, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import {
  ChevronDownIcon,
  ViewIcon,
  AddIcon,
  EditIcon,
  UnlockIcon,
} from "@chakra-ui/icons";
import { useDisconnect, useAccount, useConnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { chainId } from "../../utils/config";

function User({ setFilter, createEvent }) {
  const { address } = useAccount();

  const { isConnected, isLoading } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
    chainId: chainId,
  });
  const handleOnClick = () => {
    connect();
  };

  const handleMyEvents = () => {
    setFilter({ owner: address });
  };
  const handleMyTickets = () => {
    setFilter({ assistant: address });
  };
  const handleCreateEvent = () => {
    createEvent(true);
  };
  const { disconnect } = useDisconnect();
  const handleDisconnect = () => {
    disconnect();
  };
  if (isConnected) {
    return (
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          {address.slice(0, 5) + "..." + address.slice(-4)}
        </MenuButton>
        <MenuList>
          <MenuItem icon={<AddIcon />} onClick={handleCreateEvent}>
            Create event
          </MenuItem>
          <MenuItem onClick={handleMyEvents} icon={<EditIcon />}>
            My events
          </MenuItem>
          <MenuItem onClick={handleMyTickets} icon={<ViewIcon />}>
            My tickets
          </MenuItem>
          <MenuItem icon={<UnlockIcon />} onClick={handleDisconnect}>
            Disconnect
          </MenuItem>
        </MenuList>
      </Menu>
    );
  } else {
    return (
      <Button
        mt="2"
        ml="2"
        isLoading={isLoading}
        loadingText="Connecting"
        colorScheme="teal"
        onClick={handleOnClick}
      >
        {"Connect"}
      </Button>
    );
  }
}

export default User;
