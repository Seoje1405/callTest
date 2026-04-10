import { SolapiMessageService } from "solapi";

const client = new SolapiMessageService(
  process.env.SOLAPI_API_KEY!,
  process.env.SOLAPI_API_SECRET!
);

export async function POST(request: Request) {
  const { to, medicationName, time } = await request.json();

  if (!to || !medicationName || !time) {
    return Response.json({ error: "to, medicationName, time 필드가 필요합니다." }, { status: 400 });
  }

  const text = `[복약 알림] ${time}에 ${medicationName}을(를) 복용할 시간입니다.`;

  const result = await client.sendOne({
    to,
    from: process.env.SOLAPI_FROM_NUMBER!,
    text,
    type: "SMS",
  });

  return Response.json({ success: true, result });
}
