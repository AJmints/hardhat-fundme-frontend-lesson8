import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")
connectButton.onclick = connect // onclick and onClick are different methods...
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        try {
            await window.ethereum.request({method: "eth_requestAccounts"})
        } catch (error) {
            console.log(error)
        }       
        document.getElementById("connectButton").innerHTML = "Connected!"
        const accounts = await ethereum.request({method: "eth_accounts"})
        console.log(accounts)
    } else {
        console.log("Nothing present")
    }
}


// fund function

async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    if (typeof window.ethereum !== "undefined") {
        // We need...
        // provider / connection to the blockchain
        // signer / wallet / someone with gas
        // contract that we are interacting with
        // ^ ABI & Address
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
        const transactionResponse = await contract.fund({
            value: ethers.utils.parseEther(ethAmount)
        })
        // listen for the tx to be mined //// might be different with Eth2.0 POS
        // listen for an event (when the transaction is complete! )
        await listenForTransactionMined(transactionResponse, provider)
        console.log("Complete! \nSee code use of Promise in 'listenForTransactionMined' function for messages to show in order with async functions")
    } catch (error) {
            console.log(error)
        }
    }
}

function listenForTransactionMined(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`)
    // return new Promise() // create a listener for the blockchain
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(`Completed with ${transactionReceipt.confirmations} confirmations`)
            resolve()
        })
    })
}

// withdraw function

async function withdraw() {
    if (typeof window.ethereum != "undefined") {
        console.log("withdrawing...")
        const provider = ((window.ethereum != null) ? new ethers.providers.Web3Provider(window.ethereum) : ethers.providers.getDefaultProvider())
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMined(transactionResponse, provider)
        } catch (error) {
            console.log(error)
        }
    }
}

// get balance button

async function getBalance() {
    if (typeof window.ethereum != "undefined") {
        const provider = ((window.ethereum != null) ? new ethers.providers.Web3Provider(window.ethereum) : ethers.providers.getDefaultProvider());
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}