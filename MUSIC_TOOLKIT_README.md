# Audio and Music Theory Toolkit

A comprehensive Node.js toolkit for working with audio files, MIDI, music theory, vocal patterns, and guitar. This toolkit provides everything you need to understand, manipulate, create, and edit audio and music programmatically.

## Features

### 🎵 Music Theory
- Scales (major, minor, modes, exotic scales)
- Chord construction and analysis
- Chord progressions (pop, jazz, blues, etc.)
- Intervals and transposition
- Note/frequency conversion
- Melody analysis and generation
- Voice leading analysis
- Key detection from melodies

### 🎸 Guitar Utilities
- Chord diagrams with fingering positions
- 12+ strumming patterns for different styles
- Multiple playing techniques (fingerpicking, tapping, slide, etc.)
- Guitar types and body shapes
- Alternative tunings (Drop D, Open G, DADGAD, etc.)
- Scale positions on fretboard
- Practice exercises for all skill levels
- Chord progression difficulty analysis

### 🎤 Vocal Pattern Analysis
- Melody contour analysis
- Vocal range detection and classification
- Phrasing and breath support analysis
- Melisma detection
- Vibrato analysis
- Vocal leap detection
- Rhythm pattern analysis
- Vocal exercise generation

### 🎹 MIDI File Utilities
- Read and write MIDI files
- Create melodies, chords, and progressions
- Drum pattern generation
- Arpeggio creation
- Multi-track MIDI
- Scale and rhythm patterns
- Transpose MIDI
- Tempo and time signature control
- MIDI analysis

### 🎧 WAV File Utilities
- Read and write WAV files
- Generate tones and silence
- Mix multiple audio files
- Concatenate audio files
- Fade in/out effects
- Volume/gain adjustment
- Audio reversal
- Sample rate conversion
- Bit depth conversion
- Mono/stereo conversion
- Trim and extract segments
- Audio analysis (RMS, peak, clipping detection)

### 🎚️ Audio Processing
- Combine multiple files sequentially
- Mix files with volume control
- Extract audio segments
- Split files into segments
- Normalize audio volume
- Crossfade between files
- Format conversion
- Create audio loops
- Batch processing
- Multi-file analysis

## Installation

```bash
npm install
```

### Dependencies

The toolkit uses these packages:
- `wavefile` - WAV file manipulation
- `midi-writer-js` - MIDI file creation
- `@tonejs/midi` - MIDI file reading and analysis
- `tonal` - Music theory utilities

## Quick Start

### Music Theory Example

```javascript
const { MusicTheory } = require('./lib');

const theory = new MusicTheory();

// Get a scale
const cMajor = theory.getScale('C', 'major');
console.log('C Major Scale:', cMajor);

// Get chord information
const chord = theory.getChord('Cmaj7');
console.log('Cmaj7 notes:', chord.notes);

// Get chord progression
const progression = theory.getProgression('C major', 'pop');
console.log('Pop progression:', progression);

// Transpose notes
const transposed = theory.transpose(['C', 'E', 'G'], 'P5');
console.log('Transposed:', transposed);
```

### WAV File Example

```javascript
const { WavUtils } = require('./lib');

const wavUtils = new WavUtils();

// Generate a 440 Hz tone for 2 seconds
const tone = wavUtils.generateTone(440, 2, {
  sampleRate: 44100,
  bitDepth: 16,
  numChannels: 1
});

// Save to file
wavUtils.writeWav(tone, 'output/a440.wav');

// Mix multiple tones to create a chord
const c = wavUtils.generateTone(261.63, 2); // C4
const e = wavUtils.generateTone(329.63, 2); // E4
const g = wavUtils.generateTone(392.00, 2); // G4

const chord = wavUtils.mix([c, e, g], [0.33, 0.33, 0.33]);
wavUtils.writeWav(chord, 'output/c_major.wav');
```

### MIDI File Example

