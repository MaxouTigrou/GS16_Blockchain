module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Adresse du réseau local
      port: 7545,            // Port de Ganache (par défaut)
      network_id: "*"        // Match n'importe quel ID de réseau
    },
  },

  // Configuration pour le compilateur Solidity
  compilers: {
    solc: {
      version: "0.8.0",      // Version spécifique de Solidity
    },
  },
};
