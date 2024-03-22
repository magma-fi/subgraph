import { Transfer } from "../generated/LPToken/ERC20";

import { updateBalance } from "./entities/TokenBalance";
import { updatePoint } from "./entities/Point";

export function handleTokenTransfer(event: Transfer): void {
  updatePoint(event, event.params.from, event.params.to);
  updateBalance(event, event.params.from, event.params.to, event.params.value);
}
