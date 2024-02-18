import { ethereum, Address, BigInt, BigDecimal, log } from "@graphprotocol/graph-ts";

import { StabilityDeposit } from "../../generated/schema";

import { decimalize, DECIMAL_ZERO, BIGINT_ZERO } from "../utils/bignumbers";

import { getUser } from "./User";
import { ZERO_ADDRESS } from "../utils/constants";

export function getStabilityDeposit(_user: Address): StabilityDeposit {
  let id = _user.toHexString();
  let stabilityDepositOrNull = StabilityDeposit.load(id);

  if (stabilityDepositOrNull != null) {
    return stabilityDepositOrNull as StabilityDeposit;
  } else {
    let owner = getUser(_user);
    let newStabilityDeposit = new StabilityDeposit(id);

    newStabilityDeposit.owner = owner.id;
    newStabilityDeposit.depositedAmount = DECIMAL_ZERO;

    return newStabilityDeposit;
  }
}

export function updateStabilityDeposit(
  _user: Address,
  _amount: BigInt
): void {
  let stabilityDeposit = getStabilityDeposit(_user);
  let newDepositedAmount = decimalize(_amount);
  let owner = getUser(_user);

  if (newDepositedAmount == stabilityDeposit.depositedAmount) {
    // Don't create a StabilityDepositChange when there's no change... duh.
    // It means user only wanted to withdraw collateral gains.
    return;
  }

  stabilityDeposit.depositedAmount = newDepositedAmount;

  stabilityDeposit.save();
}
