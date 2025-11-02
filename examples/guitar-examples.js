const Guitar = require('../lib/guitar');
const MusicTheory = require('../lib/music-theory');

// Initialize modules
const guitar = new Guitar();
const theory = new MusicTheory();

console.log('=== GUITAR EXAMPLES ===\n');

// Example 1: Display chord diagrams
console.log('1. CHORD DIAGRAMS');
console.log('\nC Major Chord:');
const cChord = guitar.getChordDiagram('C');
console.log(cChord.diagram);
console.log('Difficulty:', cChord.difficulty);
console.log('Notes:', cChord.notes);

console.log('\nG Major Chord:');
const gChord = guitar.getChordDiagram('G');
console.log(gChord.diagram);

console.log('\nF Major Chord (Barre):');
const fChord = guitar.getChordDiagram('F');
console.log(fChord.diagram);
console.log('This is a barre chord at fret', fChord.barre);
console.log();

// Example 2: Strumming patterns
console.log('2. STRUMMING PATTERNS');
console.log('\nBasic Strumming Pattern:');
const basicStrum = guitar.getStrummingPattern('basic');
console.log('Pattern:', basicStrum.pattern);
console.log(basicStrum.visualization);
console.log('Description:', basicStrum.description);

console.log('\nReggae Strumming Pattern:');
const reggaeStrum = guitar.getStrummingPattern('reggae');
console.log('Pattern:', reggaeStrum.pattern);
console.log(reggaeStrum.visualization);
console.log('Description:', reggaeStrum.description);

console.log('\nRock Strumming Pattern:');
const rockStrum = guitar.getStrummingPattern('rock');
console.log('Pattern:', rockStrum.pattern);
console.log(rockStrum.visualization);
console.log('Description:', rockStrum.description);
console.log();

// Example 3: All available strumming patterns
console.log('3. ALL STRUMMING PATTERNS');
const allPatterns = guitar.getAllStrummingPatterns();
Object.keys(allPatterns).forEach(name => {
  console.log(`${name}: ${allPatterns[name].description} (${allPatterns[name].difficulty})`);
});
console.log();

// Example 4: Playing styles
console.log('4. PLAYING STYLES');
console.log('\nFingerpicking:');
const fingerpicking = guitar.getPlayingStyle('fingerpicking');
console.log('Description:', fingerpicking.description);
console.log('Patterns:');
Object.keys(fingerpicking.patterns).forEach(pattern => {
  console.log(`  - ${fingerpicking.patterns[pattern].name}: ${fingerpicking.patterns[pattern].description}`);
});
console.log('Genres:', fingerpicking.genres.join(', '));

console.log('\nTapping:');
const tapping = guitar.getPlayingStyle('tapping');
console.log('Description:', tapping.description);
console.log('Techniques:', tapping.techniques.join(', '));
console.log('Genres:', tapping.genres.join(', '));
console.log();

// Example 5: Generate fingerpicking pattern
console.log('5. FINGERPICKING PATTERNS');
const travisPattern = guitar.generateFingerpickingPattern('travis', 2);
console.log('Travis Picking Pattern (2 measures):');
console.log('Pattern:', travisPattern.pattern.join('-'));
console.log('Strings:', travisPattern.strings);
console.log('Description:', travisPattern.description);
console.log();

// Example 6: Guitar types
console.log('6. GUITAR TYPES');
const acoustic = guitar.getGuitarType('acoustic');
console.log('\nAcoustic Guitar:');
console.log('Body Shapes:', acoustic.bodyShapes.join(', '));
console.log('Sound:', acoustic.sound);
console.log('Common Uses:', acoustic.uses.join(', '));

const electric = guitar.getGuitarType('electric');
console.log('\nElectric Guitar:');
console.log('Body Shapes:', electric.bodyShapes.join(', '));
console.log('Sound:', electric.sound);
console.log('Common Uses:', electric.uses.join(', '));
console.log();

// Example 7: Tunings
console.log('7. GUITAR TUNINGS');
console.log('Standard Tuning:', guitar.getTuning('standard'));
console.log('Drop D Tuning:', guitar.getTuning('dropD'));
console.log('Open G Tuning:', guitar.getTuning('openG'));
console.log('DADGAD Tuning:', guitar.getTuning('DADGAD'));
console.log();

