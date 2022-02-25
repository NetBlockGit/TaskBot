import { createConnection, Connection } from "typeorm";


export function DbInit() {
    return createConnection();
}
