# Mimo lp staking point Subgraph

Contains the entities and dependencies to populate a subgraph for Mimo WEN LP point.


# Development quickstart
You need to run a Graph Node locally.

1. Clone Graph Node: `git clone https://github.com/magma-fi/subgraph.git`、
2. Start your local graph node

## prepare code
We need to generate some of the code by config files.

1. `node subgraph.yaml.js WEN-GEODLP`
2. `node Point.js WEN-GEODLP`

## Codegen
`
graph codegen
`

## Build
`
graph build
`

## Deploy local
`
graph deploy mimo-WEN-GEODLP-iotex --ipfs http://localhost:5001 --node http://127.0.0.1:8020
`

## Query
Open Graph Node graphql API instance in your browser: `http://127.0.0.1:8000/subgraphs/name/'subgraphname'`


# Deployed subgraph
| LP      | subgraph name | subgraph id |
| ----------- | ----------- | ----------- |
| WEN-GEODLP  | mimo-WEN-GEODLP-staking-iotex | QmTga7xqVvwpPQySq5L2AH8FHNpYciZuQLKoMxsk4DXbQ9 |
| WEN-XNETLP  | mimo-WEN-XNETLP-staking-iotex | QmdEqCvgANQP9nGsNPHCUK22ovyUbkyWLt1rTpLhiYLJzZ |
| WEN-WIFILP  | mimo-WEN-WIFILP-staking-iotex | QmeLpY4p6Nt8eWrEqAxS7FWmpBnwKst7pKzKo9tBURz9yv |
