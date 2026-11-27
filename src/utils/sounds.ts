let ctx: AudioContext | null = null

function getCtx() {
  if (!ctx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    ctx = new Ctor()
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

type ToneOptions = {
  type: OscillatorType
  from: number
  to: number
  duration: number
  volume?: number
  delay?: number
}

function tone(c: AudioContext, pitch: number, o: ToneOptions) {
  const start = c.currentTime + (o.delay ?? 0)
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = o.type
  osc.frequency.setValueAtTime(o.from * pitch, start)
  osc.frequency.exponentialRampToValueAtTime(Math.max(1, o.to * pitch), start + o.duration)
  gain.gain.setValueAtTime(o.volume ?? 0.15, start)
  gain.gain.exponentialRampToValueAtTime(0.001, start + o.duration)
  osc.connect(gain).connect(c.destination)
  osc.start(start)
  osc.stop(start + o.duration)
}

function noise(c: AudioContext, duration: number, volume: number, cutoff: number, delay = 0) {
  const start = c.currentTime + delay
  const buffer = c.createBuffer(1, Math.floor(c.sampleRate * duration), c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1

  const src = c.createBufferSource()
  const filter = c.createBiquadFilter()
  const gain = c.createGain()
  src.buffer = buffer
  filter.type = 'lowpass'
  filter.frequency.value = cutoff
  gain.gain.setValueAtTime(volume, start)
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration)
  src.connect(filter).connect(gain).connect(c.destination)
  src.start(start)
}

const sounds: Record<string, (c: AudioContext, p: number) => void> = {
  tackle: (c, p) => {
    tone(c, p, { type: 'square', from: 220, to: 60, duration: 0.12 })
    noise(c, 0.08, 0.2, 3000)
  },
  'quick attack': (c, p) => {
    tone(c, p, { type: 'sawtooth', from: 900, to: 300, duration: 0.06, volume: 0.1 })
    tone(c, p, { type: 'sawtooth', from: 1100, to: 400, duration: 0.06, volume: 0.1, delay: 0.07 })
  },
  'type blast': (c, p) => {
    tone(c, p, { type: 'square', from: 300, to: 1400, duration: 0.25, volume: 0.1 })
    tone(c, p, { type: 'triangle', from: 700, to: 150, duration: 0.2, volume: 0.15, delay: 0.2 })
  },
  'heavy hit': (c, p) => {
    tone(c, p, { type: 'square', from: 120, to: 35, duration: 0.3, volume: 0.25 })
    noise(c, 0.3, 0.3, 1200)
  },
}

export function playAttackSound(attackName: string, side: 'player' | 'opponent' = 'player') {
  try {
    const play = sounds[attackName.toLowerCase()] ?? sounds.tackle
    play(getCtx(), side === 'opponent' ? 0.75 : 1)
  } catch {
  }
}