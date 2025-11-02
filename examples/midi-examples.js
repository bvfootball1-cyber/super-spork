const MidiUtils = require('../lib/midi-utils');
const path = require('path');

// Initialize MIDI utilities
const midiUtils = new MidiUtils();

console.log('=== MIDI FILE EXAMPLES ===\n');

// Example 1: Create simple melody
console.log('1. CREATE SIMPLE MELODY');
const melody = midiUtils.createMelody(
  ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'],
  { tempo: 120, duration: '4', velocity: 80 }
);
const melodyResult = midiUtils.writeMidi(melody, path.join(__dirname, 'output/simple_melody.mid'));
console.log('Created C major scale melody');
console.log('Result:', melodyResult);
console.log();

// Example 2: Create chord progression
console.log('2. CREATE CHORD PROGRESSION');
const progression = midiUtils.createChordProgression([
  { notes: ['C4', 'E4', 'G4'], duration: '2' },      // C major
  { notes: ['A3', 'C4', 'E4'], duration: '2' },      // A minor
  { notes: ['F3', 'A3', 'C4'], duration: '2' },      // F major
  { notes: ['G3', 'B3', 'D4'], duration: '2' }       // G major
], { tempo: 100, velocity: 70 });
const progResult = midiUtils.writeMidi(progression, path.join(__dirname, 'output/chord_progression.mid'));
console.log('Created C-Am-F-G progression');
console.log('Result:', progResult);
console.log();

// Example 3: Create arpeggio
console.log('3. CREATE ARPEGGIO');
const arpeggio = midiUtils.createArpeggio(
  ['C4', 'E4', 'G4', 'C5'],
  { pattern: 'updown', repeats: 2, noteDuration: '8', tempo: 140 }
);
const arpResult = midiUtils.writeMidi(arpeggio, path.join(__dirname, 'output/arpeggio.mid'));
console.log('Created C major arpeggio (up and down)');
console.log('Result:', arpResult);
console.log();

// Example 4: Create drum pattern
console.log('4. CREATE DRUM PATTERN');
const drumPattern = midiUtils.createDrumPattern([
  { drum: 'kick', duration: '4', velocity: 100 },
  { drum: 'hihat', duration: '8', velocity: 60 },
  { drum: 'snare', duration: '4', velocity: 90 },
  { drum: 'hihat', duration: '8', velocity: 60 },
  { drum: 'kick', duration: '4', velocity: 100 },
  { drum: 'hihat', duration: '8', velocity: 60 },
  { drum: 'snare', duration: '4', velocity: 90 },
  { drum: 'hihat', duration: '8', velocity: 60 }
], { tempo: 120 });
const drumResult = midiUtils.writeMidi(drumPattern, path.join(__dirname, 'output/drum_pattern.mid'));
console.log('Created basic drum pattern');
console.log('Result:', drumResult);
console.log();

// Example 5: Create scale
console.log('5. CREATE SCALE');
const scale = midiUtils.createScale(
  'C4',
  [0, 2, 4, 5, 7, 9, 11, 12], // Major scale intervals
  { tempo: 100, duration: '8', ascending: true, descending: true }
);
const scaleResult = midiUtils.writeMidi(scale, path.join(__dirname, 'output/c_major_scale.mid'));
console.log('Created C major scale (ascending and descending)');
console.log('Result:', scaleResult);
console.log();

// Example 6: Create rhythm pattern
console.log('6. CREATE RHYTHM PATTERN');
const rhythm = midiUtils.createRhythm(
  ['4', '8', '8', '4', '4', '8', '8', '2'],
  'C4',
  { tempo: 120, velocity: 75 }
);
const rhythmResult = midiUtils.writeMidi(rhythm, path.join(__dirname, 'output/rhythm_pattern.mid'));
console.log('Created rhythm pattern on C4');
console.log('Result:', rhythmResult);
console.log();

// Example 7: Create multiple tracks
console.log('7. CREATE MULTI-TRACK MIDI');
const bassline = midiUtils.createMelody(
  ['C2', 'C2', 'F2', 'F2', 'G2', 'G2', 'C2', 'C2'],
  { tempo: 120, duration: '4' }
);

const chords = midiUtils.createChordProgression([
  { notes: ['C4', 'E4', 'G4'], duration: '2' },
  { notes: ['F4', 'A4', 'C5'], duration: '2' },
  { notes: ['G4', 'B4', 'D5'], duration: '2' },
  { notes: ['C4', 'E4', 'G4'], duration: '2' }
], { tempo: 120 });

const multiTrack = midiUtils.mergeTracks([bassline, chords]);
const multiResult = midiUtils.writeMidi(multiTrack.tracks, path.join(__dirname, 'output/multi_track.mid'));
console.log('Created multi-track MIDI with bassline and chords');
console.log('Result:', multiResult);
console.log();

// Example 8: Note conversions
console.log('8. NOTE CONVERSIONS');
console.log('C4 to MIDI number:', midiUtils.noteToMidi('C4'));
console.log('A4 to MIDI number:', midiUtils.noteToMidi('A4'));
console.log('MIDI 60 to note:', midiUtils.midiToNote(60));
console.log('MIDI 69 to note:', midiUtils.midiToNote(69));
console.log();

// Example 9: Create song structure
console.log('9. CREATE COMPLETE SONG STRUCTURE');
const { track } = midiUtils.createMidi({ tempo: 120 });

// Intro (arpeggios)
midiUtils.addChord(track, ['C4', 'E4', 'G4'], { duration: '4', velocity: 60 });
midiUtils.addChord(track, ['C4', 'E4', 'G4'], { duration: '4', velocity: 60 });

// Verse (melody)
const verseNotes = [
  { pitch: 'E4', duration: '4', velocity: 70 },
  { pitch: 'D4', duration: '4', velocity: 70 },
  { pitch: 'C4', duration: '4', velocity: 70 },
  { pitch: 'D4', duration: '4', velocity: 70 },
  { pitch: 'E4', duration: '4', velocity: 75 },
  { pitch: 'E4', duration: '4', velocity: 75 },
  { pitch: 'E4', duration: '2', velocity: 75 }
];
midiUtils.addNotes(track, verseNotes);

// Chorus (chords)
midiUtils.addChord(track, ['C4', 'E4', 'G4', 'C5'], { duration: '1', velocity: 85 });
midiUtils.addChord(track, ['F4', 'A4', 'C5'], { duration: '1', velocity: 85 });
midiUtils.addChord(track, ['G4', 'B4', 'D5'], { duration: '1', velocity: 85 });
midiUtils.addChord(track, ['C4', 'E4', 'G4', 'C5'], { duration: '1', velocity: 85 });

const songResult = midiUtils.writeMidi(track, path.join(__dirname, 'output/simple_song.mid'));
console.log('Created simple song structure (intro-verse-chorus)');
console.log('Result:', songResult);
console.log();

console.log('All MIDI examples completed!');
console.log('Check the examples/output/ directory for generated MIDI files.');
