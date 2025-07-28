// Global variables for reuse
let provider;
let signer;
let contract;

// 🔐 Your deployed contract address on Sepolia
const contractAddress = "0xD3906A5d6B2a4912F116F5e342a8428804829871";

// 🔧 Only this ABI is needed for claim() function
const abi = [
  {
    "inputs": [],
    "name": "claim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// 🟢 Connect MetaMask wallet
async function connectWallet() {
  if (typeof window.ethereum === 'undefined') {
    alert("MetaMask not detected. Please install it!");
    return;
  }

  try {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    const address = await signer.getAddress();
    contract = new ethers.Contract(contractAddress, abi, signer);

    document.getElementById("status").innerText = `Connected: ${address}`;
    console.log("Connected wallet address:", address);
  } catch (err) {
    console.error("Error connecting wallet:", err);
    alert("Wallet connection failed. Check console for details.");
  }
}

// 🪂 Execute claim() function
async function claimAirdrop() {
  if (!contract) {
    alert("Please connect your wallet first.");
    return;
  }

  try {
    const tx = await contract.claim({
      gasLimit: 100000,
      maxFeePerGas: ethers.utils.parseUnits("100", "gwei"),
      maxPriorityFeePerGas: ethers.utils.parseUnits("2", "gwei")
    });
    console.log("Transaction sent:", tx.hash);
    document.getElementById("status").innerText = "Claim submitted, waiting for confirmation...";

    await tx.wait();
    document.getElementById("status").innerText = "✅ Claim successful!";
  } catch (err) {
    console.error("Claim failed:", err);
    document.getElementById("status").innerText = "❌ Claim failed or already claimed.";
  }
}
