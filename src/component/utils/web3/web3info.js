import React, { Component } from "react";
import { EthAddress, Blockie } from 'rimble-ui';
import Web3 from "web3";
import getWeb3, { getGanacheWeb3} from "./getWeb3.js";
import { zeppelinSolidityHotLoaderOptions } from '../../config/webpack';
export default class Web3Info extends Component {
  constructor(props) {    
    super(props);

    this.state = {web3: null, accounts: null, contracts: null, isMetaMask: null, balance: null, networkId: null};
  }
    
componentDidMount = async () => {
  
   try{

    const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    // Get network provider and web3 instance.
    const web3 = await getWeb3();
    let ganacheAccounts = [];

    try {
      ganacheAccounts = await this.getGanacheAddresses();
    } catch (e) {
      console.log('Ganache is not running');
    }
  let instance = null;
  let BasicNFT = {}
  BasicNFT = require("../../../../build/contracts/NFTBasic.json");
  const accounts = await web3.eth.getAccounts();
  const isMetaMask = web3.currentProvider.isMetaMask;
  const networkId = await web3.eth.net.getId();

  const deployedNetwork = BasicNFT.networks[networkId];
  
  instance = new web3.eth.Contract(BasicNFT.abi, deployedNetwork && deployedNetwork.address);
  let balance = accounts.length > 0 ? await web3.eth.getBalance(accounts[0]): web3.utils.toWei('0');
  balance = web3.utils.fromWei(balance, 'ether');  
  
  if (instance){
    this.setState({web3, accounts: accounts, contract: instance,isMetaMask: isMetaMask,balance: balance, networkId: networkId}, () => {
      this.refreshValues(instance);
      setInterval(() => {
      this.refreshValues(instance);
       }, 5000);
    });
  }
  else {
    this.setState({ web3, ganacheAccounts, accounts, balance, networkId, isMetaMask });
  }
}
} catch (error) {
  alert('Failed to load web3, accounts and contract, check the console');
  console.error(error);
   }
};

// try {
//   const isProd = process.env.NODE_ENV === 'production';
//   if (!isProd) {
//     // Get network provider and web3 instance.
//     const web3 = await getWeb3();
//     let ganacheAccounts = [];

//     try {
//       ganacheAccounts = await this.getGanacheAddresses();
//     } catch (e) {
//       console.log('Ganache is not running');
//     }

//     // Use web3 to get the user's accounts.
//     const accounts = await web3.eth.getAccounts();
//     // Get the contract instance.
//     const networkId = await web3.eth.net.getId();
//     const networkType = await web3.eth.net.getNetworkType();
//     const isMetaMask = web3.currentProvider.isMetaMask;
//     let balance = accounts.length > 0 ? await web3.eth.getBalance(accounts[0]): web3.utils.toWei('0');
//     balance = web3.utils.fromWei(balance, 'ether');

//     let instanceBasicNFT = null;
//     let CNSTY_contractDeplAddress;
//     let deployedNetwork = null;

//     // Create instance of contracts
//     if (BasicNFT.networks) {
//       deployedNetwork = BasicNFT.networks[networkId.toString()];
//       if (deployedNetwork) {
//         instanceBasicNFT = new web3.eth.Contract(
//           BasicNFT.abi,
//           deployedNetwork && deployedNetwork.address,
//         );
//         console.log('=== instanceBasicNFT ===', instanceBasicNFT);
//       }
//     }


//     if (instanceBasicNFT) {
//         // Set web3, accounts, and contract to the state, and then proceed with an
//         // example of interacting with the contract's methods.
//         this.setState({ 
//             web3, 
//             ganacheAccounts, 
//             accounts, 
//             balance, 
//             networkId, 
//             networkType, 
//             hotLoaderDisabled,
//             isMetaMask, 
//             BasicNFT: instanceBasicNFT,
//             CNSTY_contractDeplAddress: CNSTY_contractDeplAddress }, () => {
//               this.refreshValues(instanceBasicNFT);
//               setInterval(() => {
//                 this.refreshValues(instanceBasicNFT);
//             }, 5000);
//         });
//     }
//     else {
//       this.setState({ web3, ganacheAccounts, accounts, balance, networkId, networkType, hotLoaderDisabled, isMetaMask });
//     }
//   }
// } catch (error) {
//   // Catch any errors for any of the above operations.
//   alert(
//     `Failed to load web3, accounts, or contract. Check console for details.`,
//   );
//   console.error(error);
// }
// };

    componentWillUnmount() {
        if (this.interval) {
          clearInterval(this.interval);
        }
    }

    refreshValues = (instance) => {
        if (instance) {
          console.log('refreshValues of instance');
        }
    }


  render()  {
    
    return (
      <div >
        <h3> Your Web3 Info </h3>
        <div>
          <div >
            Network:
          </div>
          <div >
            {this.state.networkId}
          </div>
        </div>
        <div >
          <div >
            Your address:
          </div>
          <div >
            <EthAddress address = {this.state.accounts}/>
            <Blockie
              opts={{seed: this.state.accounts, size: 15, scale: 3}} />
          </div>
        </div>
        <div >
          <div >
            Your ETH balance:
          </div>
          <div >
          {this.state.balance}
          </div>
        </div>
        <div >
          <div >
            Using Metamask:
          </div>
          <div >
            {this.state.isMetaMask ? 'YES' : 'NO'}
          </div>
        </div>
      </div>
    );
  }
}