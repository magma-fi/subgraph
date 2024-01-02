# Magma Subgraph

Contains the entities and dependencies to populate a subgraph for Magma protocol.


# Development quickstart
You need to run a Graph Node locally.

1. Clone Graph Node: `git clone https://github.com/magma-fi/subgraph.git`、
2. Start your local graph node
3. Deploy the subgraph to your Graph Node: `cd subgraph && yarn deploy-local`
4. Open Graph Node graphql API instance in your browser: `http://127.0.0.1:8000/subgraphs/name/'subgraphname'`

# Making subgraph code changes
Having done all of the above, if you make subgraph code changes you'll need to run the following:
1. Recompile local changes: `yarn prepare:subgraph && yarn build:subgraph`
2. Redeploy local changes: `cd packages/subgraph && yarn deploy-local`

