import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { Frontend } from "../../generated/schema";
import { decimalize } from "../utils/bignumbers";
import { getUser } from "./User";
import { getFrontEndSequenceNumber } from "./Global";

export function registerFrontend(ownerAddress: Address, kickbackRate: BigInt): void {
  let owner = getUser(ownerAddress);
  let frontend = new Frontend(owner.id);

  let userAddress = ownerAddress.toHexString();

  frontend.owner = owner.id;
  frontend.sequenceNumber = getFrontEndSequenceNumber();
  frontend.code = userAddress.slice(2,4).concat((frontend.sequenceNumber + 10).toString()).concat(userAddress.slice(40));
  frontend.kickbackRate = decimalize(kickbackRate);

  frontend.save();
}

export function assignFrontendToDepositor(
  depositorAddress: Address,
  frontendAddress: Address
): void {
  let frontend = Frontend.load(frontendAddress.toHexString());

  if (frontend != null) {
    let depositor = getUser(depositorAddress);
    depositor.frontend = frontend.id;
    depositor.save();
  }
}
