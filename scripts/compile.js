/**
 * Script Helper per compilazione e deploy "ignite"
 *
 * Scopo:
 *  - Pulire cartelle temporanee (cache, artifacts, ignition/deployments)
 *  - Compilare i contratti tramite Hardhat (npx hardhat compile)
 *  - Eseguire il deploy con hardhat-ignition (npx hardhat ignition deploy ...)
 *  - Leggere il file ignition/deployments/chain-1337/deployed_addresses.json per ricavare
 *    l'indirizzo del contratto deployato
 *  - Aggiornare frontend/.env sostituendo (o aggiungendo) la variabile VITE_CONTRACT_ADDRESS
 *  - Copiare l'artifact JSON del contratto compilato (artifacts/contracts/FunkoPopMarketplace.sol/...)
 *    nella cartella frontend/src/contracts per poterlo importare nel frontend
 *
 * Uso:
 *  - Eseguire: node scripts/compile.js  (o via npm script che punta a questo file)
 *
 * Nota sulla robustezza:
 *  - Lo script fa uso di fs.rmSync (o rmdirSync fallback) per cancellare ricorsivamente directory.
 *  - Esegue i comandi shell con execSync e stdio: "inherit" per vedere l'output in console.
 *  - Gestisce i casi in cui i file non esistono e logga avvisi/err di conseguenza.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

/**
 * removeDir
 * Rimuove ricorsivamente una directory se esiste.
 * Utilizza fs.rmSync se presente (Node >= 14.14+), altrimenti fs.rmdirSync con recursive.
 *
 * Parametri:
 *  - dirPath (string): percorso della directory da rimuovere
 *
 * Comportamento:
 *  - Se la directory non esiste, non fa nulla.
 *  - In caso di errore logga l'errore ma non rilancia (permette al chiamante di decidere il comportamento).
 */
function removeDir(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  try {
    if (fs.rmSync) {
      // API moderna: rimuove ricorsivamente e forzatamente
      fs.rmSync(dirPath, { recursive: true, force: true });
    } else {
      // Fallback per versioni più vecchie di Node
      fs.rmdirSync(dirPath, { recursive: true });
    }
    console.log(`Rimosso: ${dirPath}`);
  } catch (err) {
    // Log dell'errore per debugging (es. permessi, file lock)
    console.error(`Errore rimuovendo ${dirPath}:`, err.message || err);
  }
}

/**
 * runCommand
 * Esegue un comando shell in modo sincrono e stampa l'output direttamente in console.
 *
 * Parametri:
 *  - cmd (string): comando da eseguire
 *  - cwd (string, opzionale): working directory in cui eseguire il comando (default: process.cwd())
 *
 * Notare: execSync lancerà un'eccezione in caso di fallimento del comando.
 */
function runCommand(cmd, cwd = process.cwd()) {
  console.log(`Eseguo: ${cmd}`);
  execSync(cmd, { stdio: "inherit", cwd });
}

/**
 * findFirstAddressInObject
 * Cerca ricorsivamente il primo valore stringa che corrisponde al pattern di un indirizzo Ethereum.
 *
 * Parametri:
 *  - obj (object): oggetto JSON (o struttura annidata) da analizzare
 *
 * Restituisce:
 *  - string|null: il primo indirizzo trovato nel formato 0x + 40 hex, oppure null se non trovato
 *
 * Dettagli:
 *  - Usa uno stack per evitare ricorsione di profondità e un Set per evitare loop su oggetti ricorsivi (se presenti).
 */
function findFirstAddressInObject(obj) {
  if (!obj || typeof obj !== "object") return null;
  const addrRegex = /^0x[a-fA-F0-9]{40}$/;
  const visited = new Set();
  const stack = [obj];

  while (stack.length) {
    const cur = stack.pop();
    if (!cur || visited.has(cur)) continue;
    visited.add(cur);
    if (typeof cur === "string" && addrRegex.test(cur)) return cur;
    if (typeof cur === "object") {
      for (const k of Object.keys(cur)) {
        const v = cur[k];
        if (typeof v === "string" && addrRegex.test(v)) return v;
        if (typeof v === "object") stack.push(v);
      }
    }
  }
  return null;
}

/**
 * updateEnvContractAddress
 * Aggiorna (o aggiunge) la riga VITE_CONTRACT_ADDRESS nel file .env del frontend.
 *
 * Parametri:
 *  - envFilePath (string): percorso del file .env da aggiornare
 *  - newAddress (string): nuovo indirizzo del contratto (es. 0xabc...)
 *
 * Note:
 *  - Se la variabile è già presente la sostituisce (match linea via regex multi-linea).
 *  - Se non è presente la aggiunge in coda, assicurandosi che il file finisca con newline.
 */
function updateEnvContractAddress(envFilePath, newAddress) {
  let content = "";
  if (fs.existsSync(envFilePath)) {
    content = fs.readFileSync(envFilePath, "utf8");
  }

  const line = `VITE_CONTRACT_ADDRESS=${newAddress}`;
  if (/^VITE_CONTRACT_ADDRESS=/m.test(content)) {
    // Sostituisci la riga esistente
    content = content.replace(/^VITE_CONTRACT_ADDRESS=.*$/m, line) + "\n";
  } else {
    // Aggiungi la variabile in fondo al file (crea newline se necessario)
    if (content.length && !content.endsWith("\n")) content += "\n";
    content += line + "\n";
  }

  fs.writeFileSync(envFilePath, content, "utf8");
  console.log(`Aggiornato ${envFilePath} con ${newAddress}`);
}

