import { NextRequest, NextResponse } from 'next/server'

// GET: 전화 연결 시 Twilio가 호출 → 음성 안내 TwiML 반환
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const medication = searchParams.get('medication') ?? '약'

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather numDigits="1" action="/api/twiml" method="POST">
    <Say language="ko-KR" voice="Polly.Seoyeon">
      안녕하세요. 복약 알림입니다.
      지금 ${medication} 을 복용하실 시간입니다.
      복용하셨으면 1번을, 30분 후에 다시 알림받으시려면 2번을 눌러주세요.
    </Say>
  </Gather>
  <Say language="ko-KR" voice="Polly.Seoyeon">
    입력이 없어 전화를 종료합니다. 꼭 복용해 주세요.
  </Say>
</Response>`

  return new NextResponse(twiml, {
    headers: { 'Content-Type': 'text/xml; charset=utf-8' },
  })
}

// POST: Gather 키 입력 결과 처리
export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const digit = formData.get('Digits')

  const twiml = digit === '1'
    ? `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="ko-KR" voice="Polly.Seoyeon">
    복약이 확인되었습니다. 건강하세요!
  </Say>
</Response>`
    : `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="ko-KR" voice="Polly.Seoyeon">
    알겠습니다. 30분 후에 다시 알려드리겠습니다.
  </Say>
</Response>`

  return new NextResponse(twiml, {
    headers: { 'Content-Type': 'text/xml; charset=utf-8' },
  })
}
