// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;
pragma experimental ABIEncoderV2;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTBasic is ERC721,Ownable {
    
  mapping (uint256 => address) internal tokenOwner;
  uint constant minimumPrice = 0.01 ether;
  address contractOwner;
  constructor() public ERC721("Coinasty", "CNSTY"){contractOwner = msg.sender;}
  
  struct Coin {
    address owner;
    uint coinIndex;
    string nameOfCoin;
    string ipfsHash;
    
    bool isForSale;
    uint minValueOffer;          // in ether
    address onlySellTo;
    
    bool hasBid;
    address bidder;
    uint valueBid;
  }

  
    
    mapping (address => uint) public pendingWithdrawals;
    Coin[] public coins;
    
    event CoinOffered(uint coinIndex, uint minPrice, address toAddress);
    event CoinNoMoreForSale(uint coinIndex);
    event CoinBidEntered(uint coinIndex, uint value, address fromAddress);
    event CoinBought(uint  coinIndex, uint value, address fromAddress, address toAddress);
    event CoinBidWithdrawn(uint coinIndex, uint value, address fromAddress);  
  
  function preMint(string memory _nameOfCoin,string memory _ipfsHash)public{
      require (msg.sender==contractOwner);
      uint _coinId = coins.length;
        Coin memory _coin= Coin({ 
        owner: msg.sender,
        coinIndex:_coinId, 
        nameOfCoin: _nameOfCoin,
        ipfsHash: _ipfsHash,
        
        isForSale: true,
        minValueOffer:minimumPrice,
        onlySellTo:address(0),
        
        hasBid: false,
        bidder: address(0),
        valueBid: 0
        
            
        });
        coins.push(_coin);
        _mint(msg.sender, _coinId);
        offerCoinForSale(_coinId, minimumPrice );
  }
  
  
  function mint(uint _coinId) private {
    _mint(msg.sender, _coinId);
        
  }
  
  function BuyNewCoin() public payable{
      //todo
  }
  
  
  function CoinNoLongerForSale(uint _coinIndex) public{
      if (ownerOf(_coinIndex) != msg.sender) revert();
      coins[_coinIndex].isForSale = false;
      coins[_coinIndex].minValueOffer= 0;
      coins[_coinIndex].onlySellTo= address(0);
      CoinNoMoreForSale(_coinIndex);
      
  }
  
  function offerCoinForSale(uint _coinIndex, uint minSalePriceInWei) public{
      if (ownerOf(_coinIndex) != msg.sender) revert();
      coins[_coinIndex].isForSale= true;
      coins[_coinIndex].minValueOffer= minSalePriceInWei ;
      coins[_coinIndex].onlySellTo= address(0);
      CoinOffered(_coinIndex, minSalePriceInWei, address(0));
      
  }
  
  function offerCoinForSaleToAddress(uint _coinIndex, uint minSalePriceInWei,address toAddress) public{
      if (ownerOf(_coinIndex) != msg.sender) revert();
      coins[_coinIndex].isForSale= true;
      coins[_coinIndex].minValueOffer= minSalePriceInWei;
      coins[_coinIndex].onlySellTo= toAddress;
      CoinOffered(_coinIndex, minSalePriceInWei, toAddress);
      
  }
  
  
  function buyCoin(uint _coinIndex) public payable{
        Coin memory coin = coins[_coinIndex];
        if (!coin.isForSale) revert();                // coin not actually for sale
        if (coin.onlySellTo != address(0) && coin.onlySellTo != msg.sender) revert();  // coin not supposed to be sold to this user
        if (msg.value < coin.minValueOffer) revert();      // Didn't send enough ETH
        if (coin.owner != ownerOf(_coinIndex)) revert();

        address seller = coin.owner;

        _transfer(seller,msg.sender,_coinIndex);
        CoinNoLongerForSale(_coinIndex);
        pendingWithdrawals[seller] += msg.value;

        // Check for the case where there is a bid from the new owner and refund it.
        // Any other bid can stay in place.
        if (coin.bidder == msg.sender) {
            // Kill bid and refund value
            pendingWithdrawals[msg.sender] += coin.valueBid;
            coins[_coinIndex].hasBid=false;
            coins[_coinIndex].bidder=address(0);
            coins[_coinIndex].valueBid= 0;
        }
  }
  
  function transferCoin(address to, uint _coinIndex) public{
        if (ownerOf(_coinIndex) != msg.sender) revert();                // coin not actually for sale
        if (coins[_coinIndex].isForSale) {
            CoinNoLongerForSale(_coinIndex);
        }
        
        safeTransferFrom(msg.sender, to, _coinIndex);

        // Check for the case where there is a bid from the new owner and refund it.
        // Any other bid can stay in place.
        Coin memory coin = coins[_coinIndex];
        if (coin.bidder == to) {
            // Kill bid and refund value
            pendingWithdrawals[msg.sender] += coin.valueBid;
            coins[_coinIndex].hasBid=false;
            coins[_coinIndex].bidder= address(0);
            coins[_coinIndex].valueBid=0;
        }
  }
  function withdraw() public{
        uint amount = pendingWithdrawals[msg.sender];
        // Remember to zero the pending refund before
        // sending to prevent re-entrancy attacks
        pendingWithdrawals[msg.sender] = 0;
        msg.sender.transfer(amount);
    }
  function enterBidForCoin(uint _coinIndex) public payable {
        if (ownerOf(_coinIndex) == address(0)) revert();
        if (ownerOf(_coinIndex) == msg.sender) revert();
        if (msg.value == 0) revert();
        Coin memory existing = coins[_coinIndex];
        if (msg.value <= existing.valueBid) revert();
        if (existing.valueBid > 0) {
            // Refund the failing bid
            pendingWithdrawals[existing.bidder] += existing.valueBid;
        }
        coins[_coinIndex].hasBid=true; 
        coins[_coinIndex].bidder= msg.sender; 
        coins[_coinIndex].valueBid=msg.value;
        CoinBidEntered(_coinIndex, msg.value, msg.sender);
    }
    
    function acceptBidForCoin(uint _coinIndex, uint minPrice) public{
               
        if (ownerOf(_coinIndex) != msg.sender) revert();
        address seller = msg.sender;
        Coin memory coin = coins[_coinIndex];
        if (coin.valueBid == 0) revert();
        if (coin.valueBid < minPrice) revert();
        
        safeTransferFrom(msg.sender, coin.bidder, _coinIndex);

        uint amount = coin.valueBid;
        coins[_coinIndex].owner= coin.bidder;
        coins[_coinIndex].isForSale=false;
        coins[_coinIndex].hasBid=false;
        coins[_coinIndex].bidder=address(0);
        coins[_coinIndex].valueBid= 0;
        coins[_coinIndex].onlySellTo=address(0);
        pendingWithdrawals[seller] += amount;
        CoinBought(_coinIndex, coin.valueBid, seller, coin.bidder);
    }

    function withdrawBidForCoin(uint _coinIndex) public{
        if (ownerOf(_coinIndex) == address(0)) revert();
        if (ownerOf(_coinIndex) == msg.sender) revert();
        Coin memory coin = coins[_coinIndex];
        if (coin.bidder != msg.sender) revert();
        CoinBidWithdrawn(_coinIndex, coin.valueBid, msg.sender);
        uint amount = coin.valueBid;
        coins[_coinIndex].hasBid=false;
        coins[_coinIndex].bidder=address(0);
        coins[_coinIndex].valueBid=0;
        // Refund the bid money
        msg.sender.transfer(amount);
    }

    function getCoinsByAddress(address _user) public view returns (uint256[] memory) {
        uint balanceOfUser;
        
        balanceOfUser= balanceOf(_user);
        
        uint [] memory allCoinsByUser = new uint[](balanceOfUser);
        for (uint i=0; i<balanceOfUser;i++){
            uint coinIndex;
            coinIndex=tokenOfOwnerByIndex(_user,i);
            allCoinsByUser[i]=coinIndex;
        }
        return allCoinsByUser;
        
    }
        
    function getAllCoinsOnSale() public view returns (uint256[] memory) {
        uint totToken;
        totToken= totalSupply();
        
        uint [] memory allCoinsOnSale = new uint[](totToken);
        for (uint i=0; i<totToken;i++){
            if (coins[i].isForSale == true) allCoinsOnSale[i]=coins[i].coinIndex;
             }
        return allCoinsOnSale;
 
    }
    
    function getAllCoins() public view returns (Coin[] memory _coins) {
        return coins;
    }

    
}