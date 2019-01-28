# Avoiding common attacks

## Reentrancy attacks

These attacks are avoided using the withdraw pattern (from project requirements). Owners balance is kept within the contract in balances mapping. When an owner request to withdraw his founds first we update balance and, as last action in withdraw function, we send the ether to owners account.

Integer Overflow and Underflow
In DeAuction addProduct function we check if counters have reached already the max value for an uint type. This way we avoid overflows due to reaching the max amount of BidPage and products IDs we can manage.

In withdraw function we check that the amount requested by the owner account is less or equal than account's balance. This way we avoid an underflow of account's balance.

In buyProduct we check that the quantity of the product required is less or equal than the count of products available. This way we avoid an underflow of the product's count variable in products type.
