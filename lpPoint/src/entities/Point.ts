import { ethereum, Address, BigInt, log } from "@graphprotocol/graph-ts";
import { Point } from "../../generated/schema";
import { ZERO_ADDRESS } from "../utils/constants";
import { decimalize, DECIMAL_ZERO, BIGINT_ZERO } from "../utils/bignumbers";
import { getTokenBalance } from "./TokenBalance";
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
  _from: Address,
  _to: Address
): void {
    let timestamp =  _event.block.timestamp.toI32();

    if (_from.toHexString() != ZERO_ADDRESS) {
        updateUserPoint(_event.address, _from, timestamp);
    }
    if (_to.toHexString() != ZERO_ADDRESS) {
        updateUserPoint(_event.address, _to, timestamp);
    }
}

function updateUserPoint(_token: Address, _owner: Address, timestamp: i32): void {
    let point = getPoint(_owner);

    let tokenBalance = getTokenBalance(_token, _owner);
    if (!tokenBalance.balance.equals(BIGINT_ZERO)) {
        // For WEN-WIOTX lp, price is 0.4, 10 points per hour 2.5 token.
        let pointPerHour = BigInt.fromI32(4);
        let seconds = BigInt.fromI32(timestamp - point.timestamp);
        let pointPlus = decimalize(tokenBalance.balance.times(pointPerHour).times(seconds).div(BigInt.fromI32(3600)));
        point.point =  point.point.plus(pointPlus);
    }

    point.timestamp = timestamp;
    point.save();
}
