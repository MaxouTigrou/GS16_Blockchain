import React, { useEffect, useState } from "react";
import Web3 from "web3";
import contractDetails from "./contractDetails.json"; // Import du fichier JSON
import "./App.css";

const App = () => {
  const [account, setAccount] = useState(""); // Adresse Ethereum connectée
  const [contract, setContract] = useState(null); // Instance du smart contract
  const [logs, setLogs] = useState([]); // Liste des logs
  const [newLog, setNewLog] = useState(""); // Nouveau message
  const [isLoading, setIsLoading] = useState(false); // Indicateur de chargement
  const [editingLogId, setEditingLogId] = useState(null); // Log en cours d'édition
  const [editedMessage, setEditedMessage] = useState(""); // Message édité

  // Initialisation de Web3 et connexion au contrat
  useEffect(() => {
    const initWeb3 = async () => {
      try {
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum);
          await window.ethereum.request({ method: "eth_requestAccounts" });

          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]);

          // Récupération des détails depuis le fichier JSON
          const { address, abi } = contractDetails;

          // Initialisation du contrat
          const contractInstance = new web3.eth.Contract(abi, address);
          setContract(contractInstance);

          // Chargement initial des logs
          await loadLogs(contractInstance);

          // Écouter le changement de compte dans MetaMask
          window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length > 0) {
                setAccount(accounts[0]); // Mettre à jour l'adresse du compte
                loadLogs(contractInstance); // Recharger les logs pour ce nouveau compte
            } else {
                alert("No accounts found. Please connect a wallet.");
            }
        });
        
        } else {
          alert("Ethereum wallet is not detected. Install MetaMask!");
        }
      } catch (error) {
        console.error("Error initializing Web3 or contract:", error);
      }
    };

    initWeb3();
  }, []);

  // Fonction pour charger les logs
  const loadLogs = async (contractInstance) => {
    try {
      const logData = await contractInstance.methods.getAllLogs().call();

      console.log(logData);

      // Vérifie si des logs sont présents
      if (logData.length > 0) {
        // Transforme les logs en format lisible
        const parsedLogs = logData.map((log, index) => ({
          id: index,
          message: log.message,
          author: log.author,
          timestamp: new Date(Number(log.timestamp) * 1000).toLocaleString(),
        }));
        setLogs(parsedLogs);
      } else {
        console.log("Aucun log trouvé sur la blockchain.");
      }
    } catch (error) {
      console.error("Error loading logs:", error);
    }
  };

  // Fonction pour ajouter un log
  const addLog = async () => {
    if (!newLog.trim()) {
      alert("Log message cannot be empty!");
      return;
    }

    setIsLoading(true); // Active le chargement

    try {
      await contract.methods.createLog(newLog).send({ from: account });
      setNewLog(""); // Réinitialise le champ
      loadLogs(contract); // Recharge les logs
    } catch (error) {
      console.error("Error adding log:", error);
    }

    setIsLoading(false); // Désactive le chargement
  };

  // Fonction pour modifier un log
  const editLog = async (id, newMessage) => {
    if (!newMessage.trim()) {
      alert("Log message cannot be empty!");
      return;
    }

    setIsLoading(true);

    try {
      await contract.methods.updateLog(id, newMessage).send({ from: account });
      setEditingLogId(null); // Annuler l'édition
      setEditedMessage(""); // Réinitialiser le message édité
      loadLogs(contract); // Recharger les logs
    } catch (error) {
      console.error("Error editing log:", error);
    }

    setIsLoading(false);
  };

  // Fonction pour afficher le bouton de modification
  const handleEditButton = (logId, logMessage) => {
    setEditingLogId(logId);
    setEditedMessage(logMessage);
  };

  // Fonction pour annuler l'édition d'un log
  const cancelEdit = () => {
    setEditingLogId(null); // Annuler l'édition
    setEditedMessage(""); // Réinitialiser le message édité
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Blockchain Logs</h1>
        <p>
          Connecté avec : <strong>{account}</strong>
        </p>
      </header>

      <main>
        <div className="log-input">
          <textarea
            placeholder="Écris ton message ici..."
            value={newLog}
            onChange={(e) => setNewLog(e.target.value)}
          ></textarea>
          <button onClick={addLog} disabled={isLoading}>
            {isLoading ? "Ajout en cours..." : "Ajouter un log"}
          </button>
        </div>

        <div className="log-list">
          <h2>Historique des Logs</h2>
          {logs.length > 0 ? (
            <ul>
              {logs.map((log) => (
                <li key={log.id}>
                  <p><strong>Message :</strong> {log.message}</p>
                  <p><strong>Auteur :</strong> {log.author}</p>
                  <p className="timestamp"><strong>Date :</strong> {log.timestamp}</p>

                  <div className="log-actions">
                    {editingLogId === log.id ? (
                      <div>
                        <textarea
                          value={editedMessage}
                          onChange={(e) => setEditedMessage(e.target.value)}
                        ></textarea>
                        <button onClick={() => editLog(log.id, editedMessage)} disabled={isLoading}>
                          {isLoading ? "Modification en cours..." : "Modifier"}
                        </button>
                        <button onClick={cancelEdit} disabled={isLoading}>
                          Annuler
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => handleEditButton(log.id, log.message)}>
                        Modifier
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucun log disponible pour le moment.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
