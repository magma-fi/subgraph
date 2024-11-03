import {
  TroveUpdated,
  LUSDBorrowingFeePaid
} from "../../generated/BorrowerOperations/BorrowerOperations";

import { getTroveOperationFromBorrowerOperation } from "../types/TroveOperation";

import { setBorrowingFeeOfLastTroveChange, updateTrove } from "../entities/Trove";
import { increaseTotalBorrowingFeesPaid, getTroveManager } from "../entities/Global";

export function handleTroveUpdated(event: TroveUpdated): void {
  if (event.params._trove != getTroveManager()) return;

  updateTrove(
    event,
    getTroveOperationFromBorrowerOperation(event.params.operation),
    event.params._borrower,
    event.params._coll,
    event.params._debt,
    event.params.stake
  );
}

export function handleLUSDBorrowingFeePaid(event: LUSDBorrowingFeePaid): void {
  setBorrowingFeeOfLastTroveChange(event.params._LUSDFee);
  increaseTotalBorrowingFeesPaid(event.params._LUSDFee);
}
