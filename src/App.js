import "./App.css";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Browse from "./components/Browse";
import Wallet from "./components/Wallet";
import Token from "./components/Token";
import Collection from "./components/Collection";
import About from "./components/About";
import { ethers } from "ethers";
import styled from "styled-components";
import detectEthereumProvider from "@metamask/detect-provider";
import { NETWORK } from "./config";

const COLLECTIONS = [
  {
    name: "Baby Boo",
    address: "0xf6a4dc2c70e45a43c85151c4afa89f3ea9c463fd",
  },
  {
    name: "Fantums",
    address: "0x0c600d41b9c7656e60c0bf76d79b1532b4770d0c",
  },
  {
    name: "Strange Brew",
    address: "0x9044948e1a934340766c16f094cc32205d60d1b2",
  },
  {
    name: "Shiba Punks",
    address: "0x28908d5795b4d8f4cc175c63523f974412f2a5b1",
  },
  {
    name: "Fantom Rock",
    address: "0xc5fa69f0d478923af8c798cd770f2eed4e40eb99"
  },
  {
    name: "BitUman",
    address: "0x8c2fcd5d857ee9aa19d1a27ae81ab1129385e3ac"
  },
  {
    name: "Fantom Paper",
    address: "0x3192f48983a52450db53e9671ec409e4d6b6d622"
  },
  {
    name: "Fantom Waifus",
    address: "0x92d822978872f12a5d381bd7089461e7ad3634bc"
  },
  {
    name: "Gantom Stone",
    address: "0x3d7071e5647251035271aeb780d832b381fa730f"
  },
  {
    name: "Fantom Mooncats",
    address: "0xb3629177f46686106c8b83d03613041d805ccdcd"
  }
  // {
  //   name: "Joker",
  //   address: "0x29b946156614e8F7710C8F90eC69A7d61303754a"
  // },
  // {
  //   name: "Rick and Morty",
  //   address: "0x7eB14bAbd0D84497Bb4CC32ff2C99df8C2569F12"
  // }
];
const SidebarDiv = styled.div`
  width: 220px;
  height: 100vh;
  overflow: auto;
  border-right: 5px ridge beige;
  background-color: beige;
  padding: 0px 15px;
`;
const MainDiv = styled.div`
  flex: 1;
  height: 100vh;
  overflow: auto;
  padding: 0px 30px;
  background-color: ghostwhite;
`;
const SideBarText = styled.div`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 5px;
`

function App() {
  // Provider, signer, and address
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  const [address, setAddress] = useState();

  // Various loading, status etc variables
  const [metamaskInstalled, setMetamaskInstalled] = useState(false);
  const [wrongChain, setWrongChain] = useState(false);
  const [ready, setReady] = useState();

  // Function to add Fantom network to MetaMask
  const addFantomToMetamask = async () => {
    let params = {
      chainId: '0xFA',
      chainName: 'Fantom Opera',
      nativeCurrency: {
        name: 'Fantom',
        symbol: 'FTM',
        decimals: 18
      },
      rpcUrls: ['https://rpc.ftm.tools/'],
      blockExplorerUrls: ['https://ftmscan.com/']
    }
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [params]
    });
  }

  // Function to request metamask connection. This sets signer.
  const connectMetamask = async () => {
    if (provider) {
      try {
        let accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAddress(accounts[0]);
        setSigner(provider.getSigner());
      } catch {
        console.log("User rejected connection request.");
      }
    }
  };

  // On initial load, set the provider. If already connected, set address and signer as well.
  useEffect(() => {
    async function getProvider() {
      if (await detectEthereumProvider()) {
        setMetamaskInstalled(true);
        let p = new ethers.providers.Web3Provider(window.ethereum, "any");
        // Listen for chain changes
        p.on("network", (newNetwork, oldNetwork) => {
          // When a Provider makes its initial connection, it emits a "network"
          // event with a null oldNetwork along with the newNetwork. So, if the
          // oldNetwork exists, it represents a changing network
          if (oldNetwork) {
            window.location.reload();
          }
        });
        let chainId = (await p.getNetwork()).chainId;
        if (chainId !== NETWORK.chainId) {
          setWrongChain(true);
          return;
        }
        let accounts = await p.listAccounts();
        if (accounts.length) {
          setAddress(accounts[0]);
          setSigner(p.getSigner());
        }
        setProvider(p);
        // Listen for account changes
        window.ethereum.on("accountsChanged", (accounts) => {
          console.log("Accounts changed", accounts[0]);
          setAddress(accounts[0]);
        });
        setReady(true);
      }
    }
    getProvider();
  }, []);

  const Root = (props) => (
    <div
      style={{
        display: "flex",
      }}
      {...props}
    />
  );

  const Sidebar = (props) => <SidebarDiv {...props} />;

  const Main = (props) => <MainDiv {...props} />;

  return (
    <Router>
      <Root>
        <Sidebar>
          <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <h2>Skelly 💀</h2>
            <div style={{fontSize: "13px", textAlign: "center", color: "red"}}>
              WARNING: Product in beta. Use at your own risk.
            </div>
            <div style={{marginBottom: "20px", fontSize: "13px", textAlign: "center"}}>
              Bare bones NFT marketplace. Trade directly with FTM. 1% fees & no custody of FTM or NFTs.
            </div>
            <SideBarText>
              <a href="#/">Browse</a>
            </SideBarText>
            <SideBarText>
              <a href={"#/wallet/" + address}>My NFTs</a>
            </SideBarText>
            <h3>Collections</h3>
            {COLLECTIONS.map((x) => (
              <SideBarText key={x.address}>
                <a href={"#/collection/" + x.address}>{x.name}</a>
              </SideBarText>
            ))}
            <div style={{
              position: "absolute",
              bottom: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}>
              <div style={{fontSize: "18px", marginBottom: "10px"}}>
                <a href='#/about'>About</a>
              </div>
              <a href="https://twitter.com/skellyftm" target="_blank">
                <i className="fa fa-lg fa-twitter"></i>
              </a>
            </div>
          </div>
        </Sidebar>
        <Main>
          {wrongChain ? (
            <div>
              <h1>Wrong Chain - switch to FTM 250</h1>
              <button onClick={addFantomToMetamask}>Add Fantom to MetaMask (or switch to FTM)</button>
            </div>
          ) : (
            <>
              <div align="right" style={{marginTop: "15px", marginRight: "15px"}}>
                {address ? (
                  <button>
                    {NETWORK.name +
                      ": " +
                      address.slice(0, 6) +
                      "..." +
                      address.slice(38)}
                  </button>
                ) : (
                  <button onClick={connectMetamask}>Connect</button>
                )}
              </div>
              <Switch>
                <Route exact path="/">
                  {ready && <Browse></Browse>}
                </Route>
                <Route path="/wallet/:address">
                  {ready && <Wallet></Wallet>}
                </Route>
                <Route path="/collection/:collectionAddress/:tokenId">
                  {ready && <Token provider={provider} signer={signer} />}
                </Route>
                <Route path="/collection/:contract">
                  {ready && <Collection provider={provider}></Collection>}
                </Route>
                <Route path="/about">
                  {ready && <About></About>}
                </Route>
              </Switch>
            </>
          )}
        </Main>
      </Root>
    </Router>
  );
}

export default App;
