import { LastGoodPriceUpdated } from "../../generated/PriceFeed/PriceFeed";

import { updatePrice } from "../entities/SystemState";
import { getCollToken } from "../entities/Global";

export function handleLastGoodPriceUpdated(event: LastGoodPriceUpdated): void {
  if (event.params._collToken != getCollToken()) return;

  updatePrice(event, event.params._lastGoodPrice);
}
