"use client";

import { useState } from "react";

export default function Home() {
  const [phone, setPhone] = useState("");
  const [medication, setMedication] = useState("");
  const [time, setTime] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function sendSms() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/send-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: phone, medicationName: medication, time }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult("SMS 발송 성공: " + JSON.stringify(data.result));
      } else {
        setResult("오류: " + (data.error ?? JSON.stringify(data)));
      }
    } catch (e) {
      setResult("네트워크 오류: " + String(e));
    } finally {
      setLoading(false);
    }
  }

  async function makeCall() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/make-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: phone, medicationName: medication }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult("음성전화 발송 성공: " + JSON.stringify(data.result));
      } else {
        setResult("오류: " + (data.error ?? JSON.stringify(data)));
      }
    } catch (e) {
      setResult("네트워크 오류: " + String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow p-8 flex flex-col gap-6">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          복약 알림 테스트
        </h1>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              전화번호 (하이픈 없이)
            </label>
            <input
              type="tel"
              placeholder="01012345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              약 이름
            </label>
            <input
              type="text"
              placeholder="타이레놀"
              value={medication}
              onChange={(e) => setMedication(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              복약 시간
            </label>
            <input
              type="text"
              placeholder="오전 8시"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={sendSms}
            disabled={loading}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            SMS 발송
          </button>
          <button
            onClick={makeCall}
            disabled={loading}
            className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-white font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            음성전화 발송
          </button>
        </div>

        {loading && (
          <p className="text-sm text-zinc-500 text-center">처리 중...</p>
        )}

        {result && (
          <div className="rounded-lg bg-zinc-100 dark:bg-zinc-800 p-4 text-sm text-zinc-700 dark:text-zinc-300 break-all">
            {result}
          </div>
        )}
      </main>
    </div>
  );
}
