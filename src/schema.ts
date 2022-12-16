import { z } from "zod";

export const spreadsheetsMetaResponseSchema = z.object({
  spreadsheetId: z.string(),
  properties: z.object({
    title: z.string(),
    locale: z.string(),
    autoRecalc: z.string(),
    timeZone: z.string(),
    defaultFormat: z.object({
      backgroundColor: z.object({
        red: z.number(),
        green: z.number(),
        blue: z.number(),
      }),
      padding: z.object({
        top: z.number(),
        right: z.number(),
        bottom: z.number(),
        left: z.number(),
      }),
      verticalAlignment: z.string(),
      wrapStrategy: z.string(),
      textFormat: z.object({
        foregroundColor: z.object({}),
        fontFamily: z.string(),
        fontSize: z.number(),
        bold: z.boolean(),
        italic: z.boolean(),
        strikethrough: z.boolean(),
        underline: z.boolean(),
        foregroundColorStyle: z.object({ rgbColor: z.object({}) }),
      }),
      backgroundColorStyle: z.object({
        rgbColor: z.object({
          red: z.number(),
          green: z.number(),
          blue: z.number(),
        }),
      }),
    }),
    spreadsheetTheme: z.object({
      primaryFontFamily: z.string(),
      themeColors: z.array(
        z.union([
          z.object({
            colorType: z.string(),
            color: z.object({ rgbColor: z.object({}) }),
          }),
          z.object({
            colorType: z.string(),
            color: z.object({
              rgbColor: z.object({
                red: z.number(),
                green: z.number(),
                blue: z.number(),
              }),
            }),
          }),
        ])
      ),
    }),
  }),
  sheets: z.array(
    z.union([
      z.object({
        properties: z.object({
          sheetId: z.number(),
          title: z.string(),
          index: z.number(),
          sheetType: z.string(),
          gridProperties: z.object({
            rowCount: z.number(),
            columnCount: z.number(),
          }),
        }),
        basicFilter: z.object({
          range: z.object({
            startRowIndex: z.number(),
            endRowIndex: z.number(),
            startColumnIndex: z.number(),
            endColumnIndex: z.number(),
          }),
          sortSpecs: z.array(
            z.object({ dimensionIndex: z.number(), sortOrder: z.string() })
          ),
        }),
      }),
      z.object({
        properties: z.object({
          sheetId: z.number(),
          title: z.string(),
          index: z.number(),
          sheetType: z.string(),
          gridProperties: z.object({
            rowCount: z.number(),
            columnCount: z.number(),
            frozenRowCount: z.number(),
          }),
        }),
        basicFilter: z.object({
          range: z.object({
            sheetId: z.number(),
            startRowIndex: z.number(),
            endRowIndex: z.number(),
            startColumnIndex: z.number(),
            endColumnIndex: z.number(),
          }),
          sortSpecs: z.array(
            z.object({ dimensionIndex: z.number(), sortOrder: z.string() })
          ),
          criteria: z.object({ 0: z.object({}) }),
          filterSpecs: z.array(
            z.object({ columnIndex: z.number(), filterCriteria: z.object({}) })
          ),
        }),
      }),
      z.object({
        properties: z.object({
          sheetId: z.number(),
          title: z.string(),
          index: z.number(),
          sheetType: z.string(),
          gridProperties: z.object({
            rowCount: z.number(),
            columnCount: z.number(),
          }),
        }),
      }),
    ])
  ),
  spreadsheetUrl: z.string(),
});

export const spreadsheetResponseSchema = z.object({
  range: z.string(),
  majorDimension: z.string(),
  values: z.array(z.array(z.string())).optional(),
});

export const rangeRecordsSchema = z.object({
  range: z.string(),
  majorDimension: z.enum(["ROWS", "COLUMNS"]),
  values: z.array(z.array(z.string())),
});
export type RangeRecords = z.infer<typeof rangeRecordsSchema>;
