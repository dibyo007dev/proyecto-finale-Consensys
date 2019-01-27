/// BiddingContract: Takes care of all the bidding business logic and admin related permissions
 
pragma solidity >=0.4.21 <0.6.0;

// import the ASS token
import "./AucSters.sol";

// SafeMath for Ops Utils
import "../libraries/SafeMath.sol";

// It handles all the trade-offs needed: Token Buying, 
contract BiddingContract {

    // state variables
    bool private stopped = false;

    using SafeMath for uint; 

    address payable admin;
    AucSters public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    //structs
    struct Seller {
        uint256 sellerId;
        string sellerName;
        bool isValidSeller;
    }
    struct Bidder {
        address bidders_address;
        uint productId;
        uint bidValue;
    }
    struct Product {
        uint productId;
        uint bidStartPrice;
        uint32 bidStartTime;
        Bidder latestBid;
        string productName;
        bool isAvailable;
        uint32 bidSession;
        string productImage;
    }



    //seller-mappings
    mapping(address => Seller) registeredSeller;

    // ** product-mappings : a registered seller has multiple products

    //lookup for the owner of product with productId
    mapping(uint => address) public productIdToOwner;
    mapping(address => uint) public productCount;

    //get product details with specific productId
    mapping(uint => Product) product;

    //latest bid tracker
    mapping(address => mapping(uint => uint)) public latestBidStore;


    //ARRAYS
    address[] public regSellers;
    Product[] productsForSale;
    address[] public bidders;


    // modifiers
    modifier onlyOwner() {
        require(msg.sender == admin, "not an admin");
        _;
    }

    modifier isRegisteredSeller(address _seller) {
        require(registeredSeller[_seller].isValidSeller,"seller not registered");
        _;
    }

    modifier inSession(uint256 _productId){
        require(now < product[_productId].bidSession + product[_productId].bidStartTime, "Timeout occured for the product");
        _;
    }

    /** modifiers used as a  circuit breaker in the contract
        we can end the token sale when needed => no bidding can occur
    */
    modifier stopInEmergency { if (!stopped) _; }
    modifier onlyInEmergency { if (stopped) _; }

    //events
    event TokenSold(address indexed _customer,
                    uint _numberOfTokens
    );

    event ProductSold(uint indexed _productId,
                address indexed _customer,
                uint _numberOfTokens
    );

    event Bidding(uint indexed _productId,
                address indexed _bidder,
                uint _numberOfTokens
    );

    event NewProductAdded( address indexed _sellerId,
                           uint indexed _productId,
                           string productName,
                           uint bidStartTime,
                           bool indexed isAvailable,
                           uint bidSession
    );

    constructor(AucSters _tokenContract, uint _tokenPrice) public {
        //Assign an admin
        admin = msg.sender;

        // token Contract 
        tokenContract = _tokenContract;
        
        //Token price
        tokenPrice = _tokenPrice;
    }
    
    // It stops the token buying and ends the sale 
    function StopContract() onlyOwner public {
        stopped = true;
    }

    // Buying AucSters Token for bidding
    function buyTokens(uint256 _numberOfTokens) public stopInEmergency payable {
        require(msg.value == _numberOfTokens.mul(tokenPrice), "correct amount of ether not sent");
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens, "tokens not available");
        require(tokenContract.transfer(msg.sender, _numberOfTokens), "tokens not sent");

        tokensSold = tokensSold.add(_numberOfTokens);

        emit TokenSold(msg.sender, _numberOfTokens);
    }
    // Ending the supply
    function endSupply() onlyInEmergency public {
        require(msg.sender == admin,"only admin can end the token sale");
        require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))),"balance not transferring");

        //selfdestruct(msg.sender);
        admin.transfer(address(this).balance);
    }

    // registration of seller from the admin
    function registerSeller(address _sellerAddress, string memory _sellerName, uint256 _sellerId) public onlyOwner isRegisteredSeller(_sellerAddress) returns(bool){
        registeredSeller[_sellerAddress].sellerName = _sellerName;
        registeredSeller[_sellerAddress].sellerId = _sellerId;
        registeredSeller[_sellerAddress].isValidSeller = true;

        regSellers.push(_sellerAddress) - 1;

        return true;
    }
    // get All sellers
    function getSellers() public view  returns(address[] memory) {
        return regSellers;
    }

    // get description of a registered seller
    function getSeller(address _address) public view returns(uint, string memory){
        return( registeredSeller[_address].sellerId, registeredSeller[_address].sellerName);
    }

    // registered sellers can add products for bidding
    function addProductForBid(uint _productId, string memory _productName, uint256 _bidStartPrice, uint32 _sessionValue) public isRegisteredSeller(msg.sender) returns(bool){

        // update the product mapping
        product[_productId].productName = _productName;
        product[_productId].bidStartPrice = _bidStartPrice;
        product[_productId].isAvailable = true;
        product[_productId].bidStartTime = uint32(now);
        product[_productId].isAvailable = true;
        product[_productId].bidSession = _sessionValue;


        // Update the all product array
        Product memory newProduct;
        newProduct.productId = _productId;
        newProduct.productName = _productName;
        newProduct.bidStartPrice = _bidStartPrice;
        newProduct.bidStartTime = uint32(now);
        newProduct.isAvailable = true;
        newProduct.bidSession = _sessionValue;


        productsForSale.push(newProduct) - 1;

        productIdToOwner[_productId] = msg.sender;
        productCount[msg.sender] += 1;

        //Initial Bid price is set to the mapping
        latestBidStore[msg.sender][_productId] = _bidStartPrice;

        // emit an product added event
        emit NewProductAdded(msg.sender, _productId, _productName, _bidStartPrice, true, _sessionValue);

        return true;
    }

    // UPGRADE : function removeProduct();
    // UPGRADE : update productForSale array


    // bidding on a certain product

    function Bid(uint _productId, uint _bidValue) inSession(_productId) public returns(bool) { // modifier to check the session is still there
        // check if msg.sender has enough balance
        require(tokenContract.balanceOf(msg.sender) >= _bidValue, "not enough balance");
            // check if bid is higher than previous bid event 
        require(latestBidStore[msg.sender][_productId] > _bidValue, "must bid a larger amount");
            //  transfer the token for locking 
        
       // ** approve should be called first  ** 
       // tokenContract.approve(address(this), _bidValue);

       // check if approve has been called

        require(tokenContract.allowance(msg.sender,address(this)) == _bidValue, "not approved yet");

        tokenContract.transferFrom(msg.sender, address(this), _bidValue);

            //  update the bid amount : latestBidPrice
        latestBidStore[msg.sender][_productId] = _bidValue;
            // update the bidding array
        bidders.push(msg.sender) - 1;
        product[_productId].latestBid.bidders_address = msg.sender;
        product[_productId].latestBid.productId = _productId;

        product[_productId].latestBid.bidValue = _bidValue;

            //  trigger event on every update 
        emit Bidding(_productId,msg.sender, _bidValue);
    }

    // It finalizes the higest bid value and returns all the tokens to respective bidders who havn;t won the bid
    // on Session end called by the Seller
    function finalizeBid(uint _productId) public returns(bool) {
        // check if called by the product seller only 
        require(productIdToOwner[_productId] == msg.sender, "seller can only finalize the bid");
        // check if session is timed out or not 
        require(now > product[_productId].bidSession + product[_productId].bidStartTime, "cannot finalize");
        //product no more available
        product[_productId].isAvailable = false;
        // return the rest of bidders' tokens locked 
        for(uint i = 0;i < bidders.length;i++) {
            // find and refund the bidders who have got their token locked for the auction and did not won the product
            address bid_addr = bidders[i];
            if(latestBidStore[bid_addr][_productId] != 0 && latestBidStore[bid_addr][_productId] != product[_productId].latestBid.bidValue) {
                // process the return
                tokenContract.transfer(bid_addr, latestBidStore[bid_addr][_productId]);          
            }
        }
        tokenContract.transfer(product[_productId].latestBid.bidders_address,product[_productId].latestBid.bidValue);
        
        // UPGRADE : supplychain triggered on Bid Finalization, 
        //           approve the supply chain to ... onSuccess() -> transfer money to the seller
        //              on failure -> refund back to buyer

    }
}