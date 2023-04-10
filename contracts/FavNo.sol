// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract favNo {
    uint public favNumber;

    function setFavNo(uint _num) public {
        favNumber = _num;
    }

    function getFavNo() public view returns (uint) {
        return favNumber;
    }
}