```javascript
const { MidiUtils } = require('./lib');

const midiUtils = new MidiUtils();

// Create a simple melody
const melody = midiUtils.createMelody(
  ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'],
  { tempo: 120, duration: '4' }
);

// Save to file
midiUtils.writeMidi(melody, 'output/melody.mid');

// Create a chord progression
const progression = midiUtils.createChordProgression([
  { notes: ['C4', 'E4', 'G4'], duration: '2' },
  { notes: ['A3', 'C4', 'E4'], duration: '2' },
  { notes: ['F3', 'A3', 'C4'], duration: '2' },
  { notes: ['G3', 'B3', 'D4'], duration: '2' }
], { tempo: 100 });

midiUtils.writeMidi(progression, 'output/progression.mid');
```

### Guitar Example

```javascript
const { Guitar } = require('./lib');

const guitar = new Guitar();

// Get chord diagram
const cChord = guitar.getChordDiagram('C');
console.log(cChord.diagram);

// Get strumming pattern
const pattern = guitar.getStrummingPattern('basic');
console.log('Pattern:', pattern.pattern);
console.log(pattern.visualization);

// Analyze chord progression
const analysis = guitar.analyzeProgressionDifficulty(['G', 'C', 'D', 'Em']);
console.log('Difficulty:', analysis.overallLevel);

// Generate fingerpicking pattern
const picking = guitar.generateFingerpickingPattern('travis', 4);
console.log('Pattern:', picking.pattern.join('-'));
```

### Audio Processing Example

```javascript
const { AudioProcessor } = require('./lib');

const processor = new AudioProcessor();

// Combine multiple files
processor.combineSequentially(
  ['file1.wav', 'file2.wav', 'file3.wav'],
  'output/combined.wav'
);

// Mix files with volume control
processor.mixTogether([
  { path: 'vocals.wav', volume: 1.0 },
  { path: 'guitar.wav', volume: 0.8 },
  { path: 'drums.wav', volume: 0.6 }
], 'output/mix.wav');

// Extract segment
processor.extractSegment('input.wav', 'output/segment.wav', 10, 30);

// Normalize volume
processor.normalizeVolume('input.wav', 'output/normalized.wav', 0.9);
```

### Vocal Pattern Example

```javascript
const { VocalPatterns } = require('./lib');

const vocal = new VocalPatterns();

// Analyze melody contour
const contour = vocal.analyzeMelodyContour([60, 62, 64, 65, 67, 69, 71, 72]);
console.log('Melody shape:', contour.shape);

// Detect vocal range
const range = vocal.detectVocalRange([200, 250, 300, 400, 500, 600]);
console.log('Likely vocal range:', range.likelyRange);

// Analyze phrasing
const phrasing = vocal.analyzePhrasing([
  { type: 'A', duration: 4 },
  { type: 'A', duration: 4 },
  { type: 'B', duration: 4 },
  { type: 'A', duration: 4 }
]);
console.log('Structure:', phrasing.structureType);

// Generate vocal exercise
const exercise = vocal.generateVocalExercise('scale', {
  startNote: 60,
  range: 12
});
console.log('Exercise pattern:', exercise.pattern);
```

## Module Reference

### MusicTheory

#### Methods

- `getScale(tonic, scaleType)` - Get notes in a scale
- `getChord(chordName)` - Get chord information
- `getChordsInKey(key)` - Get diatonic chords in a key
- `getProgression(key, progressionType)` - Get chord progression
- `getInterval(note1, note2)` - Calculate interval between notes
- `transpose(notes, interval)` - Transpose notes
- `getNoteFrequency(note)` - Get frequency in Hz
- `getFrequencyNote(frequency)` - Get note from frequency
- `detectChord(notes)` - Detect chord from notes
- `analyzeMelody(notes)` - Analyze melody for key and patterns
- `generateMelody(key, length, pattern)` - Generate melody
- `getVoiceLeading(chord1, chord2)` - Analyze voice leading

### WavUtils

#### Methods

