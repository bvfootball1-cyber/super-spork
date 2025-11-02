const Tonal = require('tonal');

/**
 * Music Theory Utilities
 * Provides comprehensive music theory functionality including scales, chords,
 * intervals, progressions, and note manipulation
 */

class MusicTheory {
  constructor() {
    // Common chord progressions by key
    this.commonProgressions = {
      pop: ['I', 'V', 'vi', 'IV'],
      jazz: ['ii', 'V', 'I', 'vi'],
      blues: ['I', 'I', 'I', 'I', 'IV', 'IV', 'I', 'I', 'V', 'IV', 'I', 'V'],
      '50s': ['I', 'vi', 'IV', 'V'],
      rock: ['I', 'bVII', 'IV', 'I'],
      EDM: ['vi', 'IV', 'I', 'V']
    };

    // Musical modes
    this.modes = [
      'ionian', 'dorian', 'phrygian', 'lydian',
      'mixolydian', 'aeolian', 'locrian'
    ];

    // Common time signatures
    this.timeSignatures = {
      common: '4/4',
      waltz: '3/4',
      march: '2/4',
      compound: '6/8',
      complex: '7/8'
    };
  }

  /**
   * Get all notes in a scale
   * @param {string} tonic - Root note (e.g., 'C', 'D#', 'Bb')
   * @param {string} scaleType - Scale type (e.g., 'major', 'minor', 'dorian')
   * @returns {Array} Array of notes in the scale
   */
  getScale(tonic, scaleType = 'major') {
    return Tonal.Scale.get(`${tonic} ${scaleType}`).notes;
  }

  /**
   * Get all available scales for a given tonic
   * @param {string} tonic - Root note
   * @returns {Array} Array of scale names
   */
  getAvailableScales(tonic) {
    return Tonal.Scale.names().map(name => ({
      name: name,
      notes: this.getScale(tonic, name)
    }));
  }

  /**
   * Get chord notes
   * @param {string} chordName - Chord name (e.g., 'Cmaj7', 'Am', 'D7')
   * @returns {Object} Chord information including notes
   */
  getChord(chordName) {
    const chord = Tonal.Chord.get(chordName);
    return {
      name: chord.symbol,
      notes: chord.notes,
      intervals: chord.intervals,
      type: chord.aliases[0] || chord.name,
      quality: chord.quality
    };
  }

  /**
   * Get all chords in a key
   * @param {string} key - Key signature (e.g., 'C major', 'A minor')
   * @returns {Array} Array of diatonic chords
   */
  getChordsInKey(key) {
    const scale = Tonal.Scale.get(key);
    const chords = [];

    scale.notes.forEach((note, index) => {
      // Build triads on each scale degree
      const triad = [
        scale.notes[index],
        scale.notes[(index + 2) % scale.notes.length],
        scale.notes[(index + 4) % scale.notes.length]
      ];

      const chordType = this.determineChordType(triad);
      chords.push({
        degree: this.getRomanNumeral(index, chordType),
        root: note,
        chord: `${note}${chordType}`,
        notes: triad
      });
    });

    return chords;
  }

  /**
   * Determine chord type from notes
   * @param {Array} notes - Array of note names
   * @returns {string} Chord type symbol
   */
  determineChordType(notes) {
    const intervals = Tonal.Chord.detect(notes);
    if (intervals.length > 0) {
      const chordName = intervals[0];
      if (chordName.includes('m') && !chordName.includes('maj')) return 'm';
      if (chordName.includes('dim')) return 'dim';
      if (chordName.includes('aug')) return 'aug';
    }
    return '';
  }

  /**
   * Convert scale degree to Roman numeral
   * @param {number} degree - Scale degree (0-6)
   * @param {string} quality - Chord quality ('', 'm', 'dim')
   * @returns {string} Roman numeral notation
   */
  getRomanNumeral(degree, quality) {
    const numerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
    let numeral = numerals[degree];

    if (quality === 'm') numeral = numeral.toLowerCase();
    if (quality === 'dim') numeral = numeral.toLowerCase() + '°';

    return numeral;
  }

  /**
   * Get a chord progression in a specific key
   * @param {string} key - Key signature
   * @param {string} progressionType - Type of progression
   * @returns {Array} Chord progression
   */
  getProgression(key, progressionType = 'pop') {
    const progression = this.commonProgressions[progressionType] || this.commonProgressions.pop;
    const chordsInKey = this.getChordsInKey(key);

    return progression.map(degree => {
      const chord = chordsInKey.find(c => c.degree === degree);
      return chord || { degree, chord: 'Unknown' };
    });
  }

  /**
   * Calculate interval between two notes
   * @param {string} note1 - First note
   * @param {string} note2 - Second note
   * @returns {Object} Interval information
   */
  getInterval(note1, note2) {
    const interval = Tonal.Interval.distance(note1, note2);
    return {
      interval: interval,
      semitones: Tonal.Interval.semitones(interval),
      name: Tonal.Interval.get(interval).name
    };
  }

