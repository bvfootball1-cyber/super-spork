
# Haikus for Codespaces

This is a quick node project template for demoing Codespaces. It is based on the [Azure node sample](https://github.com/Azure-Samples/nodejs-docs-hello-world). It's great!!!

Point your browser to [Quickstart for GitHub Codespaces](https://docs.github.com/en/codespaces/getting-started/quickstart) for a tour of using Codespaces with this repo.

---

## 🎵 Audio and Music Theory Toolkit

This repository now includes a comprehensive audio and music theory toolkit with the following capabilities:

### Features

- **Music Theory**: Scales, chords, progressions, intervals, transposition, melody analysis
- **WAV Files**: Create, edit, mix, combine, and analyze audio files
- **MIDI Files**: Read, write, create melodies, chords, drum patterns, and arpeggios
- **Guitar**: Chord diagrams, strumming patterns, playing styles, tunings, practice exercises
- **Vocal Patterns**: Melody contour, range detection, phrasing, vibrato analysis
- **Audio Processing**: Mix, combine, extract, normalize, crossfade, format conversion

### Quick Start

```javascript
const { MusicTheory, Guitar, WavUtils, MidiUtils } = require('./lib');

// Music Theory
const theory = new MusicTheory();
console.log('C Major Scale:', theory.getScale('C', 'major'));

// Guitar Chords
const guitar = new Guitar();
const chord = guitar.getChordDiagram('C');
console.log(chord.diagram);

// Generate a tone
const wav = new WavUtils();
const tone = wav.generateTone(440, 2); // A4 for 2 seconds
wav.writeWav(tone, 'tone.wav');

// Create MIDI melody
const midi = new MidiUtils();
const melody = midi.createMelody(['C4', 'D4', 'E4', 'F4', 'G4']);
midi.writeMidi(melody, 'melody.mid');
```

### Documentation

See [MUSIC_TOOLKIT_README.md](./MUSIC_TOOLKIT_README.md) for complete documentation.

### Examples

Run the example files to see all features:

```bash
node examples/music-theory-examples.js
node examples/guitar-examples.js
node examples/wav-examples.js
node examples/midi-examples.js
```

### Modules

All modules are located in the `lib/` directory:

- `music-theory.js` - Music theory utilities
- `wav-utils.js` - WAV file manipulation
- `midi-utils.js` - MIDI file utilities
- `guitar.js` - Guitar chord diagrams and patterns
- `vocal-patterns.js` - Vocal analysis
- `audio-processor.js` - High-level audio processing