- `readWav(filePath)` - Read WAV file
- `createWav(samples, options)` - Create WAV from samples
- `writeWav(wav, outputPath)` - Write WAV to file
- `generateTone(frequency, duration, options)` - Generate sine wave
- `generateSilence(duration, options)` - Generate silence
- `concatenate(wavFiles)` - Combine WAV files sequentially
- `mix(wavFiles, volumes)` - Mix multiple WAV files
- `fadeIn(wav, duration)` - Apply fade in
- `fadeOut(wav, duration)` - Apply fade out
- `changeVolume(wav, gain)` - Adjust volume
- `reverse(wav)` - Reverse audio
- `trim(wav, startTime, endTime)` - Extract portion
- `resample(wav, newSampleRate)` - Change sample rate
- `changeBitDepth(wav, newBitDepth)` - Change bit depth
- `convertChannels(wav, targetChannels)` - Convert mono/stereo
- `analyze(wav)` - Analyze audio characteristics

### MidiUtils

#### Methods

- `readMidi(filePath)` - Read MIDI file
- `createMidi(options)` - Create new MIDI
- `writeMidi(track, outputPath)` - Write MIDI to file
- `createMelody(noteNames, options)` - Create melody
- `createChordProgression(chords, options)` - Create progression
- `createArpeggio(chordNotes, options)` - Create arpeggio
- `createDrumPattern(pattern, options)` - Create drum pattern
- `createScale(rootNote, intervals, options)` - Create scale
- `createRhythm(rhythmPattern, pitch, options)` - Create rhythm
- `addNotes(track, notes)` - Add notes to track
- `addChord(track, pitches, options)` - Add chord to track
- `noteToMidi(noteName)` - Convert note to MIDI number
- `midiToNote(midiNote)` - Convert MIDI number to note
- `analyzeMidi(midi)` - Analyze MIDI file
- `transposeMidi(midi, semitones)` - Transpose MIDI

### Guitar

#### Methods

- `getChordDiagram(chordName)` - Get chord diagram
- `getStrummingPattern(patternName)` - Get strumming pattern
- `getAllStrummingPatterns()` - Get all patterns
- `getPlayingStyle(styleName)` - Get playing style info
- `getAllPlayingStyles()` - Get all styles
- `getGuitarType(typeName)` - Get guitar type info
- `getTuning(tuningName)` - Get tuning notes
- `generateFingerpickingPattern(patternType, measures)` - Generate pattern
- `generateScalePositions(scaleNotes, tuning)` - Get scale on fretboard
- `getPracticeExercises(level)` - Get practice exercises
- `analyzeProgressionDifficulty(chords)` - Analyze difficulty

### AudioProcessor

#### Methods

- `combineSequentially(filePaths, outputPath)` - Combine files
- `mixTogether(inputs, outputPath)` - Mix files with volumes
- `extractSegment(inputPath, outputPath, startTime, endTime)` - Extract portion
- `splitIntoSegments(inputPath, outputDir, segmentDuration)` - Split file
- `normalizeVolume(inputPath, outputPath, targetLevel)` - Normalize
- `crossfade(file1Path, file2Path, outputPath, duration)` - Crossfade
- `convertFormat(inputPath, outputPath, options)` - Convert format
- `createLoop(inputPath, outputPath, repetitions)` - Create loop
- `batchProcess(inputPaths, outputDir, operation, suffix)` - Batch process
- `analyzeMultiple(filePaths)` - Analyze multiple files

### VocalPatterns

#### Methods

- `analyzeMelodyContour(notes)` - Analyze contour
- `detectVocalRange(frequencies)` - Detect range
- `analyzePhrasing(phrases)` - Analyze phrasing
- `analyzeRhythm(durations)` - Analyze rhythm
- `analyzeMelisma(syllables)` - Analyze melisma
- `detectVocalLeaps(notes)` - Detect leaps
- `analyzeVibrato(pitchData)` - Analyze vibrato
- `generateVocalExercise(exerciseType, options)` - Generate exercise
- `analyzeBreathSupport(phrases)` - Analyze breath needs

## Examples

Complete working examples are available in the `examples/` directory:

- `music-theory-examples.js` - Music theory demonstrations
- `wav-examples.js` - WAV file manipulation
- `midi-examples.js` - MIDI file creation
- `guitar-examples.js` - Guitar utilities

Run examples:

