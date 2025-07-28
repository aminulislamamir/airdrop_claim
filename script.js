const contractAddress = "0xD3906A5d6B2a4912F116F5e342a8428804829871";

// Replace with your full ABI from Remix or Etherscan if different
const abi = [
  {
    "inputs": [],
    "name": "claim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

let provider, signer, contract;

async function connectWallet() {
  if (!window.ethereum) {
    alert("MetaMask not found. Please install MetaMask.");
    return;
  }

  try {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    const address = await signer.getAddress();
    document.getElementById("status").innerText = "✅ Connected: " + address;
    
    contract = new ethers.Contract(contractAddress, abi, signer);
  } catch (err) {
    console.error("Wallet connection error:", err);
    alert("❌ Failed to connect wallet. Check console.");
  }
}

async function claimAirdrop() {
  if (!contract) {
    alert("Wallet not connected.");
    return;
  }

  try {
    const tx = await contract.claim({ gasLimit: 200000 });
    document.getElementById("status").innerText = "⏳ Claiming...";
    await tx.wait();
    document.getElementById("status").innerText = "✅ Claim successful!";
  } catch (err) {
    console.error("Claim error:", err);
    document.getElementById("status").innerText = "❌ Claim failed. Check console.";
  }
}
