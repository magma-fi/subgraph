const fs = require("fs");

const lpconfig = process.argv[2] || "iotex_native";
const {
  network,
  collType,
  TroveManager,
  TroveManagerStartBlock,
  BorrowerOperations,
  BorrowerOperationsStartBlock,
  PriceFeed,
  PriceFeedStartBlock,
  StabilityPool,
  StabilityPoolStartBlock,
  CollSurplusPool,
  CollSurplusPoolStartBlock,
  LUSDToken,
  LUSDTokenStartBlock,
  PriceFeedTS,
  PriceFeedABI,
  PriceUpdateEvent
} = require(`./config/${lpconfig}.json`);

console.log(`Preparing subgraph manifest for "${lpconfig}"`);

const yaml = (strings, ...keys) =>
  strings
    .flatMap((string, i) => [string, Array.isArray(keys[i]) ? keys[i].join("") : keys[i]])
    .join("")
    .substring(1); // Skip initial newline

const manifest = yaml`
specVersion: 0.0.4
description: Magma is a decentralized borrowing protocol offering interest-free
  liquidity against collateral in Ether and ERC20 tokens.
repository: https://github.com/magma-fi/subgraph
schema:
  file: ./schema.graphql
dataSources:
  - name: TroveManager
    kind: ethereum/contract
    network: ${network}
    source:
      abi: TroveManager
      address: "${TroveManager}"
      startBlock: ${TroveManagerStartBlock}
    mapping:
      file: ./src/mappings/TroveManager.ts
      language: wasm/assemblyscript
      kind: ethereum/events
      apiVersion: 0.0.7
      entities:
        - Global
        - User
        - Transaction
        - Trove
        - TroveChange
        - Redemption
        - Liquidation
        - SystemState
      abis:
        - name: TroveManager
          file: ./abi/TroveManager.json
      eventHandlers:
        - event: TroveUpdated(indexed address,uint256,uint256,uint256,uint8)
          handler: handleTroveUpdated
        - event: TroveLiquidated(indexed address,uint256,uint256,uint8)
          handler: handleTroveLiquidated
        - event: Liquidation(uint256,uint256,uint256,uint256)
          handler: handleLiquidation
        - event: Redemption(uint256,uint256,uint256,uint256)
          handler: handleRedemption
        - event: LTermsUpdated(uint256,uint256)
          handler: handleLTermsUpdated
        - event: BorrowerOperationsAddressChanged(address)
          handler: handleSetAddresses
  - name: BorrowerOperations
    kind: ethereum/contract
    network: ${network}
    source:
      abi: BorrowerOperations
      address: "${BorrowerOperations}"
      startBlock: ${BorrowerOperationsStartBlock}
    mapping:
      file: ./src/mappings/BorrowerOperations.ts
      language: wasm/assemblyscript
      kind: ethereum/events
      apiVersion: 0.0.7
      entities:
        - Global
        - User
        - Transaction
        - Trove
        - TroveChange
        - SystemState
      abis:
        - name: BorrowerOperations
          file: ./abi/BorrowerOperations.json
      eventHandlers:
        - event: TroveUpdated(indexed address,address,uint256,uint256,uint256,uint8)
          handler: handleTroveUpdated
        - event: LUSDBorrowingFeePaid(indexed address,address,uint256)
          handler: handleLUSDBorrowingFeePaid
  - name: PriceFeed
    kind: ethereum/contract
    network: ${network}
    source:
      abi: PriceFeed
      address: "${PriceFeed}"
      startBlock: ${PriceFeedStartBlock}
    mapping:
      file: ./src/mappings/${PriceFeedTS}
      language: wasm/assemblyscript
      kind: ethereum/events
      apiVersion: 0.0.7
      entities:
        - Global
        - Transaction
        - PriceChange
        - SystemState
      abis:
        - name: PriceFeed
          file: ./abi/${PriceFeedABI}
      eventHandlers:
        - event: ${PriceUpdateEvent}
          handler: handleLastGoodPriceUpdated
  - name: StabilityPool
    kind: ethereum/contract
    network: ${network}
    source:
      abi: StabilityPool
      address: "${StabilityPool}"
      startBlock: ${StabilityPoolStartBlock}
    mapping:
      file: ./src/mappings/StabilityPool.ts
      language: wasm/assemblyscript
      kind: ethereum/events
      apiVersion: 0.0.7
      entities:
        - Global
        - User
        - Transaction
        - StabilityDeposit
        - StabilityDepositChange
        - SystemState
        - Frontend
      abis:
        - name: StabilityPool
          file: ./abi/StabilityPool.json
      eventHandlers:
        - event: UserDepositChanged(indexed address,uint256)
          handler: handleUserDepositChanged
        - event: ETHGainWithdrawn(indexed address,uint256,uint256)
          handler: handleETHGainWithdrawn
        - event: FrontEndRegistered(indexed address,uint256)
          handler: handleFrontendRegistered
        - event: FrontEndTagSet(indexed address,indexed address)
          handler: handleFrontendTagSet
  - name: CollSurplusPool
    kind: ethereum/contract
    network: ${network}
    source:
      abi: CollSurplusPool
      address: "${CollSurplusPool}"
      startBlock: ${CollSurplusPoolStartBlock}
    mapping:
      file: ./src/mappings/CollSurplusPool.ts
      language: wasm/assemblyscript
      kind: ethereum/events
      apiVersion: 0.0.7
      entities:
        - Global
        - User
        - Transaction
        - Trove
        - CollSurplusChange
        - SystemState
      abis:
        - name: CollSurplusPool
          file: ./abi/CollSurplusPool.json
      eventHandlers:
        - event: CollBalanceUpdated(indexed address,uint256)
          handler: handleCollSurplusBalanceUpdated
  - name: LUSDToken
    kind: ethereum/contract
    network: ${network}
    source:
      abi: ERC20
      address: "${LUSDToken}"
      startBlock: ${LUSDTokenStartBlock}
    mapping:
      file: ./src/mappings/Token.ts
      language: wasm/assemblyscript
      kind: ethereum/events
      apiVersion: 0.0.7
      entities:
        - Global
        - User
        - Transaction
        - Token
      abis:
        - name: ERC20
          file: ./abi/ERC20.json
      eventHandlers:
        - event: Transfer(indexed address,indexed address,uint256)
          handler: handleTokenTransfer
        - event: Approval(indexed address,indexed address,uint256)
          handler: handleTokenApproval

`
fs.writeFileSync("subgraph.yaml", manifest);
