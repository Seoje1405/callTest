import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

export async function POST(req: NextRequest) {
  try {
    const { to, medicationName } = await req.json()

    if (!to || !medicationName) {
      return NextResponse.json(
        { error: '전화번호와 약 이름은 필수입니다.' },
        { status: 400 }
      )
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

    const call = await client.calls.create({
      url: `${baseUrl}/api/twiml?medication=${encodeURIComponent(medicationName)}`,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to,
    })

    return NextResponse.json({ success: true, sid: call.sid })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : '알 수 없는 오류'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
