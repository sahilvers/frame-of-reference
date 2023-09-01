import { google } from "googleapis";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const target = ["https://www.googleapis.com/auth/spreadsheets"];
      const jwt = new google.auth.JWT(
        process.env.GOOGLE_CLIENT_EMAIL,
        null,
        (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
        target
      );
      const sheets = google.sheets({ version: "v4", auth: jwt });

      // [1] get the occupied rows
      // [2] add a new row at the bottom
      // [3] write the data to the new row
      // [4] return success
      const { data } = await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.SPREADSHEET_ID,
        range: "Product",
        valueInputOption: "RAW",
        insertDataOption: "INSERT_ROWS",
        resource: {
          values: [["test2"]],
        },
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: "Error writing to Google Sheet", msg: error });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
