// AucSters : ERC20 token and a cryptoCurrency governing the money transfer in auction
 
pragma solidity >=0.4.21 <0.6.0;

// SafeMath for Ops Utils
import "../libraries/SafeMath.sol";

contract AucSters {

    using SafeMath for uint;

    // State varables
    uint256 public totalSupply;
    string public name;
    string public symbol;
    string public standard;

    // Mapping
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    // Events
    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event Approval(address indexed _owner,
        address indexed _spender,
        uint256 _value
    );


    // Modifiers
    modifier hasEnoughBalance(address _sender, uint _value) {
            // exception if account doesn't have enough balance
        require(balanceOf[_sender] >= _value, "Not enough balance for the transaction");
        _;
    }


    constructor(uint256 _initialSupply) public {
        // Allocate the initial supply to the deployer
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;   

        name = "AucSters";
        symbol = "ASS";
        standard = "AucSters v0.1";        
    }

    // Transfer
    function transfer(address _to, uint _value) public hasEnoughBalance(msg.sender, _value) returns(bool) {
        balanceOf[msg.sender] = balanceOf[msg.sender].sub(_value);
        balanceOf[_to] = balanceOf[_to].add(_value);

        // Trigger a transfer event
        emit Transfer(msg.sender, _to, _value);
        
        // return a boolean
        return true;
    }

    // Delegated Transfer


    //approve
    function approve(address _spender, uint256 _value) public hasEnoughBalance(msg.sender, _value) returns (bool success) {

        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
    //transferFrom
    function transferFrom(address _from, address _to, uint256 _value) public hasEnoughBalance(_from, _value) returns (bool success) {
        // require _from has enough tokens -- modifier
        // require the caller has enough allowance
        require(allowance[_from][msg.sender] >= _value,"transfer exceeds the allowance");
        // change the balance
        balanceOf[_from] = balanceOf[_from].sub(_value);
        balanceOf[_to] = balanceOf[_to].add(_value);

        // update the allowance
        allowance[_from][msg.sender] = allowance[_from][msg.sender].sub(_value);
                 
        // call a transfer event
        emit Transfer(_from, _to, _value);

        // return bool
        return true;
    }
}