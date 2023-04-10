import { useState, useEffect } from "react";
import { ethers } from "ethers";
import favNo_abi from "../artifacts/contracts/FavNo.sol/favNo.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [favNo, setFavNo] = useState(undefined);
  const [number, setNumber] = useState(0);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const favnoABI = favNo_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  }
  const [favourite, setFavourite] = useState(0);

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async () => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }

    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    console.log("getFavNoContract called");
    getFavNoContract();
  };

  const getFavNoContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const favNoContract = new ethers.Contract(contractAddress, favnoABI, signer);
    console.log("favNoContract is ", favNoContract);

    setFavNo(favNoContract);
    console.log("favNoContract is ", favNo.address)
  }

  const getFavNumber = async () => {
    console.log("getFavNumber clicked");
    if (favNo) {
      setNumber((await favNo.getFavNo()).toNumber());
      console.log("favNo is ", number);
    }
    else {
      setNumber(favourite);
      console.log("favNo is not set");
    }
  }

  const setFavNumber = async () => {
    console.log("setFavNumber clicked");
    if (favNo) {
      let tx = await favNo.setFavNo(5);
      await tx.wait();
      console.log("favNo is set to 5");
      // getBalance();
    } else {
      setFavourite(5);
      console.log("favNo is not set");
    }
  }



  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    // if (balance == undefined) {
    //   getBalance();
    // }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Favourite Number : {number}</p>
        <button onClick={getFavNumber}>get Fav number</button>
        <button onClick={setFavNumber}>set fav number to 5</button>
      </div>
    )
  }

  useEffect(() => { getWallet() });

  return (
    <main className="container">
      <header><h1>This is Sample Frontend integration project</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center
        }
      `}
      </style>
    </main>
  )
}