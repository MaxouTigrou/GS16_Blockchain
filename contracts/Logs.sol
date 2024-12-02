// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Logs {
    struct Log {
        string message;
        address author;
        uint256 timestamp;
    }

    Log[] public logs;

    event LogCreated(uint256 id, string message, address indexed author, uint256 timestamp);
    event LogUpdated(uint256 id, string oldMessage, string newMessage);

    // Fonction pour créer un log
    function createLog(string memory _message) public {
        require(bytes(_message).length > 0, "Message cannot be empty");
        logs.push(Log(_message, msg.sender, block.timestamp));
        emit LogCreated(logs.length - 1, _message, msg.sender, block.timestamp);
    }

    // Fonction pour récupérer tous les logs
    function getAllLogs() public view returns (Log[] memory) {
        return logs;
    }

    // Fonction pour modifier un log existant
    function updateLog(uint256 _logId, string memory _newMessage) public {
        require(_logId < logs.length, "Log does not exist");
        require(msg.sender == logs[_logId].author, "Only the author can modify this log");
        require(bytes(_newMessage).length > 0, "New message cannot be empty");

        string memory oldMessage = logs[_logId].message;
        logs[_logId].message = _newMessage;

        emit LogUpdated(_logId, oldMessage, _newMessage);
    }
}
