// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract DocumentRegistry {
    mapping(string => uint256) public hashToTimestamp;

    // Store a hash only if it hasn't been stored before
    function storeHash(string memory hash) public {
        // Only store the hash if it's not already in the mapping
        if (hashToTimestamp[hash] == 0) {
            hashToTimestamp[hash] = block.timestamp;
        }
    }

    // Verify a hash
    function verifyHash(string memory hash) public view returns (uint256) {
        return hashToTimestamp[hash];
    }
}
