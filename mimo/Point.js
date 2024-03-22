const fs = require("fs");

const lpconfig = process.argv[2] || "WEN-GEODLP";
const { pointPerHour } = require(`./config/${lpconfig}.json`);

console.log(`Preparing subgraph Point for "${lpconfig}"`);

const yaml = (strings, ...keys) =>
  strings
    .flatMap((string, i) => [string, Array.isArray(keys[i]) ? keys[i].join("") : keys[i]])
    .join("")
    .substring(1); // Skip initial newline

const point = yaml`
import { ethereum, Address, BigInt, BigDecimal } from "@graphprotocol/graph-ts";
import { Point } from "../../generated/schema";
import { ZERO_ADDRESS , BIGINT_ZERO} from "../utils/constants";
import { getTokenBalance } from "./TokenBalance";
import { getUser } from "./User";
import { getStaking } from "./Staking";

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
    newPoint.point = BigDecimal.fromString("0");
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

export function updateUserPoint(_token: Address, _owner: Address, timestamp: i32): void {
    let point = getPoint(_owner);

    let tokenBalance = getTokenBalance(_token, _owner);
    let staking = getStaking(_owner);
    let balance = tokenBalance.balance.plus(staking.amount);
    if (!balance.equals(BIGINT_ZERO)) {
        // For WEN-GEOD lp, price is 1, 10 points per hour 1 token.
        // For WEN-XNET lp, price is 0.5, 10 points per hour 2 token.
        // For WEN-WIFI lp, price is 0.8, 10 points per hour 1.25 token.
        let pointPerHour = BigInt.fromI32(${pointPerHour});
        let seconds = BigInt.fromI32(timestamp - point.timestamp);
        let pointPlus = decimalize(balance.times(pointPerHour).times(seconds).div(BigInt.fromI32(3600)));
        point.point =  point.point.plus(pointPlus);
    }

    point.timestamp = timestamp;
    point.save();
}

function decimalize(bigInt: BigInt): BigDecimal {
  return bigInt.divDecimal(BigDecimal.fromString("1000000000000000000"));
}

`
fs.writeFileSync("./src/entities/Point.ts", point);
