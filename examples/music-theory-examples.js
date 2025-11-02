const MusicTheory = require('../lib/music-theory');

// Initialize the Music Theory module
const theory = new MusicTheory();

console.log('=== MUSIC THEORY EXAMPLES ===\n');

// Example 1: Get scales
console.log('1. SCALES');
console.log('C Major Scale:', theory.getScale('C', 'major'));
console.log('A Minor Scale:', theory.getScale('A', 'minor'));
console.log('D Dorian Scale:', theory.getScale('D', 'dorian'));
console.log('G Mixolydian Scale:', theory.getScale('G', 'mixolydian'));
console.log();

// Example 2: Get chord information
console.log('2. CHORDS');
console.log('C Major Chord:', theory.getChord('Cmaj'));
console.log('Am7 Chord:', theory.getChord('Am7'));
console.log('Dmaj7 Chord:', theory.getChord('Dmaj7'));
console.log('G7 Chord:', theory.getChord('G7'));
console.log();

// Example 3: Get chords in a key
console.log('3. CHORDS IN KEY');
console.log('Chords in C Major:', theory.getChordsInKey('C major'));
console.log('Chords in A Minor:', theory.getChordsInKey('A minor'));
console.log();

// Example 4: Chord progressions
console.log('4. CHORD PROGRESSIONS');
console.log('Pop Progression in C:', theory.getProgression('C major', 'pop'));
console.log('Jazz Progression in G:', theory.getProgression('G major', 'jazz'));
console.log('Blues Progression in E:', theory.getProgression('E major', 'blues'));
console.log();

// Example 5: Intervals
console.log('5. INTERVALS');
console.log('C to E:', theory.getInterval('C', 'E'));
console.log('G to D:', theory.getInterval('G', 'D'));
console.log('A to C#:', theory.getInterval('A', 'C#'));
console.log();

// Example 6: Transposition
console.log('6. TRANSPOSITION');
console.log('C transposed up by Perfect 5th:', theory.transpose('C', 'P5'));
console.log('Transpose notes [C, E, G] up by Major 3rd:', theory.transpose(['C', 'E', 'G'], '3M'));
console.log();

// Example 7: Note frequency
console.log('7. NOTE FREQUENCIES');
console.log('A4 frequency:', theory.getNoteFrequency('A4'), 'Hz');
console.log('C4 frequency:', theory.getNoteFrequency('C4'), 'Hz');
console.log('Frequency 440 Hz is note:', theory.getFrequencyNote(440));
console.log();

// Example 8: Detect chord from notes
console.log('8. CHORD DETECTION');
console.log('Detect chord from [C, E, G]:', theory.detectChord(['C', 'E', 'G']));
console.log('Detect chord from [D, F#, A]:', theory.detectChord(['D', 'F#', 'A']));
console.log('Detect chord from [G, B, D, F]:', theory.detectChord(['G', 'B', 'D', 'F']));
console.log();

// Example 9: Melody analysis
console.log('9. MELODY ANALYSIS');
const melody = ['C4', 'D4', 'E4', 'G4', 'E4', 'C4', 'G4', 'F4'];
console.log('Analyzing melody:', melody);
console.log('Result:', theory.analyzeMelody(melody));
console.log();

// Example 10: Generate melody
console.log('10. GENERATE MELODY');
console.log('Random melody in C major:', theory.generateMelody('C major', 8, 'random'));
console.log('Ascending melody in G major:', theory.generateMelody('G major', 8, 'ascending'));
console.log('Arpeggio in Am:', theory.generateMelody('A minor', 8, 'arpeggio'));
console.log();

// Example 11: Voice leading
console.log('11. VOICE LEADING');
const chord1 = ['C', 'E', 'G'];
const chord2 = ['G', 'B', 'D'];
console.log('Voice leading from C to G:', theory.getVoiceLeading(chord1, chord2));
console.log();

// Example 12: Enharmonic equivalents
console.log('12. ENHARMONIC NOTES');
console.log('C# enharmonic:', theory.getEnharmonic('C#'));
console.log('Gb enharmonic:', theory.getEnharmonic('Gb'));
console.log();
