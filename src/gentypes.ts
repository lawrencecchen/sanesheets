#!/usr/bin/env node
import z from "zod";
import { BASE_SHEETS_URL } from "./const.js";
import {
	spreadsheetResponseSchema,
	spreadsheetsMetaResponseSchema,
} from "./schema.js";
import fs from "node:fs";

export const envSchema = z.object({
	SHEETS_API_KEY: z.string(),
	SHEET_ID: z.string(),
});
export const env = envSchema.parse(process.env);

async function main() {
	const sheetsUrl = new URL(BASE_SHEETS_URL + env.SHEET_ID);
	sheetsUrl.searchParams.set("key", env.SHEETS_API_KEY);
	const spreadsheetsResponse = await fetch(sheetsUrl.toString());

	console.log(sheetsUrl);

	// get outDir arg with node
	const outDir = process.argv[2];

	if (!outDir) {
		throw new Error("No outDir specified");
	}

	if (!spreadsheetsResponse.ok) {
		console.error(spreadsheetsResponse);
		throw new Error("Failed to fetch spreadsheets");
	}

	const spreadsheetsMeta = await spreadsheetsResponse
		.json()
		.then(spreadsheetsMetaResponseSchema.parse);

	const promises = [];
	for (const sheet of spreadsheetsMeta.sheets) {
		const title = sheet.properties.title;
		const url = new URL(
			BASE_SHEETS_URL + env.SHEET_ID + `/values/${title}!A1:AF1` // we only want the first column
		);
		url.searchParams.set("majorDimension", "ROWS");
		url.searchParams.set("key", env.SHEETS_API_KEY);
		const request = fetch(url.toString());
		promises.push(request);
	}

	const responses = await Promise.all(promises);
	const spreadsheets = await Promise.all(
		responses.map((response) =>
			response.json().then(spreadsheetResponseSchema.parse)
		)
	);

	let outputSchemaBuilder =
		"import z from 'zod';\n\nexport const spreadsheetSchema = {\n";

	for (let i = 0; i < spreadsheets.length; ++i) {
		const sheet = spreadsheets[i];
		const sheetMeta = spreadsheetsMeta.sheets[i];
		const title = sheetMeta.properties.title;
		outputSchemaBuilder += `  "${title}": z.object({\n`;
		for (const [index, value] of sheet.values[0].entries()) {
			outputSchemaBuilder += `    "${value}": z.string(),\n`;
		}
		outputSchemaBuilder += `  }),\n`;
	}

	outputSchemaBuilder += "};\n";

	fs.mkdirSync(outDir, { recursive: true });
	fs.writeFileSync(outDir + "/schema.ts", outputSchemaBuilder);
	console.log(`Wrote ${outDir}/schema.ts`);
	console.log(`Use as such: 
const sheets = sanesheets({
	apiKey: "????",
});`);
}

main();
