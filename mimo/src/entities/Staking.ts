import { Address, BigInt } from "@graphprotocol/graph-ts";

import { Staking } from "../../generated/schema";
import { SmartChefInitializable } from "../../generated/SmartChef/SmartChefInitializable";
import { BIGINT_ZERO } from "../utils/constants";
import { getUser } from "./User";

export function getStaking(user: Address): Staking {
  let id = "staking-" + user.toHexString();
  let stakingOrNull = Staking.load(id);

  if (stakingOrNull != null) {
    return stakingOrNull as Staking;
  } else {
    let staking = new Staking(id);
    let owner = getUser(user);
    staking.owner =  owner.id;
    staking.amount = BIGINT_ZERO;
    staking.save();

    return staking;
  }
}

export function increaceStaking(user: Address, amount: BigInt): void {
  let staking = getStaking(user);

  staking.amount = staking.amount.plus(amount);
  staking.save();
}

export function decreaceStaking(user: Address, amount: BigInt): void {
  let staking = getStaking(user);

  staking.amount = staking.amount.minus(amount);
  staking.save();
}
