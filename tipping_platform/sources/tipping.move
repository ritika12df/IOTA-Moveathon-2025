#[allow(duplicate_alias)]
module tipping_platform::tipping {
    use iota::coin::{Self, TreasuryCap, Coin};
    use iota::balance::{Self, Balance};
    use iota::iota::IOTA;
    use iota::tx_context::{Self, TxContext};
    use std::option;

    // Define constants
    const EIncorrectAmount: u64 = 0;

    // Define the TIP_TOKEN struct
    public struct TIPPING has drop {}

    // Define the TippingPlatform struct
    public struct TippingPlatform has key {
        id: UID,
        tip_tokens: TreasuryCap<TIPPING>,
        balance: Balance<IOTA>,
    }

    // Initialize the platform
    fun init(witness: TIPPING, ctx: &mut TxContext) {
        let (tip_tokens, metadata) = coin::create_currency(
            witness, 0, b"TIP", b"TIP Token", b"Tokens for tipping content creators", option::none(), ctx
        );
        iota::transfer::public_freeze_object(metadata);
        iota::transfer::share_object(TippingPlatform {
            id: object::new(ctx),
            tip_tokens,
            balance: balance::zero(),
        });
    }

    // Function to buy TIP_TOKENs with IOTA
    #[allow(lint(self_transfer))]
    public fun buy_tokens(platform: &mut TippingPlatform, payment: Coin<IOTA>, ctx: &mut TxContext) {
        let payment_value = coin::value(&payment);
        assert!(payment_value > 0, EIncorrectAmount);

        // Mint TIP_TOKENs equal to payment value
        let tokens = coin::mint(&mut platform.tip_tokens, payment_value, ctx);
        // Transfer tokens to the sender
        transfer::public_transfer(tokens, tx_context::sender(ctx));
        // Add payment to platform's balance
        coin::put(&mut platform.balance, payment);
    }

    // Function to redeem TIP_TOKENs for IOTA
    #[allow(lint(self_transfer))]
    public fun redeem_tokens(platform: &mut TippingPlatform, tokens: Coin<TIPPING>, ctx: &mut TxContext) {
        let token_value = coin::value(&tokens);
        // Burn the tokens
        coin::burn(&mut platform.tip_tokens, tokens);  // Assuming coin::burn exists
        // Transfer equal amount of IOTA from platform's balance to sender
        let iota_to_transfer = coin::take(&mut platform.balance, token_value, ctx);
        transfer::public_transfer(iota_to_transfer, tx_context::sender(ctx));
    }

    // Function to tip a creator
    public entry fun tip(
        token: &mut Coin<TIPPING>,
        amount: u64,
        recipient: address,
        ctx: &mut TxContext,
    ) {
        let coin_to_transfer = coin::split(token, amount, ctx);
        transfer::public_transfer(coin_to_transfer, recipient);
    }
}