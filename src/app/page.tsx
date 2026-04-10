'use client'

import { useState } from 'react'

export default function Home() {
  const [to, setTo] = useState('')
  const [medicationName, setMedicationName] = useState('')
  const [time, setTime] = useState('')
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [loading, setLoading] = useState<'sms' | 'call' | null>(null)

  async function sendSms() {
    setLoading('sms')
    setStatus(null)
    try {
      const res = await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, medicationName, time }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus({ type: 'success', message: `SMS 발송 완료 (SID: ${data.sid})` })
      } else {
        setStatus({ type: 'error', message: data.error })
      }
    } catch {
      setStatus({ type: 'error', message: '네트워크 오류가 발생했습니다.' })
    } finally {
      setLoading(null)
    }
  }

  async function makeCall() {
    setLoading('call')
    setStatus(null)
    try {
      const res = await fetch('/api/make-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, medicationName }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus({ type: 'success', message: `전화 발신 완료 (SID: ${data.sid})` })
      } else {
        setStatus({ type: 'error', message: data.error })
      }
    } catch {
      setStatus({ type: 'error', message: '네트워크 오류가 발생했습니다.' })
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 dark:bg-black min-h-screen">
      <main className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-md p-8 flex flex-col gap-6">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">복약 알림 테스트</h1>

        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            수신 전화번호
            <input
              type="tel"
              placeholder="+821012345678"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            약 이름
            <input
              type="text"
              placeholder="아스피린 100mg"
              value={medicationName}
              onChange={(e) => setMedicationName(e.target.value)}
              className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            복용 시간 <span className="font-normal text-zinc-400">(SMS 전용, 선택)</span>
            <input
              type="text"
              placeholder="오전 9시"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500"
            />
          </label>
        </div>

        <div className="flex gap-3">
          <button
            onClick={sendSms}
            disabled={loading !== null || !to || !medicationName}
            className="flex-1 rounded-lg bg-zinc-900 dark:bg-zinc-50 px-4 py-2 text-sm font-medium text-white dark:text-zinc-900 transition-colors hover:bg-zinc-700 dark:hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading === 'sms' ? '전송 중...' : 'SMS 발송'}
          </button>
          <button
            onClick={makeCall}
            disabled={loading !== null || !to || !medicationName}
            className="flex-1 rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-100 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading === 'call' ? '발신 중...' : '전화 발신'}
          </button>
        </div>

        {status && (
          <p className={`rounded-lg px-4 py-3 text-sm ${
            status.type === 'success'
              ? 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300'
              : 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300'
          }`}>
            {status.message}
          </p>
        )}
      </main>
    </div>
  )
}
