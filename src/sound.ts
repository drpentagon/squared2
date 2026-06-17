const audioContext = new AudioContext()

const resume = () => {
  if (audioContext.state === "suspended") audioContext.resume()
}

// Sine wave, frequency drops — soft bounce
export const playBounce = () => {
  resume()
  const oscillator = audioContext.createOscillator()
  const gain = audioContext.createGain()

  oscillator.type = "sine"
  oscillator.frequency.setValueAtTime(440, audioContext.currentTime)
  oscillator.frequency.exponentialRampToValueAtTime(
    220,
    audioContext.currentTime + 0.5,
  )

  gain.gain.setValueAtTime(0.2, audioContext.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1)

  oscillator.connect(gain)
  gain.connect(audioContext.destination)
  oscillator.start()
  oscillator.stop(audioContext.currentTime + 0.1)
}

// Triangle wave, instant click with fast decay — soft pop
export const playPop = () => {
  resume()
  const oscillator = audioContext.createOscillator()
  const gain = audioContext.createGain()

  oscillator.type = "triangle"
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
  oscillator.frequency.exponentialRampToValueAtTime(
    200,
    audioContext.currentTime + 0.08,
  )

  gain.gain.setValueAtTime(0.4, audioContext.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.08)

  oscillator.connect(gain)
  gain.connect(audioContext.destination)
  oscillator.start()
  oscillator.stop(audioContext.currentTime + 0.08)
}

// Square wave, two rising tones in sequence — coin collect
export const playCoin = () => {
  resume()
  const playTone = (freq: number, startTime: number) => {
    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()

    oscillator.type = "square"
    oscillator.frequency.setValueAtTime(freq, startTime)

    gain.gain.setValueAtTime(0.15, startTime)
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1)

    oscillator.connect(gain)
    gain.connect(audioContext.destination)
    oscillator.start(startTime)
    oscillator.stop(startTime + 0.1)
  }

  playTone(600, audioContext.currentTime)
  playTone(900, audioContext.currentTime + 0.1)
}

// Sawtooth wave, frequency sweeps down fast — laser shot
export const playLaser = () => {
  resume()
  const oscillator = audioContext.createOscillator()
  const gain = audioContext.createGain()

  oscillator.type = "sawtooth"
  oscillator.frequency.setValueAtTime(1200, audioContext.currentTime)
  oscillator.frequency.exponentialRampToValueAtTime(
    80,
    audioContext.currentTime + 0.2,
  )

  gain.gain.setValueAtTime(0.2, audioContext.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2)

  oscillator.connect(gain)
  gain.connect(audioContext.destination)
  oscillator.start()
  oscillator.stop(audioContext.currentTime + 0.2)
}

// Triangle wave, long sustain — bell
export const playBell = () => {
  resume()
  const oscillator = audioContext.createOscillator()
  const gain = audioContext.createGain()

  oscillator.type = "triangle"
  oscillator.frequency.setValueAtTime(880, audioContext.currentTime)

  gain.gain.setValueAtTime(0.3, audioContext.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1.5)

  oscillator.connect(gain)
  gain.connect(audioContext.destination)
  oscillator.start()
  oscillator.stop(audioContext.currentTime + 1.5)
}

// Low sine, drops to near zero fast — thud
export const playThud = () => {
  resume()
  const oscillator = audioContext.createOscillator()
  const gain = audioContext.createGain()

  oscillator.type = "sine"
  oscillator.frequency.setValueAtTime(150, audioContext.currentTime)
  oscillator.frequency.exponentialRampToValueAtTime(
    30,
    audioContext.currentTime + 0.15,
  )

  gain.gain.setValueAtTime(0.6, audioContext.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15)

  oscillator.connect(gain)
  gain.connect(audioContext.destination)
  oscillator.start()
  oscillator.stop(audioContext.currentTime + 0.15)
}

// White noise burst — explosion
export const playExplosion = () => {
  resume()
  const bufferSize = audioContext.sampleRate * 0.3
  const buffer = audioContext.createBuffer(
    1,
    bufferSize,
    audioContext.sampleRate,
  )
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1
  }

  const source = audioContext.createBufferSource()
  source.buffer = buffer

  const gain = audioContext.createGain()
  gain.gain.setValueAtTime(0.5, audioContext.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3)

  source.connect(gain)
  gain.connect(audioContext.destination)
  source.start()
}

// Square wave with fast vibrato — squeak
export const playSqueak = () => {
  resume()
  const oscillator = audioContext.createOscillator()
  const lfo = audioContext.createOscillator()
  const lfoGain = audioContext.createGain()
  const gain = audioContext.createGain()

  oscillator.type = "square"
  oscillator.frequency.setValueAtTime(600, audioContext.currentTime)

  lfo.frequency.setValueAtTime(30, audioContext.currentTime)
  lfoGain.gain.setValueAtTime(200, audioContext.currentTime)

  gain.gain.setValueAtTime(0.1, audioContext.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3)

  lfo.connect(lfoGain)
  lfoGain.connect(oscillator.frequency)
  oscillator.connect(gain)
  gain.connect(audioContext.destination)

  lfo.start()
  oscillator.start()
  lfo.stop(audioContext.currentTime + 0.3)
  oscillator.stop(audioContext.currentTime + 0.3)
}

const sounds = [
  playBounce,
  playPop,
  playCoin,
  playLaser,
  playBell,
  playThud,
  playExplosion,
  playSqueak,
]

let soundIndex = 0

export const playNext = () => {
  sounds[soundIndex]()
  soundIndex = (soundIndex + 1) % sounds.length
}
