const WavUtils = require('../lib/wav-utils');
const path = require('path');

// Initialize WAV utilities
const wavUtils = new WavUtils();

console.log('=== WAV FILE EXAMPLES ===\n');

// Example 1: Create a simple tone
console.log('1. GENERATE TONE');
const tone = wavUtils.generateTone(440, 2, {
  sampleRate: 44100,
  bitDepth: 16,
  numChannels: 1,
  amplitude: 0.5
});
console.log('Generated 440 Hz tone for 2 seconds');
const toneResult = wavUtils.writeWav(tone, path.join(__dirname, 'output/tone_440hz.wav'));
console.log('Result:', toneResult);
console.log();

// Example 2: Generate silence
console.log('2. GENERATE SILENCE');
const silence = wavUtils.generateSilence(3, {
  sampleRate: 44100,
  bitDepth: 16,
  numChannels: 2
});
console.log('Generated 3 seconds of stereo silence');
const silenceResult = wavUtils.writeWav(silence, path.join(__dirname, 'output/silence_3s.wav'));
console.log('Result:', silenceResult);
console.log();

// Example 3: Create multiple tones and mix them (chord)
console.log('3. CREATE CHORD BY MIXING TONES');
const noteC = wavUtils.generateTone(261.63, 2); // C4
const noteE = wavUtils.generateTone(329.63, 2); // E4
const noteG = wavUtils.generateTone(392.00, 2); // G4

const chord = wavUtils.mix([noteC, noteE, noteG], [0.33, 0.33, 0.33]);
console.log('Mixed C-E-G chord');
const chordResult = wavUtils.writeWav(chord, path.join(__dirname, 'output/c_major_chord.wav'));
console.log('Result:', chordResult);
console.log();

// Example 4: Create a melody by concatenating tones
console.log('4. CREATE MELODY BY CONCATENATING NOTES');
const c4 = wavUtils.generateTone(261.63, 0.5);
const d4 = wavUtils.generateTone(293.66, 0.5);
const e4 = wavUtils.generateTone(329.63, 0.5);
const f4 = wavUtils.generateTone(349.23, 0.5);
const g4 = wavUtils.generateTone(392.00, 1.0);

const melody = wavUtils.concatenate([c4, d4, e4, f4, g4]);
console.log('Created C-D-E-F-G melody');
const melodyResult = wavUtils.writeWav(melody, path.join(__dirname, 'output/melody.wav'));
console.log('Result:', melodyResult);
console.log();

// Example 5: Apply fade in and fade out
console.log('5. APPLY FADE EFFECTS');
const longTone = wavUtils.generateTone(440, 5);
const fadeIn = wavUtils.fadeIn(longTone, 1); // 1 second fade in
const fadeInOut = wavUtils.fadeOut(fadeIn, 1); // 1 second fade out
console.log('Applied fade in (1s) and fade out (1s)');
const fadeResult = wavUtils.writeWav(fadeInOut, path.join(__dirname, 'output/tone_with_fades.wav'));
console.log('Result:', fadeResult);
console.log();

// Example 6: Change volume
console.log('6. VOLUME ADJUSTMENT');
const normalTone = wavUtils.generateTone(440, 2);
const louderTone = wavUtils.changeVolume(normalTone, 1.5); // 50% louder
const quieterTone = wavUtils.changeVolume(normalTone, 0.5); // 50% quieter
console.log('Created tones with different volumes');
console.log();

// Example 7: Reverse audio
console.log('7. REVERSE AUDIO');
const reversedMelody = wavUtils.reverse(melody);
console.log('Reversed the melody');
const reverseResult = wavUtils.writeWav(reversedMelody, path.join(__dirname, 'output/melody_reversed.wav'));
console.log('Result:', reverseResult);
console.log();

// Example 8: Analyze audio
console.log('8. AUDIO ANALYSIS');
const analysis = wavUtils.analyze(chord);
console.log('Chord analysis:', analysis);
console.log();

// Example 9: Format conversion
console.log('9. FORMAT CONVERSION');
const mono16bit = wavUtils.generateTone(440, 1, { numChannels: 1, bitDepth: 16 });
const stereo24bit = wavUtils.changeBitDepth(
  wavUtils.convertChannels(mono16bit, 2),
  '24'
);
console.log('Converted mono 16-bit to stereo 24-bit');
const convertResult = wavUtils.writeWav(stereo24bit, path.join(__dirname, 'output/converted_stereo_24bit.wav'));
console.log('Result:', convertResult);
console.log();

// Example 10: Create rhythm pattern
console.log('10. CREATE RHYTHM PATTERN');
const kick = wavUtils.generateTone(60, 0.2, { amplitude: 0.8 }); // Low frequency for kick
const snare = wavUtils.generateTone(200, 0.1, { amplitude: 0.6 }); // Mid frequency for snare
const hihat = wavUtils.generateTone(8000, 0.05, { amplitude: 0.4 }); // High frequency for hi-hat

const beat = wavUtils.concatenate([
  kick,
  wavUtils.generateSilence(0.3),
  snare,
  wavUtils.generateSilence(0.3),
  kick,
  wavUtils.generateSilence(0.3),
  snare,
  wavUtils.generateSilence(0.3)
]);

console.log('Created simple beat pattern');
const beatResult = wavUtils.writeWav(beat, path.join(__dirname, 'output/beat_pattern.wav'));
console.log('Result:', beatResult);
console.log();

console.log('All WAV examples completed!');
console.log('Check the examples/output/ directory for generated files.');
