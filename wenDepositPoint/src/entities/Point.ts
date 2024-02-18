import { ethereum, Address, BigInt, BigDecimal, log } from "@graphprotocol/graph-ts";
import { Point } from "../../generated/schema";
import { ZERO_ADDRESS } from "../utils/constants";
import { decimalize, DECIMAL_ZERO, BIGINT_ZERO } from "../utils/bignumbers";
import { getStabilityDeposit } from "./StabilityDeposit";
import { getUser } from "./User";

export function getPoint(_owner: Address): Point {
  let id = "Point_" + _owner.toHexString();
  let user = getUser(_owner);
  let pointOrNull = Point.load(id);

  if (pointOrNull != null) {
    return pointOrNull as Point;
  } else {
    // Bind the contract to the address that emitted the event
    let newPoint = new Point(id);

    newPoint.owner = user.id;
    newPoint.point = DECIMAL_ZERO;
    newPoint.timestamp = 0;
    newPoint.save();

    return newPoint;
  }
}

export function updatePoint(
  _event: ethereum.Event,
  _depositor: Address
): void {
    let timestamp =  _event.block.timestamp.toI32();

    let point = getPoint(_depositor);

    let deposit = getStabilityDeposit(_depositor);
    if (!deposit.depositedAmount.equals(DECIMAL_ZERO)) {
        // For WEN deposit,10 points per hour 1 token.
        let pointPerHour = BigInt.fromI32(10);
        let seconds = BigInt.fromI32(timestamp - point.timestamp);
        // if (_depositor.toHexString() == "0x522cda890014f1b825fe9b1e0542ab7d4a89b727") {
        //     log.error("seconds: {}, amount: {}", [seconds.toString(),deposit.depositedAmount.toString()]);
        // }
        let pointPlus = pointPerHour.times(seconds).toBigDecimal().times(deposit.depositedAmount).div(BigDecimal.fromString('3600'));
        point.point =  point.point.plus(pointPlus);
    }

    point.timestamp = timestamp;
    point.save();
}
