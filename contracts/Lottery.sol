// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Lottery{
    address public manager;
    address[] public players;
    
    constructor(){
        manager = msg.sender;
    }
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    function enter() payable public{
        require(msg.value >= 0.01 ether);
        players.push(msg.sender);
    } 
    
    function random() private view returns (uint) {
        return uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
    }
    
    function pickWinner() public restricted {
        uint index = random() % players.length;
        payable(players[index]).transfer(address(this).balance);
        players = new address[](0);
    }
    
    function getPlayers() public view returns (address[] memory){
        return players;
    }
    
    
}