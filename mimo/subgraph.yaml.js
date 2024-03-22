const fs = require("fs");

const lpconfig = process.argv[2] || "WEN-GEODLP";
const { SmartChefInitializable, LPToken, startBlock, lpstartBlock } = require(`./config/${lpconfig}.json`);

console.log(`Preparing subgraph manifest for "${lpconfig}"`);

const yaml = (strings, ...keys) =>
  strings
    .flatMap((string, i) => [string, Array.isArray(keys[i]) ? keys[i].join("") : keys[i]])
    .join("")
    .substring(1); // Skip initial newline

const manifest = yaml`
specVersion: 0.0.4
description: Magma is a decentralized borrowing protocol offering interest-free
  liquidity against collateral in Ether.
repository: https://github.com/magma-fi/subgraph
schema:
  file: ./schema.graphql
dataSources:
  - name: SmartChef
    kind: ethereum/contract
    network: iotex
    source:
      abi: SmartChefInitializable
      address: "${SmartChefInitializable}"
      startBlock: ${startBlock}
    mapping:
      file: ./src/SmartChef.ts
      language: wasm/assemblyscript
      kind: ethereum/events
      apiVersion: 0.0.6
      entities:
        - User
        - Token
        - TokenBalance
        - Staking
        - Point
      abis:
        - name: SmartChefInitializable
          file: ./abi/SmartChefInitializable.json
      eventHandlers:
        - event: Deposit(indexed address,uint256)
          handler: handleDeposit
        - event: Withdraw(indexed address,uint256)
          handler: handleWithdraw
        - event: EmergencyWithdraw(indexed address,uint256)
          handler: handleEmergencyWithdraw
  - name: LPToken
    kind: ethereum/contract
    network: iotex
    source:
      abi: ERC20
      address: "${LPToken}"
      startBlock: ${lpstartBlock}
    mapping:
      file: ./src/Token.ts
      kind: ethereum/events
      apiVersion: 0.0.6
      language: wasm/assemblyscript
      entities:
        - Token
        - TokenBalance
        - User
        - Staking
        - Point
      abis:
        - name: ERC20
          file: ./abi/ERC20.json
      eventHandlers:
        - event: Transfer(indexed address,indexed address,uint256)
          handler: handleTokenTransfer

`
fs.writeFileSync("subgraph.yaml", manifest);