```bash
node examples/music-theory-examples.js
node examples/wav-examples.js
node examples/midi-examples.js
node examples/guitar-examples.js
```

## Common Use Cases

### Create a Song from Scratch

```javascript
const { MusicTheory, MidiUtils, WavUtils } = require('./lib');

const theory = new MusicTheory();
const midi = new MidiUtils();
const wav = new WavUtils();

// 1. Get chord progression
const progression = theory.getProgression('C major', 'pop');

// 2. Create MIDI from progression
const chords = progression.map(p => ({
  notes: p.notes || [p.root],
  duration: '1'
}));
const midiTrack = midi.createChordProgression(chords, { tempo: 120 });

// 3. Save MIDI
midi.writeMidi(midiTrack, 'my-song.mid');
```

### Analyze Audio File

```javascript
const { WavUtils, AudioProcessor } = require('./lib');

const wavUtils = new WavUtils();
const processor = new AudioProcessor();

// Read and analyze
const result = wavUtils.readWav('song.wav');
const analysis = wavUtils.analyze(result.data);

console.log('Duration:', analysis.duration, 'seconds');
console.log('Sample Rate:', analysis.sampleRate, 'Hz');
console.log('Bit Depth:', analysis.bitDepth, 'bits');
console.log('Channels:', analysis.numChannels);
console.log('RMS Level:', analysis.rmsLevel);
console.log('Peak Level:', analysis.peakLevel);
console.log('Clipping:', analysis.isClipping ? 'Yes' : 'No');
```

### Guitar Practice Session

```javascript
const { Guitar, MusicTheory } = require('./lib');

const guitar = new Guitar();
const theory = new MusicTheory();

// Get today's chords to practice
const chords = ['C', 'G', 'D', 'Em'];

chords.forEach(chordName => {
  const chord = guitar.getChordDiagram(chordName);
  console.log(`\n${chordName} Chord:`);
  console.log(chord.diagram);
});

// Get a strumming pattern
const pattern = guitar.getStrummingPattern('folk');
console.log('\nToday\'s Strumming Pattern:');
console.log(pattern.visualization);

// Get practice exercises
const exercises = guitar.getPracticeExercises('beginner');
console.log('\nPractice Exercises:');
exercises.forEach(ex => {
  console.log(`\n${ex.name}: ${ex.description}`);
});
```

## Advanced Usage

### Custom Audio Effects Chain

```javascript
const { WavUtils } = require('./lib');

const wav = new WavUtils();

// Read source file
const source = wav.readWav('input.wav');

// Apply effects chain
let processed = source.data;
processed = wav.fadeIn(processed, 0.5);
processed = wav.changeVolume(processed, 1.2);
processed = wav.fadeOut(processed, 1.0);

// Save result
wav.writeWav(processed, 'output.wav');
```

### Generate Musical Backing Track

```javascript
const { MidiUtils, MusicTheory } = require('./lib');

const midi = new MidiUtils();
const theory = new MusicTheory();

// Create bassline
const bassNotes = ['C2', 'C2', 'F2', 'F2', 'G2', 'G2', 'C2', 'C2'];
const bass = midi.createMelody(bassNotes, { tempo: 120, duration: '4' });

// Create chord track
const chordProg = midi.createChordProgression([
  { notes: ['C4', 'E4', 'G4'], duration: '2' },
  { notes: ['F4', 'A4', 'C5'], duration: '2' },
  { notes: ['G4', 'B4', 'D5'], duration: '2' },
  { notes: ['C4', 'E4', 'G4'], duration: '2' }
], { tempo: 120 });

// Create drum pattern
const drums = midi.createDrumPattern([
  { drum: 'kick', duration: '4' },
  { drum: 'hihat', duration: '8' },
  { drum: 'snare', duration: '4' },
  { drum: 'hihat', duration: '8' }
], { tempo: 120 });

// Merge tracks
const backing = midi.mergeTracks([bass, chordProg, drums]);
midi.writeMidi(backing.tracks, 'backing-track.mid');
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## Support

For questions and support, please open an issue on the repository.
