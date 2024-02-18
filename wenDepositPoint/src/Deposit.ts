import { UserDepositChanged } from "../generated/StabilityPool/StabilityPool";

import { updateStabilityDeposit } from "./entities/StabilityDeposit";
import { updatePoint } from "./entities/Point";

export function handleStakeChanged(event: UserDepositChanged): void {
  updatePoint(event, event.params._depositor);
  updateStabilityDeposit(event.params._depositor, event.params._newDeposit);
}
