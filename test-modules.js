/**
 * Quick module test to verify all modules load correctly
 */

console.log('Testing module imports...\n');

try {
  const MusicTheory = require('./lib/music-theory');
  console.log('✓ MusicTheory module loaded');

  const WavUtils = require('./lib/wav-utils');
  console.log('✓ WavUtils module loaded');

  const MidiUtils = require('./lib/midi-utils');
  console.log('✓ MidiUtils module loaded');

  const VocalPatterns = require('./lib/vocal-patterns');
  console.log('✓ VocalPatterns module loaded');

  const AudioProcessor = require('./lib/audio-processor');
  console.log('✓ AudioProcessor module loaded');

  const Guitar = require('./lib/guitar');
  console.log('✓ Guitar module loaded');

  const AllModules = require('./lib/index');
  console.log('✓ Main index module loaded');

  console.log('\n=== Quick Functionality Tests ===\n');

  // Test Music Theory
  const theory = new MusicTheory();
  const scale = theory.getScale('C', 'major');
  console.log('Music Theory - C Major Scale:', scale);

  // Test Guitar
  const guitar = new Guitar();
  const chord = guitar.getChordDiagram('C');
  console.log('Guitar - C Chord loaded:', chord.success);

  // Test MIDI
  const midi = new MidiUtils();
  console.log('MIDI - Note C4 to MIDI number:', midi.noteToMidi('C4'));

  // Test WAV
  const wav = new WavUtils();
  const tone = wav.generateTone(440, 0.1);
  console.log('WAV - Generated tone:', tone.fmt.sampleRate, 'Hz');

  // Test Vocal Patterns
  const vocal = new VocalPatterns();
  const contour = vocal.analyzeMelodyContour([60, 62, 64, 65, 67]);
  console.log('Vocal - Melody contour shape:', contour.shape);

  console.log('\n✅ All modules loaded and working correctly!\n');

} catch (error) {
  console.error('❌ Error loading modules:', error.message);
  console.error(error.stack);
  process.exit(1);
}
