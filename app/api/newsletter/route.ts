import { NextResponse } from "next/server";

const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SHEET_SCRIPT_URL;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email || !email.includes("@")) {
            return NextResponse.json(
                { success: false, error: "Invalid email address" },
                { status: 400 }
            );
        }

        const timestamp = new Date().toISOString();
        console.log(`[Newsletter] New subscription: ${email} at ${timestamp}`);

        // OPTION 1: Google Sheets Integration (Simple)
        // If GOOGLE_SHEET_SCRIPT_URL is set, we post to it.
        if (GOOGLE_SCRIPT_URL) {
            try {
                await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors', // Google Scripts often require no-cors for simple posts
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, timestamp }),
                });
                console.log(`[Newsletter] Sent to Google Sheet: ${email}`);
            } catch (sheetError) {
                console.error("[Newsletter] Failed to send to Google Sheet:", sheetError);
            }
        }

        // OPTION 2: Fallback (Log for later extraction)
        // In production, you would iterate these logs or use a real DB.

        return NextResponse.json({
            success: true,
            message: "Subscribed successfully",
        });
    } catch (error) {
        console.error("Newsletter subscription error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}

/**
 * INSTRUCTIONS FOR GOOGLE SHEETS SETUP:
 * 1. Create a new Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Paste the following code:
 * 
 * function doPost(e) {
 *   var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
 *   var data = JSON.parse(e.postData.contents);
 *   sheet.appendRow([data.timestamp, data.email]);
 *   return ContentService.createTextOutput(JSON.stringify({'result': 'success'})).setMimeType(ContentService.MimeType.JSON);
 * }
 * 
 * 4. Click Deploy > New Deployment
 * 5. Select type: Web app
 * 6. Set "Who has access" to "Anyone"
 * 7. Copy the Web App URL and set it as GOOGLE_SHEET_SCRIPT_URL in Vercel environment variables.
 */