  /**
   * Transpose a note or notes by an interval
   * @param {string|Array} notes - Note(s) to transpose
   * @param {string} interval - Interval to transpose by (e.g., '3M', 'P5', '-2m')
   * @returns {string|Array} Transposed note(s)
   */
  transpose(notes, interval) {
    if (Array.isArray(notes)) {
      return notes.map(note => Tonal.Note.transpose(note, interval));
    }
    return Tonal.Note.transpose(notes, interval);
  }

  /**
   * Get note frequency in Hz
   * @param {string} note - Note name with octave (e.g., 'A4', 'C3')
   * @returns {number} Frequency in Hz
   */
  getNoteFrequency(note) {
    return Tonal.Note.freq(note);
  }

  /**
   * Get note from frequency
   * @param {number} frequency - Frequency in Hz
   * @returns {string} Closest note name
   */
  getFrequencyNote(frequency) {
    return Tonal.Note.fromFreq(frequency);
  }

  /**
   * Check if notes form a valid chord
   * @param {Array} notes - Array of notes
   * @returns {Array} Possible chord names
   */
  detectChord(notes) {
    return Tonal.Chord.detect(notes);
  }

  /**
   * Get enharmonic equivalent of a note
   * @param {string} note - Note name
   * @returns {string} Enharmonic note
   */
  getEnharmonic(note) {
    return Tonal.Note.enharmonic(note);
  }

  /**
   * Analyze melody for key signature
   * @param {Array} notes - Array of notes in the melody
   * @returns {Object} Analysis results
   */
  analyzeMelody(notes) {
    // Count note occurrences
    const noteCount = {};
    notes.forEach(note => {
      const pitchClass = Tonal.Note.pitchClass(note);
      noteCount[pitchClass] = (noteCount[pitchClass] || 0) + 1;
    });

    // Try to detect key by matching with major and minor scales
    const possibleKeys = [];
    const majorKeys = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'F', 'Bb', 'Eb', 'Ab', 'Db'];

    majorKeys.forEach(tonic => {
      const majorScale = this.getScale(tonic, 'major');
      const minorScale = this.getScale(tonic, 'minor');

      let majorMatch = 0;
      let minorMatch = 0;

      notes.forEach(note => {
        const pitchClass = Tonal.Note.pitchClass(note);
        if (majorScale.includes(pitchClass)) majorMatch++;
        if (minorScale.includes(pitchClass)) minorMatch++;
      });

      possibleKeys.push({
        key: `${tonic} major`,
        matchPercentage: (majorMatch / notes.length) * 100
      });

      possibleKeys.push({
        key: `${tonic} minor`,
        matchPercentage: (minorMatch / notes.length) * 100
      });
    });

    possibleKeys.sort((a, b) => b.matchPercentage - a.matchPercentage);

    return {
      likelyKey: possibleKeys[0].key,
      topKeys: possibleKeys.slice(0, 5),
      noteDistribution: noteCount
    };
  }

  /**
   * Generate a melodic pattern
   * @param {string} key - Key signature
   * @param {number} length - Number of notes
   * @param {string} pattern - Pattern type ('ascending', 'descending', 'random', 'arpeggio')
   * @returns {Array} Array of notes
   */
  generateMelody(key, length = 8, pattern = 'random') {
    const scale = this.getScale(key.split(' ')[0], key.split(' ')[1] || 'major');
    const melody = [];

    switch(pattern) {
      case 'ascending':
        for (let i = 0; i < length; i++) {
          melody.push(scale[i % scale.length]);
        }
        break;

      case 'descending':
        for (let i = 0; i < length; i++) {
          melody.push(scale[scale.length - 1 - (i % scale.length)]);
        }
        break;

      case 'arpeggio':
        // Use chord tones (1, 3, 5)
        for (let i = 0; i < length; i++) {
          const degrees = [0, 2, 4];
          melody.push(scale[degrees[i % degrees.length]]);
        }
        break;

      case 'random':
      default:
        for (let i = 0; i < length; i++) {
          melody.push(scale[Math.floor(Math.random() * scale.length)]);
        }
        break;
    }

    return melody;
  }

  /**
   * Get voice leading between two chords
   * @param {Array} chord1 - First chord notes
   * @param {Array} chord2 - Second chord notes
   * @returns {Object} Voice leading information
   */
  getVoiceLeading(chord1, chord2) {
    const movements = [];

    for (let i = 0; i < Math.max(chord1.length, chord2.length); i++) {
      if (chord1[i] && chord2[i]) {
        const interval = this.getInterval(chord1[i], chord2[i]);
        movements.push({
          from: chord1[i],
          to: chord2[i],
          interval: interval.interval,
          semitones: interval.semitones
        });
      }
    }

    const totalMovement = movements.reduce((sum, m) => sum + Math.abs(m.semitones), 0);

    return {
      movements,
      totalMovement,
      smoothness: totalMovement < chord1.length * 2 ? 'smooth' : 'disjunct'
    };
  }
}

module.exports = MusicTheory;
