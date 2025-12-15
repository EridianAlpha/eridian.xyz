# Profitable Censorship through Lazy Multi-Block MEV - Ethereum

2023-03-12

![Photo by Jem Sahagun on Unsplash](../../images/MultiBlockMEVCover.png)

Ethereum block space might be expensive, but blocks are cheap. Blocks regularly contain over 28x more in gas spent than is paid to the proposer, even when using MEV Boost. For example:

```
https://etherscan.io/block/16791398
- Proposer paid   0.0181 ETH
- Tx fees         0.519 ETH
```

‎

Given this asymmetry, is there a way for solo stakers with a single validator to increase their yield from staking?

[Multi-Block MEV](https://arxiv.org/pdf/2303.04430.pdf) and [Lazy Multi-Block MEV](https://twitter.com/0x94305/status/1580169706413051904) describe how proposing two blocks in a row can lead to arbitrage opportunities and increased MEV.

‎

As a validator, you know when your block proposal is coming up to 2 epochs in advance. If you build a block that e.g. removed all Uniswap transactions, you can submit it to a relay permissionlessly, and win the auction for the block directly before yours. This effectively “pauses” the chain from the perspective of Uniswap, creating off-chain arbitrage opportunities that can be re-balanced in the next block, the block that you already know you are going to propose. This is not a guaranteed money printer, as you have to pay upfront (only if you win the bid) and then hope/assume that you would make a profit from increased MEV in your next block. However, there are optimization strategies that can be used that reduce the uncertainty.

> The attack becomes profitable if the value of MEV produced by the increase in arbitrage opportunities over the course of the “paused” slot is larger than the net cost to buy out the block.

‎

As an Ethereum solo home staker, I am interested in the implications of MEV. This is a thought experiment to understand if it would be economically viable to “attack/censor/pause” the chain, even as a solo staker. It requires a “tragedy of the commons” mentality as the benefits (if any) gained by an individual or small group who employ this strategy would not have a significant impact on the host chain or individual DeFi protocol, but if everyone employed this strategy it would “kill the host”.

In no way am I advocating for this strategy to actually be implemented or used. This is purely a research question and thought experiment. If it can be done, and it is economically viable, someone will already be carrying out some form of this strategy.

‎

I discussed with [@MTorgin](https://twitter.com/MTorgin) the risk of multi-block MEV when a single operator proposes multiple blocks in a row. His research showed that if a single operator is running ~0.5% of the validator network, then they would expect to propose two blocks in a row on average once a month. The chance of proposing 2+ blocks in a row increases as their percentage of total stake increases. This is a known attack vector (as Torgin wrote about it in 2021) however, with the growth of MEV Boost usage, my question is this:

> Is it viable to permissionlessly build and propose a block that wins the MEV Boost auction for the block directly before your proposal, and profit from the MEV gained by removing/censoring transactions from the purchased block?

‎

My hope is that the answer is:

“Yes, it is possible for anyone to propose a block and win the auction, but no, it is not profitable or economically viable”

‎

Points to consider:

1. Barriers to entry for this strategy
2. How to build a block and win the auction
3. Profit generating strategies
4. Mitigation
5. Implications of this strategy (if it is viable)

### 1. Barriers to entry for this strategy

Unlike acquiring 0.5% of the entire network (a prohibitive capital cost for most), there are many solo validators already running one node, who can expect to propose a block every 2–3 months and could employ this strategy with each proposal. Running a block builder does require additional technical knowledge, as well as an understanding of how relays work, so this would be out of reach of most individuals. However, if an entity had e.g. 10+ validators, then it may become worth trying (assuming the strategy is actually profitable) to be able to offer a higher yield to their customers through increased MEV profits. It could also be a strategy employed by a smoothing pool that conducts this strategy on behalf of the members of the pool. The thought process, even for a single validator, would be “If I take part in this strategy, it could increase my return on my block proposals by an average of x%”. While this is not in the interest of Ethereum, if someone can offer a higher yield (as max profit relays do already, with sandwich attacks and other malicious MEV strategies) then in a free and open market, they inevitably will.

No change needs to be made to a validator, this strategy is achieved only through manipulating the block before the known proposal.

### 2. How to build a block and win the auction

Anyone can run a block builder as Flashbots have [opensourced their builder](https://collective.flashbots.net/t/open-sourcing-the-flashbots-builder/894).

All relays can be pinged to find the current best bid, allowing a builder to pay as close to the optimum price as possible, subject to uncertainty in other block submissions after your call to the headers API endpoint described [here](https://ethereum.github.io/builder-specs/#/Builder/getHeader).

As you only pay if you actually win the bid, this strategy is more likely to have a positive expectancy.

There would be some optimization needed, as significantly overbidding would likely win you the auction, but reduce or negate the profits generated. However, bidding too low/late reduces the chance of winning the auction, missing the opportunity altogether.

### 3. Profit generating strategies

Pausing the chain completely. This already happens, when a validator misses a block proposal.

-   Remove all transactions from the block, proposing a valid, but empty block.
-   This is the most expensive form of attack as you are paying to win the MEV auction, but not recovering any of the costs from including even some transaction tips.
-   Research question: How much higher on average is the payment to a validator using MEV Boost after a missed block?
-   MEV is spiky, so it might not be possible to definitively say that the earnings of a validator are higher after a missed block, but it would give a rough idea of the expected return.

‎

Targeting specific DeFi protocols

-   My assumption is that this would be both more profitable and harder to detect than submitting an empty block with a high bid.
-   The proposer can recoup some of their cost to buy the block by including transactions outside of the targeted DeFi protocols, and/or by including some transactions from the targeted protocols in a way that still contributes to an expected multi-block MEV strategy.
-   In periods of low activity, transactions that are excluded from the first block may still be included in the second block, thus mitigating the cost, though there may be a risk that the second block fills to capacity and some value is left on the table (does EIP-1559 make the situation harder?)

### 4. Mitigation

Relays are the gatekeepers for MEV Boost as they decide which blocks to suggest to the proposer.

Everyone can see an empty block, and relays could employ checks to reject empty blocks. However, currently relays either strictly adhere to a max-profit model (and it would be a breach of trust to do otherwise without very clear notice) or filter based on Tornado Cash transaction inclusion (but otherwise pick the highest value block out of the remainder). Relays may not filter based on things that are subjectively “good” for the network at the expense of profit, except for perhaps bloXroute ethical.

Censorship Resistance lists have been proposed as a way to ensure that a censored transaction will eventually make it into the chain, and may be used as a way to mitigate this strategy.

The min-bid parameter set by proposers sets a block value limit under which they will opt to build a block locally rather than outsource to the MEV Boost pipeline. This is generally done out of altruism, as proposers may sacrifice some profit in exchange for preventing any possible censorship by builders or relays. High adoption of min-bid reduces the opportunities to purchase low-value blocks as described. However, if this strategy proves to be profitable, it may disincentivize proposers from setting a min-bid, counteracting the network health benefits.

Future mitigation would be if there is not a single block builder that builds the whole block. But that would only help for blocks that are not full.

### 5. Implications of this strategy (if it is viable)

Raising the floor price paid to proposers for blocks

-   Arguably the whole point of the strategy from a block proposers perspective.
-   Under the current model, the value of a block is a factor of economic activity on the chain, which can vary to fairly extreme lows. Under this attack, the floor is bounded by the MEV generated by 12 seconds of delay between on-chain and off-chain markets.
-   This would be true on the specifically targeted block, but could also lead to an average increase across all blocks.

‎

Increasing the cost of using the chain during periods of high activity

-   The impact of this strategy varies significantly depending on whether tx activity is low (there is sufficient room in the second block to fit all transactions from both blocks) or high (not all transactions can fit in the second block).
-   In terms of the effect on fees, during low activity tips are unaffected, but during high activity available block space could be reduced significantly and the fee market faces enormous pressure.
-   If gas prices remain the same, and only the tip increases, the total cost to use the chain will increase.

‎

Depressing gas prices

-   If the total amount users pay to interact on the chain remains the same in USD, then increasing the average tip will result in a decrease in the gas price.
-   This would reduce the amount of gas burnt by EIP-1559, reducing the overall profitability of the Ethereum chain.

‎

Poor DeFi end-user experience

-   Users’ transactions may be delayed 12s longer than otherwise expected.
-   Users can expect to be sandwiched or otherwise exploited with higher reliability and intensity.

‎

I’m planning to continue researching this topic as an academic interest. This topic was inspired by conversations I had at the 2023 ETHDenver hackathon and has been a great way to learn more about Ethereum relays and block builders.

Reviewed and discussed with [@MTorgin](https://twitter.com/MTorgin) and [@austonst](https://twitter.com/austonst).

Follow me on Twitter: [@EridianAlpha](https://twitter.com/EridianAlpha)
