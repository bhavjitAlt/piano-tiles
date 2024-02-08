async function fetchAudioFile(filePath) {
    const response = await fetch(filePath)
    const arrayBuffer = await response.arrayBuffer()
    return arrayBuffer
}

async function decodeAudioData(audioContext, arrayBuffer) {
    return await audioContext.decodeAudioData(arrayBuffer)
}

function getAudioSamples(audioBuffer) {
    // Assuming mono audio
    const channelData = audioBuffer.getChannelData(0)
    return channelData
}

async function loadAndDecodeAudio(filePath) {
    const audioContext = new AudioContext()

    const arrayBuffer = await fetchAudioFile(filePath)
    const audioBuffer = await decodeAudioData(audioContext, arrayBuffer)

    const sampleRate = audioBuffer.sampleRate
    const audioSamples = getAudioSamples(audioBuffer)

    return { audioSamples, sampleRate }
}

function float32ArrayToBase64(arr) {
    const bytes = new Uint8Array(arr.buffer)
    let binary = ''
    bytes.forEach((b) => binary += String.fromCharCode(b))
    return btoa(binary)
}

function base64ToFloat32Array(base64) {
    return new Float32Array((Uint8Array.from(atob(base64), c => c.charCodeAt(0))).buffer)
}

const NOTES = ['A0', 'Bb0', 'B0', 'C1', 'Db1', 'D1', 'Eb1', 'E1', 'F1', 'Gb1', 'G1', 'Ab1', 'A1', 'Bb1', 'B1', 'C2', 'Db2', 'D2', 'Eb2', 'E2', 'F2', 'Gb2', 'G2', 'Ab2', 'A2', 'Bb2', 'B2', 'C3', 'Db3', 'D3', 'Eb3', 'E3', 'F3', 'Gb3', 'G3', 'Ab3', 'A3', 'Bb3', 'B3', 'C4', 'Db4', 'D4', 'Eb4', 'E4', 'F4', 'Gb4', 'G4', 'Ab4', 'A4', 'Bb4', 'B4', 'C5', 'Db5', 'D5', 'Eb5', 'E5', 'F5', 'Gb5', 'G5', 'Ab5', 'A5', 'Bb5', 'B5', 'C6', 'Db6', 'D6', 'Eb6', 'E6', 'F6', 'Gb6', 'G6', 'Ab6', 'A6', 'Bb6', 'B6', 'C7', 'Db7', 'D7', 'Eb7', 'E7', 'F7', 'Gb7', 'G7', 'Ab7', 'A7', 'Bb7', 'B7', 'C8', 'Db8']

let progress = 0
for (const note of NOTES) {
    loadAndDecodeAudio(`./mp3/${note}.mp3`).then(async ({ audioSamples, sampleRate }) => {
        const base64 = float32ArrayToBase64(audioSamples)
        console.log(note + ' = \'' + base64 + '\'\n')
    })
}
