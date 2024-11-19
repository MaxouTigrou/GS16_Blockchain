const Logs = artifacts.require("Logs");
const fs = require("fs");

module.exports = async function (deployer) {
  await deployer.deploy(Logs);

  // Obtenir les informations du contrat
  const address = Logs.address; // Adresse déployée
  const abi = Logs.abi; // L'ABI du contrat

  // Construire un objet JSON
  const contractDetails = {
    address: address,
    abi: abi,
  };

  // Écrire cet objet dans un fichier JSON
  const filePath = "./frontend/src/contractDetails.json";
  fs.writeFileSync(filePath, JSON.stringify(contractDetails, null, 2), "utf-8");

  console.log(`Fichier contractDetails.json généré dans ${filePath} !`);
};