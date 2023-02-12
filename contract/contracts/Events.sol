// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Events {
    struct Event {
        uint256 id;
        uint256 capacity;
        uint256 price;
        uint256 date;
        address owner;
    }

    mapping(uint256 => Event) public events;
    mapping(address => uint256[]) private userTickets;
    mapping(uint256 => address[]) private assistants;
    mapping(uint256 => uint256) private income;
    uint256 public totalEvents;

    event NewEvent(uint256 id);
    event TicketNumber(uint256 id);
    event EventIncome(uint256 id, uint256 income);
    event UserEvents(address indexed user, uint256 id, bool isOwner);

    modifier onlyEventOwner(uint256 _id, address _owner) {
        require(_isOwner(_id, _owner), "Not the owner");
        _;
    }
    modifier validEvent(uint256 _id) {
        require(totalEvents >= _id, "Event doesn't exist");
        require(events[_id].date > block.timestamp, "Event expired");
        _;
    }
    modifier eventHasCapacity(uint256 _id) {
        require(events[_id].capacity > assistants[_id].length, "Event is full");
        _;
    }
    modifier payIsEnough(uint256 _id) {
        require(msg.value >= events[_id].price, "The payment is not enough");
        _;
    }
    modifier hasNotATicket(uint256 _id, address _assistant) {
        if (_hasATicket(_id, _assistant)) {
            revert("The user has a ticket");
        }
        _;
    }

    function _hasATicket(uint256 _id, address _assistant)
        internal
        view
        returns (bool)
    {
        for (uint256 i = 0; i < assistants[_id].length; i++) {
            if (assistants[_id][i] == _assistant) {
                return true;
            }
        }
        return false;
    }

    function _isOwner(uint256 _id, address _owner)
        internal
        view
        returns (bool)
    {
        if (events[_id].owner == _owner) {
            return true;
        }

        return false;
    }

    function createEvent(
        uint256 _capacity,
        uint256 _price,
        uint256 _date
    ) public {
        require(_date > block.timestamp, "Invalid date");
        require(_capacity > 1, "Invalid capacity");
        events[totalEvents] = Event(
            totalEvents,
            _capacity,
            _price,
            _date,
            msg.sender
        );
        assistants[totalEvents].push(msg.sender);
        userTickets[msg.sender].push(totalEvents);
        emit UserEvents(msg.sender, totalEvents, true);
        totalEvents += 1;
    }

    function buyTicket(uint256 _id)
        public
        payable
        validEvent(_id)
        hasNotATicket(_id, msg.sender)
        eventHasCapacity(_id)
        payIsEnough(_id)
    {
        assistants[_id].push(msg.sender);
        income[_id] += msg.value;
        userTickets[msg.sender].push(_id);
        emit UserEvents(msg.sender, _id, false);
        emit TicketNumber(assistants[_id].length);
    }

    function giveTicket(uint256 _id, address _recipient)
        public
        validEvent(_id)
        onlyEventOwner(_id, msg.sender)
        hasNotATicket(_id, _recipient)
        eventHasCapacity(_id)
    {
        assistants[_id].push(_recipient);
        userTickets[_recipient].push(_id);
        emit UserEvents(_recipient, _id, false);
        emit TicketNumber(assistants[_id].length);
    }

    function hasATicket(uint256 _id, address _assistant)
        public
        view
        validEvent(_id)
        returns (bool)
    {
        return _hasATicket(_id, _assistant);
    }

    function isOwner(uint256 _id, address _assistant)
        public
        view
        validEvent(_id)
        returns (bool)
    {
        return _isOwner(_id, _assistant);
    }

    function withdraw(uint256 _id) public onlyEventOwner(_id, msg.sender) {
        uint256 _income = income[_id];
        income[_id] = 0;
        (bool sent, ) = msg.sender.call{value: _income}("");
        require(sent, "Failed to send Ether");
        emit EventIncome(_id, _income);
    }

    function getBalance(uint256 _id)
        public
        view
        onlyEventOwner(_id, msg.sender)
        returns (uint256)
    {
        return income[_id];
    }

    function ticketsFromUser(address _address)
        public
        view
        returns (uint256[] memory)
    {
        return userTickets[_address];
    }
}
