import { SolapiMessageService } from "solapi";

const client = new SolapiMessageService(
  process.env.SOLAPI_API_KEY!,
  process.env.SOLAPI_API_SECRET!
);

export async function POST(request: Request) {
  const { to, medicationName } = await request.json();

  if (!to || !medicationName) {
    return Response.json({ error: "to, medicationName 필드가 필요합니다." }, { status: 400 });
  }

  const text = `${medicationName}을(를) 복용할 시간입니다.`;

  const result = await client.sendOne({
    to,
    from: process.env.SOLAPI_FROM_NUMBER!,
    text,
    type: "VOICE",
    voiceOptions: {
      voiceType: "FEMALE",
      headerMessage: "안녕하세요. 복약 알림입니다.",
      tailMessage: "감사합니다. 건강하세요.",
      replyRange: 1,
    },
  });

  return Response.json({ success: true, result });
}
