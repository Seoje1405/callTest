import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

export async function POST(req: NextRequest) {
  try {
    const { to, medicationName, time } = await req.json()

    if (!to || !medicationName) {
      return NextResponse.json(
        { error: '전화번호와 약 이름은 필수입니다.' },
        { status: 400 }
      )
    }

    const message = await client.messages.create({
      body: `[복약 알림] ${time ?? '지금'} ${medicationName} 복용하실 시간입니다. 건강하세요!`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    })

    return NextResponse.json({ success: true, sid: message.sid })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : '알 수 없는 오류'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
