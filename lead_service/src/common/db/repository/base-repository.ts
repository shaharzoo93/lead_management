import DBGeneric from "../generic_crud.js";
import { config } from "dotenv";
config({ path: '/app/dev.env' });

export class DBBaseRepository extends DBGeneric {
    constructor() {
        super()
    }
}