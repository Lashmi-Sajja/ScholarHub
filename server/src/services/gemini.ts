const API_URL = 'https://openrouter.ai/api/v1/chat/completions'

function getApiKey(): string {
  return process.env.OPENROUTER_API_KEY || ''
}

async function callOpenRouter(prompt: string): Promise<string> {
  const key = getApiKey()
  if (!key) throw new Error('OPENROUTER_API_KEY not configured')
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenRouter API error: ${err}`)
  }
  const data = await res.json()
  return data.choices?.[0]?.message?.content || 'No response'
}

export async function generatePlan(
  subjects: { name: string; deadline: string }[],
  availableHoursPerDay: number,
): Promise<{ tasks: { day: number; subject: string; description: string; duration: number }[] }> {
  const subjectList = subjects.map((s) => `${s.name} (deadline: ${s.deadline})`).join(', ')
  const prompt = `Create a 7-day study plan. Available hours per day: ${availableHoursPerDay}. Subjects: ${subjectList}.
Return ONLY a valid JSON array of tasks, no other text. Each task has: day (1-7), subject, description, duration (minutes).
Example format: [{"day":1,"subject":"Math","description":"Review chapter 1","duration":120}]`
  const text = await callOpenRouter(prompt)
  const cleaned = text.replace(/```json|```/g, '').trim()
  const tasks = JSON.parse(cleaned)
  return { tasks }
}

export async function askGemini(question: string): Promise<string> {
  const prompt = `You are an AI academic assistant helping a student. Answer the following question clearly and concisely. If you don't know the answer, say so.

Question: ${question}`
  return callOpenRouter(prompt)
}
