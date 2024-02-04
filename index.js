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

const SOUNDS = ['A0', 'A5', 'Ab3', 'B0', 'B5', 'Bb2', 'Bb7', 'C5', 'D2', 'D7', 'Db5', 'E2', 'E7', 'Eb5', 'F3', 'G1', 'G6', 'Gb4', 'A1', 'A6', 'Ab4', 'B1', 'B6', 'Bb3', 'C1', 'C6', 'D3', 'Db1', 'Db6', 'E3', 'Eb1', 'Eb6', 'F4', 'G2', 'G7', 'Gb5', 'A2', 'A7', 'Ab5', 'B2', 'B7', 'Bb4', 'C2', 'C7', 'D4', 'Db2', 'Db7', 'E4', 'Eb2', 'Eb7', 'F5', 'G3', 'Gb1', 'Gb6', 'A3', 'Ab1', 'Ab6', 'B3', 'Bb0', 'Bb5', 'C3', 'C8', 'D5', 'Db3', 'Db8', 'E5', 'Eb3', 'F1', 'F6', 'G4', 'Gb2', 'Gb7', 'A4', 'Ab2', 'Ab7', 'B4', 'Bb1', 'Bb6', 'C4', 'D1', 'D6', 'Db4', 'E1', 'E6', 'Eb4', 'F2', 'F7', 'G5', 'Gb3']

let progress = 0
for (const sound of SOUNDS) {
    loadAndDecodeAudio(`./mp3/${sound}.mp3`).then(async ({ audioSamples, sampleRate }) => {
        const base64 = float32ArrayToBase64(audioSamples)
        console.log(sound + ' = \'' + base64 + '\'\n')
    })
}