/**
 * copyArtifactToFrontend
 * Copia l'artifact JSON del contratto compilato dalla cartella artifacts/ al frontend.
 * Questo permette al frontend di importare ABI e bytecode (se necessario).
 *
 * Percorso sorgente atteso:
 * artifacts/contracts/FunkoPopMarketplace.sol/FunkoPopMarketplace.json
 *
 * Destinazione:
 * frontend/src/contracts/FunkoPopMarketplace.json
 *
 * Se la sorgente non esiste viene lanciata un'eccezione.
 */
function copyArtifactToFrontend(projectRoot) {
  const src = path.join(
    projectRoot,
    "artifacts",
    "contracts",
    "FunkoPopMarketplace.sol",
    "FunkoPopMarketplace.json"
  );
  const destDir = path.join(projectRoot, "frontend", "src", "contracts");
  const dest = path.join(destDir, "FunkoPopMarketplace.json");

  if (!fs.existsSync(src)) {
    throw new Error(`Artifact sorgente non trovato: ${src}`);
  }

  if (!fs.existsSync(destDir)) {
    // Crea la cartella di destinazione se non esiste (recursive per sottocartelle)
    fs.mkdirSync(destDir, { recursive: true });
    console.log(`Creato directory: ${destDir}`);
  }

  // Copia file sovrascrivendo eventuale precedente artifact
  fs.copyFileSync(src, dest);
  console.log(`Copiato artifact in: ${dest}`);
}

/**
 * main (IIFE)
 * Flusso principale dello script:
 *  - definisce projectRoot come directory superiore rispetto a scripts/
 *  - rimuove cartelle temporanee
 *  - compila i contratti
 *  - esegue il deploy via ignition
 *  - legge il file deployed_addresses.json e tenta di estrarre un indirizzo
 *  - aggiorna frontend/.env e copia l'artifact nel frontend
 *
 * Gestione degli errori:
 *  - In caso di errori critici lo script termina con exitCode 1.
 *  - Alcune condizioni non critiche (es. file deployed non esistente) vengono loggate e l'esecuzione termina con exitCode 0
 *    per segnalare che il deploy è avvenuto ma non è stato possibile aggiornare automaticamente il frontend.
 */
(function main() {
  try {
    const projectRoot = path.resolve(__dirname, "..");

    // 1) Percorsi da rimuovere: cache, artifacts, ignition/deployments
    const toRemove = [
      path.join(projectRoot, "cache"),
      path.join(projectRoot, "artifacts"),
      path.join(projectRoot, "ignition", "deployments"),
    ];
    console.log("Rimozione cartelle...");
    toRemove.forEach(removeDir);

    // 2) Compilazione Hardhat
    //    - Questo comando invoca la compilazione dei contratti nel progetto Hardhat.
    //    - Assicurati di avere tutte le dipendenze installate (node_modules).
    runCommand("npx hardhat compile", projectRoot);

    // 3) Deploy con ignition
    //    - Invoca hardhat-ignition per eseguire lo script di deployment specificato.
    //    - --network ganache è passato esplicitamente (modificalo se usi altra rete).
    runCommand(
      "npx hardhat ignition deploy ./ignition/modules/FunkoPopModule.js --network ganache",
      projectRoot
    );

    // 4) Leggi deployed_addresses.json e aggiorna frontend/.env
    const deployedPath = path.join(
      projectRoot,
      "ignition",
      "deployments",
      "chain-1337",
      "deployed_addresses.json"
    );

    if (!fs.existsSync(deployedPath)) {
      // Se il file non esiste, potrebbe significare che ignition non ha scritto le informazioni
      // o che la rete/chain id è diversa — logghiamo e terminiamo in modo pulito.
      console.warn(
        `File non trovato: ${deployedPath} — nessun aggiornamento .env effettuato.`
      );
      console.log("Operazione completata (senza aggiornare .env).");
      process.exit(0);
    }

    // Parsiamo il JSON di deployed_addresses
    let deployedJson;
    try {
      deployedJson = JSON.parse(fs.readFileSync(deployedPath, "utf8"));
    } catch (err) {
      // Se il JSON non è valido, esci con errore per evitare scritture indesiderate
      console.error(
        "Impossibile parsare deployed_addresses.json:",
        err.message || err
      );
      process.exit(1);
    }

    // Trova il primo indirizzo valido nel JSON (es. 0x...)
    const foundAddress = findFirstAddressInObject(deployedJson);
    if (!foundAddress) {
      // Se non troviamo indirizzi validi non aggiorniamo .env
      console.warn(
        "Nessun indirizzo valido trovato in deployed_addresses.json"
      );
      process.exit(0);
    }

    // Percorso del file .env del frontend da aggiornare
    const envFilePath = path.join(projectRoot, "frontend", ".env");
    try {
      updateEnvContractAddress(envFilePath, foundAddress);
    } catch (err) {
      // In caso di problemi durante la scrittura del file .env è preferibile terminare con errore
      console.error("Errore aggiornando .env:", err.message || err);
      process.exit(1);
    }

    // Copia l'artifact compilato nella cartella frontend/src/contracts.
    // Questo permette al frontend di importare ABI/JSON necessari.
    try {
      copyArtifactToFrontend(projectRoot);
    } catch (err) {
      console.error(
        "Errore copiando l'artifact nel frontend:",
        err.message || err
      );
      process.exit(1);
    }

    console.log(
      "Deploy, aggiornamento .env e copia artifact completati con successo."
    );
    process.exit(0);
  } catch (err) {
    // Catch generico per qualsiasi errore non gestito
    console.error("Script terminato con errore:", err.message || err);
    process.exit(1);
  }
})();
