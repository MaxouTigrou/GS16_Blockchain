require("dotenv").config();
const Web3 = require("web3");
const fs = require("fs");

// Configure Web3
const web3 = new Web3("http://127.0.0.1:7545"); // RPC Ganache

// Charger ABI et adresse du contrat
const contractABI = JSON.parse(fs.readFileSync("./build/contracts/Logs.json")).abi;
const contractAddress = "ADRESSE_DU_CONTRAT"; // Adresse après déploiement

const contract = new web3.eth.Contract(contractABI, contractAddress);

// Exemple de fonction pour ajouter un log
async function createLog(message) {
    const accounts = await web3.eth.getAccounts();
    await contract.methods.createLog(message).send({ from: accounts[0] });
    console.log("Log ajouté avec succès !");
}

// Exemple d'API simple
const express = require("express");
const app = express();
app.use(express.json());

app.post("/logs", async (req, res) => {
    try {
        const { message } = req.body;
        const accounts = await web3.eth.getAccounts();
        await contract.methods.createLog(message).send({ from: accounts[0] });
        res.send({ success: true, message: "Log ajouté" });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get("/logs", async (req, res) => {
    try {
        const logs = await contract.methods.getAllLogs().call();
        res.send(logs);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(3000, () => console.log("API running on http://localhost:3000"));
