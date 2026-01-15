// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract SimpleStorage {
    address public owner;
    uint256 private storedValue;

    event OwnerSet(address indexed owner);
    event ValueUpdated(uint256 newValue);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        emit OwnerSet(owner);
    }

    function setValue(uint256 _value) public onlyOwner {
        storedValue = _value;
        emit ValueUpdated(_value);
    }

    function getValue() public view returns (uint256) {
        return storedValue;
    }
}
