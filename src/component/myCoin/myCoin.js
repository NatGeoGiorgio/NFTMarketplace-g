import React, { Component } from "react";
import getWeb3, { getGanacheWeb3, Web3 } from "../utils/web3/getWeb3.js";

import { Loader, Button, Card, Input, Table, Form, Field, Image } from 'rimble-ui';
import { zeppelinSolidityHotLoaderOptions } from '../config/webpack';



export default class myCoin extends Component {
    constructor(props) {    
        super(props);

        this.state = {
          /////// Default state
          storageValue: 0,
          web3: null,
          accounts: null,
          currentAccount: null,

          /////// NFT
          allCoins: []
        };

        //this.handlePhotoNFTAddress = this.handlePhotoNFTAddress.bind(this);

        this.putOnSale = this.putOnSale.bind(this);
        this.cancelOnSale = this.cancelOnSale.bind(this);
    }

    ///--------------------------
    /// Handler
    ///-------------------------- 
    // handlePhotoNFTAddress(event) {
    //     this.setState({ valuePhotoNFTAddress: event.target.value });
    // }


    ///---------------------------------------------------------
    /// Functions put a photo NFT on sale or cancel it on sale 
    ///---------------------------------------------------------
    putOnSale = async (e) => {
        // const { web3, accounts, BasicNFT, photoNFTData, PHOTO_NFT_MARKETPLACE } = this.state;

        // console.log('=== value of putOnSale ===', e.target.value);
        // console.log('=== PHOTO_NFT_MARKETPLACE ===', PHOTO_NFT_MARKETPLACE);

        // const PHOTO_NFT = e.target.value;

        // /// Get instance by using created photoNFT address
        // let PhotoNFT = {};
        // PhotoNFT = require("../../../../build/contracts/PhotoNFT.json"); 
        // let photoNFT = new web3.eth.Contract(PhotoNFT.abi, PHOTO_NFT);

        // /// Check owner of photoId
        // const photoId = 1;  /// [Note]: PhotoID is always 1. Because each photoNFT is unique.
        // const owner = await photoNFT.methods.ownerOf(photoId).call();
        // console.log('=== owner of photoId ===', owner);  /// [Expect]: Owner should be the BasicNFT.sol (This also called as a proxy/escrow contract)
            
        // /// Put on sale (by a seller who is also called as owner)
        // const txReceipt1 = await photoNFT.methods.approve(PHOTO_NFT_MARKETPLACE, photoId).send({ from: accounts[0] });
        // const txReceipt2 = await BasicNFT.methods.openTrade(PHOTO_NFT, photoId).send({ from: accounts[0] });
        // console.log('=== response of openTrade ===', txReceipt2);
    }

    cancelOnSale = async (e) => {
        // const { web3, accounts, BasicNFT, photoNFTData, PHOTO_NFT_MARKETPLACE } = this.state;

        // console.log('=== value of cancelOnSale ===', e.target.value);

        // const PHOTO_NFT = e.target.value;

        // /// Get instance by using created photoNFT address
        // let PhotoNFT = {};
        // PhotoNFT = require("../../../../build/contracts/PhotoNFT.json"); 
        // let photoNFT = new web3.eth.Contract(PhotoNFT.abi, PHOTO_NFT);

        // /// Check owner of photoId
        // const photoId = 1;  /// [Note]: PhotoID is always 1. Because each photoNFT is unique.
        // const owner = await photoNFT.methods.ownerOf(photoId).call();
        // console.log('=== owner of photoId ===', owner);  /// [Expect]: Owner should be the BasicNFT.sol (This also called as a proxy/escrow contract)
            
        // /// Cancel on sale
        // //const txReceipt1 = await photoNFT.methods.approve(PHOTO_NFT_MARKETPLACE, photoId).send({ from: accounts[0] });
        // const txReceipt2 = await BasicNFT.methods.cancelTrade(PHOTO_NFT, photoId).send({ from: accounts[0] });
        // console.log('=== response of cancelTrade ===', txReceipt2);
    }


    ///------------------------------------- 
    /// NFT（Always load listed NFT data）
    ///-------------------------------------
    getAllCoins = async () => {
        const { BasicNFT } = this.state
        const allCoins = await BasicNFT.methods.getAllCoins().call()
        console.log('=== allCoins ===', allCoins)

        this.setState({ allCoins: allCoins })
        return allCoins
    }
    getAllDEMOCoins = async () => {
        const { BasicNFT } = this.state
        const allCoins = await BasicNFT.methods.getAllCoins().call()
        console.log('=== allCoins ===', allCoins)

        this.setState({ allCoins: allCoins })
        return allCoins
    }