// Example 8: Scale positions on fretboard
console.log('8. SCALE POSITIONS ON FRETBOARD');
const cMajorScale = theory.getScale('C', 'major');
console.log('C Major Scale notes:', cMajorScale);
const scalePositions = guitar.generateScalePositions(cMajorScale, 'standard');
console.log('Positions on fretboard:');
scalePositions.forEach(stringPos => {
  console.log(`String ${stringPos.string} (${stringPos.openNote}):`);
  stringPos.positions.forEach(pos => {
    console.log(`  Fret ${pos.fret}: ${pos.note}`);
  });
});
console.log();

// Example 9: Practice exercises
console.log('9. PRACTICE EXERCISES');
console.log('\nBeginner Exercises:');
const beginnerEx = guitar.getPracticeExercises('beginner');
beginnerEx.forEach(ex => {
  console.log(`\n${ex.name}:`);
  console.log(`  Description: ${ex.description}`);
  console.log(`  Pattern: ${ex.pattern}`);
  console.log(`  Focus: ${ex.focus}`);
});

console.log('\n\nIntermediate Exercises:');
const intermediateEx = guitar.getPracticeExercises('intermediate');
intermediateEx.forEach(ex => {
  console.log(`\n${ex.name}:`);
  console.log(`  Description: ${ex.description}`);
  console.log(`  Pattern: ${ex.pattern}`);
  console.log(`  Focus: ${ex.focus}`);
});
console.log();

// Example 10: Analyze chord progression difficulty
console.log('10. CHORD PROGRESSION ANALYSIS');
const easyProgression = ['G', 'C', 'D', 'Em'];
const easyAnalysis = guitar.analyzeProgressionDifficulty(easyProgression);
console.log('\nEasy Progression (G-C-D-Em):');
console.log('Overall Level:', easyAnalysis.overallLevel);
console.log('Has Barre Chords:', easyAnalysis.hasBarreChords);
console.log('Recommendations:', easyAnalysis.recommendations);

const hardProgression = ['F', 'Bm', 'C', 'G'];
const hardAnalysis = guitar.analyzeProgressionDifficulty(hardProgression);
console.log('\nHarder Progression (F-Bm-C-G):');
console.log('Overall Level:', hardAnalysis.overallLevel);
console.log('Has Barre Chords:', hardAnalysis.hasBarreChords);
console.log('Recommendations:', hardAnalysis.recommendations);
console.log();

// Example 11: Song with chords and strumming
console.log('11. COMPLETE SONG EXAMPLE');
console.log('\nSong: Simple Folk Song');
console.log('Key: G Major');
console.log('Time Signature: 4/4');
console.log('Tempo: 90 BPM');
console.log('\nChord Progression:');
const songChords = ['G', 'C', 'D', 'G', 'Em', 'C', 'D', 'G'];
songChords.forEach((chord, index) => {
  const chordInfo = guitar.getChordDiagram(chord);
  if (index % 4 === 0) console.log(); // New line every 4 chords
  process.stdout.write(`${chord} `);
});
console.log('\n');

const folkStrum = guitar.getStrummingPattern('folk');
console.log('Strumming Pattern:', folkStrum.name);
console.log(folkStrum.visualization);

console.log('\nSong Structure:');
console.log('Intro: G - C - D - G (x2)');
console.log('Verse: G - Em - C - D (x4)');
console.log('Chorus: G - C - D - G (x2)');
console.log('Bridge: Em - C - D - G');
console.log('Outro: G - C - D - G (slow down)');
console.log();

// Example 12: Create a practice routine
console.log('12. DAILY PRACTICE ROUTINE');
console.log('\n=== Beginner Guitar Practice Routine (30 minutes) ===');
console.log('\n5 min - Warm up:');
console.log('  - Chromatic exercise');
console.log('  - Finger stretches');

console.log('\n10 min - Chord practice:');
console.log('  - Practice these chords: C, G, D, Em, Am');
songChords.forEach(chordName => {
  const chord = guitar.getChordDiagram(chordName);
  if (chord.success) {
    console.log(`\n  ${chordName}:`);
    console.log(`    Fingers: ${chord.frets.join(' ')}`);
    console.log(`    Difficulty: ${chord.difficulty}`);
  }
});

console.log('\n10 min - Strumming patterns:');
console.log('  - Start with basic pattern');
console.log('  - Progress to folk pattern');
console.log('  - Practice switching between patterns');

console.log('\n5 min - Play along:');
console.log('  - Simple song with G-C-D progression');
console.log('  - Focus on smooth chord changes');

console.log('\nRemember: Practice slowly and accurately first, speed comes with time!');
console.log();
