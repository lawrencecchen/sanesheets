import { z, ZodType } from "zod";
import { BASE_SHEETS_URL } from "./const.js";
import { RangeRecords, rangeRecordsSchema } from "./schema.js";

function recordsToObjects(records: RangeRecords) {
	const results: Array<Record<string, string>> = [];
	const headers = records.values?.[0];
	for (let i = 1; i < records.values.length; ++i) {
		const row = records.values[i];
		const obj: Record<string, string> = {};
		for (let j = 0; j < headers.length; ++j) {
			obj[headers[j]] = row[j] ?? "";
		}
		results.push(obj);
	}
	return results;
}

export function sanesheets<
	T extends Record<string, ZodType<any, any, any>>
>(opts: { apiKey: string; sheetId: string; spreadsheetSchema: T }) {
	const baseUrl = BASE_SHEETS_URL + opts.sheetId;
	const searchParams = new URLSearchParams();
	searchParams.set("key", opts.apiKey);
	return {
		from<K extends keyof typeof opts.spreadsheetSchema>(sheetName: K) {
			async function range(range: string) {
				const url = new URL(
					baseUrl +
						`/values/${encodeURIComponent(
							String(sheetName)
						)}!${encodeURIComponent(range)}`
				);
				url.searchParams.set("majorDimension", "ROWS");
				url.searchParams.set("key", opts.apiKey);
				return (await fetch(url.toString())
					.then((r) => r.json())
					.then(rangeRecordsSchema.parse)
					.then(recordsToObjects)
					.then(z.array(opts.spreadsheetSchema[sheetName]).parse)) as Array<
					z.infer<typeof opts.spreadsheetSchema[K]>
				>;
			}
			return {
				range,
				all: async () => await range("A1:AF1000"),
			};
		},
	};
}
