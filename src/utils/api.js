// Claude API 호출 — 직접 Anthropic 대신 우리 서버리스 함수를 통해 호출
export async function askClaude({ system, prompt, max_tokens = 2000 }) {
  const res = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ system, prompt, max_tokens }),
  })
  const data = await res.json()
  return data.content?.[0]?.text || '응답을 불러오지 못했습니다.'
}
