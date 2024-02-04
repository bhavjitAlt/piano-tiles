import { readdir, readFile, writeFile } from 'fs/promises'
import pkg from '@tonejs/midi'
const { Midi } = pkg

const files = await readdir('midi')

for (const file of files) {
    const data = await readFile(`midi/${file}`)
    const midi = new Midi(data.buffer)

    const tracks = midi.tracks.filter(track => track.name.startsWith('Piano'))
    const mergesNotes = [...tracks[0].notes, ...tracks[1].notes]
        .map(note => ({
            time: note.time,
            name: convertSharpToFlat(note.name),
            duration: note.duration,
            velocity: note.velocity,
        }))
        .sort((a, b) => a.time - b.time)

    const track = {
        name: midi.header.name,
        composer: midi.header.meta[0].text,
        duration: midi.duration,
        notes: mergesNotes,
    }

    const trackName = file.substring(0, file.length - 4)
    await writeFile(`tracks/${trackName}.js`, trackName + ' = ' + JSON.stringify(track, null, 2))
}

function convertSharpToFlat(name) {
    if (!name.includes('#'))
        return name

    const sharpToFlat = {
        'A#': 'Bb',
        'C#': 'Db',
        'D#': 'Eb',
        'F#': 'Gb',
        'G#': 'Ab'
    }

    const noteLetter = name.slice(0, -1)
    const octave = name.slice(-1)

    if (sharpToFlat[noteLetter])
        return sharpToFlat[noteLetter] + octave

    return name
}
