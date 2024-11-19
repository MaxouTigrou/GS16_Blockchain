// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Logs {
    // Structure pour stocker un log avec son auteur et un timestamp
    struct Log {
        string message;
        address author;
        uint256 timestamp;
    }

    Log[] private logs; // Tableau pour stocker les logs

    // Événement pour notifier lorsqu'un log est créé
    event LogCreated(string message, address indexed author, uint256 timestamp);

    // Fonction pour créer un nouveau log
    function createLog(string memory _message) public {
        require(bytes(_message).length > 0, "Message cannot be empty");

        Log memory newLog = Log({
            message: _message,
            author: msg.sender, // Adresse de l'expéditeur
            timestamp: block.timestamp // Timestamp actuel
        });

        logs.push(newLog); // Ajoute le log au tableau

        emit LogCreated(_message, msg.sender, block.timestamp);
    }

    // Fonction pour récupérer tous les logs
    function getAllLogs() public view returns (Log[] memory) {
        return logs;
    }
}
