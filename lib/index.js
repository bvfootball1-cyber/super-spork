/**
 * Audio and Music Theory Toolkit
 * Main entry point for all music-related utilities
 */

const MusicTheory = require('./music-theory');
const WavUtils = require('./wav-utils');
const MidiUtils = require('./midi-utils');
const VocalPatterns = require('./vocal-patterns');
const AudioProcessor = require('./audio-processor');
const Guitar = require('./guitar');

module.exports = {
  MusicTheory,
  WavUtils,
  MidiUtils,
  VocalPatterns,
  AudioProcessor,
  Guitar
};
