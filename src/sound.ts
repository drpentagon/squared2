const audioContext = new AudioContext()

export const playBounce = () => {
  if (audioContext.state === "suspended") audioContext.resume()

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
