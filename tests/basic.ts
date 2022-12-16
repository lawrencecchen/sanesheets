import { spreadsheetSchema } from "../out/schema.js";
import { env } from "../src/gentypes.js";
import { sanesheets } from "../src/index.js";

const sheets = sanesheets({
	apiKey: env.SHEETS_API_KEY,
	sheetId: env.SHEET_ID,
	spreadsheetSchema,
});

// const gpus2 = await sheets.from("cloud vms (2gb, 1vcpu, shared)").range(``);
const gpus = await sheets.from("cloud gpus").all();
// const lol = gpus[0];
// if (!lol) {
// 	throw new Error("heh");
// }
const response = await sheets.from("cloud vms (2gb, 1vcpu, shared)").all();
