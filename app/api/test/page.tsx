// pages/api/hello.js

import { NextRequest, NextResponse } from "next/server";

export default function GET(req: NextRequest) {
  const url = req.nextUrl;
  console.log("Query string:", JSON.stringify(url));

  return NextResponse.json({ "Message ": "hello" });
}
