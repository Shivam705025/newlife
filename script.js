import { Token } from '@solana/web3.js';
    const connectButton = document.getElementById("connectWallet");
const transferButton = document.getElementById("transferTokens");
const statusElement = document.getElementById("status");

connectButton.addEventListener("click", async () => {
  try {
    const connection = new solanaWeb3.Connection("https://api.mainnet-beta.solana.com");
    await window.solana.connect();
    const provider = window.solana; // Access wallet provider globally
    const wallet = await provider.connect();
    const publicKey = wallet.publicKey.toBase58();
    statusElement.textContent = `Connected to wallet: ${publicKey}`;
    transferButton.disabled = false;
  } catch (error) {
    console.error("Error connecting to wallet:", error);
    statusElement.textContent = "Wallet connection failed";
  }
});

transferButton.addEventListener("click", async () => {
  try {
    const tokenAddress = document.getElementById("tokenAddress").value;
    const receiverAddress = document.getElementById("receiverAddress").value;
    const amount = document.getElementById("amount").value;

    const connection = new solanaWeb3.Connection("https://api.mainnet-beta.solana.com");
    const provider = window.solana;
    const wallet = await provider.connect();

    const token = new solanaWeb3.PublicKey(tokenAddress);
    const receiver = new solanaWeb3.PublicKey(receiverAddress);

    const transaction = new solanaWeb3.Transaction({
      feePayer: wallet.publicKey,
      instructions: [
        await Token.createTransferCheckedInstruction(
          token,
          wallet.publicKey,
          receiver,
          wallet.publicKey,
          new solanaWeb3.BN(amount)
        )
      ]
    });

    const signature = await wallet.signTransaction(transaction);
    const result = await connection.sendRawTransaction(signature);

    statusElement.textContent = `Transaction submitted: ${result}`;
  } catch (error) {
    console.error("Error transferring tokens:", error);
    statusElement.textContent = "Transaction failed";
  }
});
