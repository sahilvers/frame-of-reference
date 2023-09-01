import { google } from "googleapis";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const target = ["https://www.googleapis.com/auth/spreadsheets"];
      const jwt = new google.auth.JWT(
        process.env.GOOGLE_CLIENT_EMAIL,
        null,
        (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
        target
      );
      const sheets = google.sheets({ version: "v4", auth: jwt });

      // POST body contains the data from the form
      // It should look like this:
      // {
      //   "sheet": "Product",
      //   "answers": [["answer 1", "answer 2", "answer 3"]]
      // }
      const { sheet, answers } = req.body;

      const { data } = await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.SPREADSHEET_ID,
        range: sheet, // using provided sheet name
        valueInputOption: "RAW",
        insertDataOption: "INSERT_ROWS",
        resource: {
          values: [answers], // using the provided values,
        },
      });

      res.status(200).json({ success: true, data: data });
    } catch (error) {
      res.status(500).json({ error: "Error writing to Google Sheet" });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
