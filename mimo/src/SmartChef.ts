import { Deposit, Withdraw, EmergencyWithdraw, SmartChefInitializable } from "../generated/SmartChef/SmartChefInitializable";
import { increaceStaking, decreaceStaking } from "./entities/Staking";
import { updateUserPoint } from "./entities/Point";

export function handleDeposit(event: Deposit): void {
    let contract = SmartChefInitializable.bind(event.address);
    let token = contract.stakedToken();
    updateUserPoint(token, event.params.user, event.block.timestamp.toI32());
    increaceStaking(event.params.user, event.params.amount);
}

export function handleWithdraw(event: Withdraw): void {
    let contract = SmartChefInitializable.bind(event.address);
    let token = contract.stakedToken();
    updateUserPoint(token, event.params.user, event.block.timestamp.toI32());
    decreaceStaking(event.params.user, event.params.amount);
}

export function handleEmergencyWithdraw(event: EmergencyWithdraw): void {
    let contract = SmartChefInitializable.bind(event.address);
    let token = contract.stakedToken();
    updateUserPoint(token, event.params.user, event.block.timestamp.toI32());
    decreaceStaking(event.params.user, event.params.amount);
}