    //////////////////////////////////// 
    /// Ganache
    ////////////////////////////////////
    getGanacheAddresses = async () => {
        if (!this.ganacheProvider) {
          this.ganacheProvider = getGanacheWeb3();
        }
        if (this.ganacheProvider) {
          return await this.ganacheProvider.eth.getAccounts();
        }
        return [];
    }

    componentDidMount = async () => {
        const hotLoaderDisabled = zeppelinSolidityHotLoaderOptions.disabled;
     
        let BasicNFT = {};
        try {
          BasicNFT = require("../../../build/contracts/NFTBasic.json"); // Load ABI of contract of BasicNFT
        } catch (e) {
          console.log(e);
        }

        try {
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

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();
            const currentAccount = accounts[0];
            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const networkType = await web3.eth.net.getNetworkType();
            const isMetaMask = web3.currentProvider.isMetaMask;
            let balance = accounts.length > 0 ? await web3.eth.getBalance(accounts[0]): web3.utils.toWei('0');
            balance = web3.utils.fromWei(balance, 'ether');

            let instanceBasicNFT = null;
            let CNSTY_contractDeplAddress;
            let deployedNetwork = null;

            // Create instance of contracts
            if (BasicNFT.networks) {
              deployedNetwork = BasicNFT.networks[networkId.toString()];
              if (deployedNetwork) {
                instanceBasicNFT = new web3.eth.Contract(
                  BasicNFT.abi,
                  deployedNetwork && deployedNetwork.address,
                );
                console.log('=== instanceBasicNFT ===', instanceBasicNFT);
              }
            }


            if (instanceBasicNFT) {
                // Set web3, accounts, and contract to the state, and then proceed with an
                // example of interacting with the contract's methods.
                this.setState({ 
                    web3, 
                    ganacheAccounts, 
                    accounts, 
                    balance, 
                    networkId, 
                    networkType, 
                    currentAccount: currentAccount,
                    hotLoaderDisabled,
                    isMetaMask, 
                    BasicNFT: instanceBasicNFT,
                    CNSTY_contractDeplAddress: CNSTY_contractDeplAddress }, () => {
                      this.refreshValues(instanceBasicNFT);
                      setInterval(() => {
                        this.refreshValues(instanceBasicNFT);
                    }, 5000);
                });
            }
            else {
              this.setState({ web3, ganacheAccounts, accounts, balance, networkId, networkType, hotLoaderDisabled, isMetaMask });
            }

            ///@dev - NFT（Always load listed NFT data
            const allCoins = await this.getAllCoins();
            this.setState({ allCoins: allCoins })
          }
        } catch (error) {
          // Catch any errors for any of the above operations.
          alert(
            `Failed to load web3, accounts, or contract. Check console for details.`,
          );
          console.error(error);
        }
    };

    componentWillUnmount() {
        if (this.interval) {
          clearInterval(this.interval);
        }
    }

    refreshValues = (instanceBasicNFT) => {
        if (instanceBasicNFT) {
          console.log('refreshValues of instanceBasicNFT');
        }
    }

    render() {
        const { web3, allCoins, currentAccount } = this.state;

        return (
            <div>
              <h1 className='title'>Collection</h1>

              { allCoins.map((photo, key) => {
                return (
                  
                    <div>

                        { currentAccount == photo.owner ? 
                            <Card width={"300px"} 
                                    maxWidth={"300px"} 
                                    mx={"auto"} 
                                    my={5} 
                                    p={20} 
                                    borderColor={"#E7E7E7"}
                            >
                              <Image
                                alt="random unsplash image"
                                borderRadius={20}
                                height="auto"
                                maxWidth='100%'
                                src={ `https://ipfs.io/ipfs/${photo.ipfsHash}` }
                              />

                              <span style={{ padding: "20px" }}></span>

                              <p>Photo Name: { photo.nameOfCoin }</p>
                            
                              <p>Owner: { photo.owner }</p>

                              <p>Photo id: { photo.coinIndex }</p>

                              <p>photoIPFS: { `https://ipfs.io/ipfs/${photo.ipfsHash}` }</p>
                              
                              <br />

                              { photo.status == "Cancelled" ? 
                                  <Button size={'medium'} width={1} value={ photo.photoNFT } onClick={this.putOnSale}> Put on sale </Button>
                              :
                                  <Button size={'medium'} width={1} value={ photo.photoNFT } onClick={this.cancelOnSale}> Cancel on sale </Button>
                              }

                              <span style={{ padding: "5px" }}></span>
                            </Card>
                        :
                            ''
                        }

                    </div>
                  
                )
              }) }
            </div>
        );
    }
}

