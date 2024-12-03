import React, { useEffect, useState } from "react";
import Web3 from "web3";
import contractDetails from "./contractDetails.json"; // Import des détails du contrat
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

          // Récupération des détails du contrat
          const { address, abi } = contractDetails;
          const contractInstance = new web3.eth.Contract(abi, address);
          setContract(contractInstance);

          // Chargement initial des logs
          await loadLogs(contractInstance);

          // Écouter les changements de compte dans MetaMask
          window.ethereum.on("accountsChanged", (accounts) => {
            if (accounts.length > 0) {
              setAccount(accounts[0]); // Mise à jour du compte
              loadLogs(contractInstance); // Recharge les logs
            } else {
              alert("Aucun compte détecté. Veuillez connecter un portefeuille.");
              setAccount(""); // Réinitialise le compte si aucun n'est trouvé
            }
          });
        } else {
          alert("Aucun portefeuille Ethereum détecté. Installez MetaMask !");
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation de Web3 ou du contrat :", error);
      }
    };

    initWeb3();
  }, []);

  // Fonction pour charger les logs
  const loadLogs = async (contractInstance) => {
    try {
      const logData = await contractInstance.methods.getAllLogs().call();
      if (logData.length > 0) {
        const parsedLogs = logData.map((log, index) => ({
          id: index,
          message: log.message,
          author: log.author,
          timestamp: new Date(Number(log.timestamp) * 1000).toLocaleString(),
        }));
        setLogs(parsedLogs);
      } else {
        setLogs([]); // Vide les logs si aucun n'est trouvé
      }
    } catch (error) {
      console.error("Erreur lors du chargement des logs :", error);
    }
  };

  // Fonction pour ajouter un log
  const addLog = async () => {
    if (!newLog.trim()) {
      alert("Le message du log ne peut pas être vide !");
      return;
    }

    setIsLoading(true);

    try {
      await contract.methods.createLog(newLog).send({ from: account });
      setNewLog(""); // Réinitialise le champ d'entrée
      await loadLogs(contract); // Recharge les logs après l'ajout
    } catch (error) {
      console.error("Erreur lors de l'ajout du log :", error);
    }

    setIsLoading(false);
  };

  // Fonction pour modifier un log
  const editLog = async (id, newMessage) => {
    if (!newMessage.trim()) {
      alert("Le message du log ne peut pas être vide !");
      return;
    }

    setIsLoading(true);

    try {
      const response = await contract.methods.updateLog(id, newMessage).send({ from: account });
      console.log(response);
      setEditingLogId(null);
      setEditedMessage("");
      await loadLogs(contract); // Recharge les logs après la modification
    } catch (error) {
      console.error("Erreur lors de la modification du log :", error);
    }

    setIsLoading(false);
  };

  // Gestion de l'édition d'un log
  const handleEditButton = (logId, logMessage) => {
    setEditingLogId(logId);
    setEditedMessage(logMessage);
  };

  const cancelEdit = () => {
    setEditingLogId(null);
    setEditedMessage("");
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Blockchain Logs</h1>
        <p>
          Connecté avec : <strong>{account || "Non connecté"}</strong>
        </p>
      </header>

      <main>
        <div className="log-input">
          <textarea
            placeholder="Écris ton message ici..."
            value={newLog}
            onChange={(e) => setNewLog(e.target.value)}
            disabled={!account || isLoading}
          ></textarea>
          <button onClick={addLog} disabled={isLoading || !account}>
            {isLoading ? "Ajout en cours..." : "Ajouter un log"}
          </button>
        </div>

        <div className="log-list">
          <h2>Historique des Logs</h2>
          {logs.length > 0 ? (
            <ul>
              {logs.map((log) => (
                <li key={`${log.id}-${log.author}`}>
                  <p>
                    <strong>Message :</strong> {log.message}
                  </p>
                  <p>
                    <strong>Auteur :</strong> {log.author}
                  </p>
                  <p className="timestamp">
                    <strong>Date :</strong> {log.timestamp}
                  </p>
                  <div className="log-actions">
                    {editingLogId === log.id ? (
                      <div>
                        <textarea
                          value={editedMessage}
                          onChange={(e) => setEditedMessage(e.target.value)}
                        ></textarea>
                        <button
                          onClick={() => editLog(log.id, editedMessage)}
                          disabled={isLoading}
                        >
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
