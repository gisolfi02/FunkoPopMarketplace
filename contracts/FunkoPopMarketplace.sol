// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract FunkoPopMarketplace {
    struct FunkoPop {
        uint id;
        string nameFunko;
        string description; // nameCharacter - category - license - boxNumber
        string image;
        uint price;      
   
        //VENDITA DIRETTA
        address payable seller;
        address payable buyer;
        bool sold;
        bool confirmed;
        
        //ASTA
        bool isAuction;
        uint auctionEndTime;
        address payable highestBidder;
        uint highestBid;
        bool finalized;
    }

    uint public funkoCount = 0;
    mapping(uint => FunkoPop) public funkos;

    modifier onlyBuyer(uint _id){
        require(funkos[_id].buyer == msg.sender);
        _;
    }

    modifier onlySeller(uint _id){
        require(funkos[_id].seller==msg.sender);
        _;
    }

    event Added(uint id, address seller, string nameFunko, uint price);
    event Deleted(uint id, string nameFunko);
    event Purchased(uint id, address buyer);
    event Confirmed(uint id, address seller);
    event Auction(uint id, address seller, uint price, uint endTime, string nameFunko);
    event BidPlaced(uint id, address bidder, uint price);
    event AuctionFinalized(uint id, address buyer, uint bid);
    


    function createFunko(string memory _nameFunko, string memory _nameCharacter, string memory _image, string memory _category, string memory _license, string memory _boxNumber, uint _price) external {
        require(_price > 0);

        funkos[funkoCount] = FunkoPop({
            id: funkoCount,
            nameFunko : _nameFunko,
            description: string(abi.encodePacked(_nameCharacter, " - ", _category, " - ", _license, " -", _boxNumber)),
            image: _image,
            price: _price,
            seller: payable(msg.sender),
            buyer: payable(address(0)),
            sold: false,
            confirmed: false,
            isAuction: false,
            auctionEndTime: 0,
            highestBidder: payable(address(0)),
            highestBid:0,
            finalized: false
        });

        emit Added(funkoCount, msg.sender, _nameFunko, _price);
        funkoCount++;
    }

    function deleteFunko(uint _id) external onlySeller(_id){
        require(!funkos[_id].sold && !funkos[_id].isAuction);

        delete funkos[_id];
    }

    function buyFunko(uint _id) external payable{
        FunkoPop storage item = funkos[_id];

        require(!item.sold);
        require(!item.isAuction);
        require(msg.value==item.price);
        require(msg.sender != item.seller);

        item.buyer = payable(msg.sender);
        item.sold = true;

        emit Purchased(_id, msg.sender);
    }


    function createAuction(string memory _nameFunko, string memory _nameCharacter, string memory _image, string memory _category, string memory _license, string memory _boxNumber, uint _startingPrice, uint _duration) external {
        require(_startingPrice > 0);

        funkos[funkoCount] = FunkoPop({
            id: funkoCount,
            nameFunko : _nameFunko,
            description: string(abi.encodePacked(_nameCharacter, " - ", _category, " - ", _license, " -", _boxNumber)),
            image: _image,
            price: _startingPrice,
            seller: payable(msg.sender),
            buyer: payable(address(0)),
            sold: false,
            confirmed: false,
            isAuction: true,
            auctionEndTime: block.timestamp + _duration,
            highestBidder: payable(address(0)),
            highestBid: _startingPrice,
            finalized: false
        });

        emit Auction(funkoCount, msg.sender, _startingPrice, block.timestamp + _duration, _nameFunko);
        funkoCount++;
    }

    function placeBid(uint _id) external payable{
        FunkoPop storage item = funkos[_id];

        require(item.isAuction);
        require(block.timestamp < item.auctionEndTime);
        require(msg.value > item.highestBid);

        if(item.highestBidder != address(0)){
            (bool refunded,) = item.highestBidder.call{value: item.highestBid}("");
            require(refunded);
        }

        item.highestBidder = payable(msg.sender);
        item.highestBid = msg.value;

        emit BidPlaced(_id, msg.sender, msg.value);

    }

    function finalizeAuction(uint _id) external { 
        FunkoPop storage item = funkos[_id];

        require(item.isAuction);
        require(block.timestamp >= item.auctionEndTime);
        require(!item.finalized);

        item.finalized = true;

        if(item.highestBidder == address(0)){
            item.sold = false;
            return;
        }

        item.buyer = item.highestBidder;
        item.price = item.highestBid;
        item.sold = true;

        emit AuctionFinalized(_id, item.buyer, item.price);

    }

    function confirmRecived(uint _id) external onlyBuyer(_id){
        FunkoPop storage item = funkos[_id];

        require(item.sold);
        require(!item.confirmed);

        item.confirmed = true;

        (bool sent, ) = item.seller.call{value: item.price}("");
        require(sent);


        emit Confirmed(_id, item.seller);
    }    
}
