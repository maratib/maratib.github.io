---
title: Stacking
slug: guides/blockchain/stacking
description: Stacking
sidebar:
  order: 0
---

**Staking** is a fundamental concept in blockchain and DeFi (Decentralized Finance). Let us see it in detail:

## What is Staking?

**Staking** is the process of locking up cryptocurrency tokens in a blockchain network to participate in:

1. Network operations,
2. Earn rewards,
3. and support the network's security and functionality.

## How Staking Works

### Basic Concept:

- You **lock** your tokens in a smart contract or protocol
- In return, you **earn rewards** (usually in the same token or related tokens)
- Your staked tokens help **secure the network** or provide liquidity

## Types of Staking

### 1. **Proof-of-Stake (PoS) Network Staking**

- Used by networks like Ethereum 2.0, Cardano, Solana
- Validators stake tokens to validate transactions and create new blocks
- Rewards come from network inflation and transaction fees

### 2. **DeFi Staking**

- Staking in decentralized applications (dApps)
- Provides liquidity to protocols
- Earns protocol fees and rewards

## Staking in Our DeFi App

In our Nest.js application, staking typically involves:

```typescript
// Example staking flow
1. User approves token spending
2. User stakes tokens in staking contract
3. Tokens are locked for a period
4. User earns staking rewards
5. User can unstake (withdraw) tokens
```

## Key Components of Staking

### **Staking Pool**

- Smart contract where users deposit tokens
- Manages reward distribution
- Tracks user stakes

### **Rewards**

- **Fixed APR/APY**: Predetermined interest rates
- **Variable rewards**: Based on protocol performance
- **Governance tokens**: Additional token rewards

### **Lock-up Periods**

- **Flexible**: Unstake anytime
- **Fixed**: Locked for specific period
- **Unbonding period**: Delay before withdrawal

## Benefits of Staking

### 🎯 **For Users:**

- **Passive income** from token holdings
- **Compound interest** on rewards
- **Governance rights** (in some protocols)
- **Network participation**

### 🛡️ **For Networks:**

- **Enhanced security** through economic incentives
- **Decentralization** through distributed validation
- **Network stability** by reducing token circulation
- **Community engagement**

## Risks of Staking

### ⚠️ **Smart Contract Risk**

- Bugs or vulnerabilities in staking contracts
- Potential for exploits or hacks

### 💰 **Impermanent Loss** (in liquidity provision)

- Value changes between staked tokens
- Common in AMM pools

### 🔒 **Liquidity Risk**

- Locked funds cannot be quickly sold
- Market volatility during lock-up periods

### 📉 **Slashing Risk** (in PoS networks)

- Penalties for validator misbehavior
- Can result in loss of staked tokens

## Real-World Staking Examples

### **Ethereum 2.0 Staking**

- Stake 32 ETH to become a validator
- Earn ~4-6% APR in ETH
- Help secure the Ethereum network

### **Uniswap Liquidity Provision**

- Provide token pairs to liquidity pools
- Earn trading fees from swaps
- Receive LP tokens representing your share

### **Compound/MakerDAO**

- Stake tokens as collateral
- Borrow against your stake
- Earn interest on supplied assets

## Staking in Our Code

Looking at our implementation:

```typescript
// Staking involves:
async stake(amount: string, tokenAddress: string) {
  // 1. Approve tokens for staking contract
  await this.approveToken(tokenAddress, stakingContract, amount);

  // 2. Deposit tokens into staking contract
  await this.stakingContract.stake(amount);

  // 3. Start earning rewards
  // Rewards accumulate based on staking duration and amount
}

async unstake(amount: string) {
  // 1. Withdraw staked tokens
  // 2. May involve unbonding period
  // 3. Claim any accumulated rewards
}
```

## Staking vs Similar Concepts

### **Staking vs Yield Farming**

- **Staking**: Longer-term, lower risk, network participation
- **Yield Farming**: Higher risk, moving between protocols, chasing highest yields

### **Staking vs Lending**

- **Staking**: Tokens locked, used for network operations
- **Lending**: Tokens lent to others, can be recalled, lower risk

## Key Metrics in Staking

- **APR/APY**: Annual Percentage Rate/Yield
- **Total Value Locked (TVL)**: Total assets staked in protocol
- **Reward Rate**: How often rewards are distributed
- **Minimum Stake**: Minimum amount required
- **Lock-up Period**: How long tokens are locked

## Summary

**Staking is essentially the DeFi equivalent of earning interest in traditional finance, but with the added benefits of supporting decentralized networks and having more transparent, programmable reward mechanisms.**

In our DeFi app, staking allows users to:

1. **Earn passive income** on their crypto holdings
2. **Participate** in network governance (if governance tokens)
3. **Support** the protocol's operations and security
4. **Compound** their investments over time
