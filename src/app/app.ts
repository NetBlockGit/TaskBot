import { BotStart } from "../bot/bot";
import { DbInit } from "../db/db";
import "reflect-metadata";

export async function AppInit() {
    await DbInit()
    BotStart()
}