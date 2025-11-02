/**
 * Guitar Utilities
 * Comprehensive guitar module including strumming patterns, playing styles,
 * chord diagrams, fingerings, tunings, and guitar types
 */

class Guitar {
  constructor() {
    // Standard tuning (from low to high)
    this.standardTuning = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'];

    // Alternative tunings
    this.tunings = {
      standard: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
      dropD: ['D2', 'A2', 'D3', 'G3', 'B3', 'E4'],
      dropC: ['C2', 'G2', 'C3', 'F3', 'A3', 'D4'],
      openG: ['D2', 'G2', 'D3', 'G3', 'B3', 'D4'],
      openD: ['D2', 'A2', 'D3', 'F#3', 'A3', 'D4'],
      openE: ['E2', 'B2', 'E3', 'G#3', 'B3', 'E4'],
      DADGAD: ['D2', 'A2', 'D3', 'G3', 'A3', 'D4'],
      halfStepDown: ['Eb2', 'Ab2', 'Db3', 'Gb3', 'Bb3', 'Eb4'],
      fullStepDown: ['D2', 'G2', 'C3', 'F3', 'A3', 'D4']
    };

    // Guitar types and their characteristics
    this.guitarTypes = {
      acoustic: {
        bodyShapes: ['dreadnought', 'concert', 'auditorium', 'jumbo', 'parlor', 'travel'],
        sound: 'Bright, resonant, acoustic tone with natural sustain',
        strings: 'Steel strings',
        uses: ['Folk', 'Country', 'Singer-songwriter', 'Acoustic rock']
      },
      classical: {
        bodyShapes: ['traditional', 'flamenco'],
        sound: 'Warm, mellow, with rich overtones',
        strings: 'Nylon strings',
        uses: ['Classical music', 'Flamenco', 'Bossa nova', 'Latin']
      },
      electric: {
        bodyShapes: ['stratocaster', 'telecaster', 'les paul', 'sg', 'flying v', 'explorer', 'superstrat'],
        sound: 'Versatile, can be clean or distorted, sustained',
        strings: 'Light gauge steel strings',
        uses: ['Rock', 'Blues', 'Jazz', 'Metal', 'Pop']
      },
      'semi-hollow': {
        bodyShapes: ['es-335', 'thinline', 'semi-acoustic'],
        sound: 'Warm with some acoustic resonance, good sustain',
        strings: 'Light gauge steel strings',
        uses: ['Jazz', 'Blues', 'Rock', 'Indie']
      },
      'twelve-string': {
        bodyShapes: ['dreadnought', 'jumbo'],
        sound: 'Rich, chorused, shimmering tone',
        strings: '6 pairs of steel strings',
        uses: ['Folk', 'Rock', 'Country', 'Jangle pop']
      }
    };

    // Strumming patterns (D=down, U=up, x=mute)
    this.strummingPatterns = {
      basic: {
        pattern: ['D', 'D', 'U', 'U', 'D', 'U'],
        name: 'Basic Strumming Pattern',
        timeSignature: '4/4',
        difficulty: 'beginner',
        description: 'Most common strumming pattern'
      },
      folk: {
        pattern: ['D', 'D', 'U', 'D', 'U', 'D', 'U'],
        name: 'Folk Strum',
        timeSignature: '4/4',
        difficulty: 'beginner',
        description: 'Classic folk guitar pattern'
      },
      country: {
        pattern: ['D', 'x', 'D', 'U', 'x', 'U', 'D', 'U'],
        name: 'Country Strum',
        timeSignature: '4/4',
        difficulty: 'intermediate',
        description: 'Syncopated country pattern with palm muting'
      },
      reggae: {
        pattern: ['x', 'U', 'x', 'U'],
        name: 'Reggae Skank',
        timeSignature: '4/4',
        difficulty: 'intermediate',
        description: 'Off-beat upstrokes characteristic of reggae'
      },
      rock: {
        pattern: ['D', 'x', 'D', 'U', 'x', 'D', 'x', 'D', 'U'],
        name: 'Rock Strum',
        timeSignature: '4/4',
        difficulty: 'intermediate',
        description: 'Aggressive rock strumming with palm muting'
      },
      waltz: {
        pattern: ['D', 'U', 'U'],
        name: 'Waltz Strum',
        timeSignature: '3/4',
        difficulty: 'beginner',
        description: 'Simple 3/4 time pattern'
      },
      latin: {
        pattern: ['D', 'U', 'D', 'U', 'D', 'x', 'U'],
        name: 'Latin Strum',
        timeSignature: '4/4',
        difficulty: 'intermediate',
        description: 'Syncopated Latin rhythm'
      },
      ballad: {
        pattern: ['D', 'U', 'x', 'U', 'D', 'U'],
        name: 'Ballad Strum',
        timeSignature: '4/4',
        difficulty: 'beginner',
        description: 'Gentle pattern for slow songs'
      }
    };

    // Playing techniques and styles
    this.playingStyles = {
      fingerpicking: {
        description: 'Using individual fingers to pluck strings',
        patterns: {
          travis: {
            name: 'Travis Picking',
            difficulty: 'intermediate',
            pattern: 'Alternating bass with melody on higher strings',
            example: 'T-1-2-3-T-1-2-3 (T=thumb, 1,2,3=index,middle,ring)'
          },
          classical: {
            name: 'Classical Fingerstyle',
            difficulty: 'advanced',
            pattern: 'p-i-m-a pattern (thumb, index, middle, ring)',
            example: 'Thumb on bass, fingers on treble strings'
          },
          folk: {
            name: 'Folk Fingerpicking',
            difficulty: 'beginner',
            pattern: 'Simple alternating thumb with finger plucks',
            example: 'T-1-T-2-T-1-T-2'
          }
        },
        genres: ['Folk', 'Classical', 'Country', 'Blues', 'Indie']
      },
      flatpicking: {
        description: 'Using a flat pick for lead and rhythm',
        techniques: ['Alternate picking', 'Economy picking', 'Sweep picking', 'Hybrid picking'],
        genres: ['Bluegrass', 'Country', 'Rock', 'Metal']
      },
      slapping: {
        description: 'Percussive technique hitting strings against fretboard',
        techniques: ['Thumb slap', 'String pop', 'Fretboard tap'],
        genres: ['Funk', 'Modern acoustic', 'Percussive fingerstyle']
      },
      tapping: {
        description: 'Using both hands to tap on fretboard',
        techniques: ['Two-hand tapping', 'One-hand tapping', 'Slap harmonics'],
        genres: ['Rock', 'Metal', 'Progressive', 'Modern fingerstyle']
      },
      slide: {
        description: 'Using a slide (bottleneck) on strings',
        techniques: ['Open tuning slide', 'Standard tuning slide', 'Dobro style'],
        genres: ['Blues', 'Country', 'Rock', 'Hawaiian']
      },
      tremolo: {
        description: 'Rapid repetition of a single note',
        techniques: ['Classical tremolo (p-a-m-i)', 'Flamenco tremolo', 'Pick tremolo'],
        genres: ['Classical', 'Flamenco', 'Surf rock']
      },
      rasgueado: {
        description: 'Flamenco strumming technique with individual finger flicks',
        techniques: ['Four-finger rasgueado', 'Three-finger rasgueado', 'Abanico'],
        genres: ['Flamenco', 'Spanish classical']
      }
    };

    // Common chord shapes (basic open chords)
    this.chordLibrary = {
      'C': {
        fingers: [null, 3, 2, 0, 1, 0],
        frets: ['x', 3, 2, 0, 1, 0],
        difficulty: 'beginner',
        type: 'major',
        notes: ['C', 'E', 'G', 'C', 'E']
      },
      'D': {
        fingers: [null, null, 0, 2, 3, 2],
        frets: ['x', 'x', 0, 2, 3, 2],
        difficulty: 'beginner',
        type: 'major',
        notes: ['D', 'A', 'D', 'F#']
      },
      'E': {
        fingers: [0, 2, 2, 1, 0, 0],
        frets: [0, 2, 2, 1, 0, 0],
        difficulty: 'beginner',
        type: 'major',
        notes: ['E', 'B', 'E', 'G#', 'B', 'E']
      },
      'G': {
        fingers: [3, 2, 0, 0, 0, 3],
        frets: [3, 2, 0, 0, 0, 3],
        difficulty: 'beginner',
        type: 'major',
        notes: ['G', 'B', 'D', 'G', 'B', 'G']
      },
      'A': {
        fingers: [null, 0, 2, 2, 2, 0],
        frets: ['x', 0, 2, 2, 2, 0],
        difficulty: 'beginner',
        type: 'major',
        notes: ['A', 'E', 'A', 'C#', 'E']
      },
      'Am': {
        fingers: [null, 0, 2, 2, 1, 0],
        frets: ['x', 0, 2, 2, 1, 0],
        difficulty: 'beginner',
        type: 'minor',
        notes: ['A', 'E', 'A', 'C', 'E']
      },
      'Em': {
        fingers: [0, 2, 2, 0, 0, 0],
        frets: [0, 2, 2, 0, 0, 0],
        difficulty: 'beginner',
        type: 'minor',
        notes: ['E', 'B', 'E', 'G', 'B', 'E']
      },
      'Dm': {
        fingers: [null, null, 0, 2, 3, 1],
        frets: ['x', 'x', 0, 2, 3, 1],
        difficulty: 'beginner',
        type: 'minor',
        notes: ['D', 'A', 'D', 'F']
      },
      'F': {
        fingers: [1, 3, 3, 2, 1, 1],
        frets: [1, 3, 3, 2, 1, 1],
        difficulty: 'intermediate',
        type: 'major',
        barre: 1,
        notes: ['F', 'A', 'C', 'F', 'A', 'F']
      },
      'Bm': {
        fingers: [null, 2, 4, 4, 3, 2],
        frets: ['x', 2, 4, 4, 3, 2],
        difficulty: 'intermediate',
        type: 'minor',
        barre: 2,
        notes: ['B', 'F#', 'B', 'D', 'F#']
      },
      'G7': {
        fingers: [3, 2, 0, 0, 0, 1],
        frets: [3, 2, 0, 0, 0, 1],
        difficulty: 'beginner',
        type: 'dominant7',
        notes: ['G', 'B', 'D', 'G', 'B', 'F']
      },
      'C7': {
        fingers: [null, 3, 2, 3, 1, 0],
        frets: ['x', 3, 2, 3, 1, 0],
        difficulty: 'intermediate',
        type: 'dominant7',
        notes: ['C', 'E', 'Bb', 'C', 'E']
      }
    };

    // Barre chord shapes (moveable)
    this.barreChordShapes = {
      majorE: {
        shape: [1, 3, 3, 2, 1, 1],
        root: 6,
        description: 'E-shape major barre chord'
      },
      minorE: {
        shape: [1, 3, 3, 1, 1, 1],
        root: 6,
        description: 'E-shape minor barre chord'
      },
      majorA: {
        shape: ['x', 1, 3, 3, 3, 1],
        root: 5,
        description: 'A-shape major barre chord'
      },
      minorA: {
        shape: ['x', 1, 3, 3, 2, 1],
        root: 5,
        description: 'A-shape minor barre chord'
      }
    };
  }

  /**
   * Get chord diagram
   * @param {string} chordName - Chord name
   * @returns {Object} Chord diagram data
   */
  getChordDiagram(chordName) {
    const chord = this.chordLibrary[chordName];

    if (!chord) {
      return {
        success: false,
        message: `Chord ${chordName} not found in library`
      };
    }

    return {
      success: true,
      chord: chordName,
      ...chord,
      diagram: this.generateChordDiagram(chord)
    };
  }

  /**
   * Generate ASCII chord diagram
   * @param {Object} chord - Chord object
   * @returns {string} ASCII chord diagram
   */
  generateChordDiagram(chord) {
    const strings = 6;
    const frets = 5;
    let diagram = '\n';

    // Add string names
    diagram += 'E A D G B E\n';

    // Top border
    diagram += '─┬─┬─┬─┬─┬─\n';

    // Generate fret positions
    for (let fret = 0; fret < frets; fret++) {
      let line = ' ';

      for (let string = 0; string < strings; string++) {
        const fretValue = chord.frets[string];

        if (fretValue === 'x') {
          line += 'X ';
        } else if (fretValue === 0 && fret === 0) {
          line += 'O ';
        } else if (parseInt(fretValue) === fret + 1) {
          line += '● ';
        } else {
          line += '│ ';
        }
      }

      diagram += line + ` (${fret + 1})\n`;
    }

    return diagram;
  }

  /**
   * Get strumming pattern
   * @param {string} patternName - Pattern name
   * @returns {Object} Strumming pattern data
   */
  getStrummingPattern(patternName) {
    const pattern = this.strummingPatterns[patternName];

    if (!pattern) {
      return {
        success: false,
        message: `Pattern ${patternName} not found`
      };
    }

    return {
      success: true,
      name: patternName,
      ...pattern,
      visualization: this.visualizeStrumPattern(pattern.pattern)
    };
  }

  /**
   * Visualize strumming pattern
   * @param {Array} pattern - Array of strums (D, U, x)
   * @returns {string} Visual representation
   */
  visualizeStrumPattern(pattern) {
    let visual = '\n';
    visual += pattern.map((strum, i) => {
      if (strum === 'D') return '↓';
      if (strum === 'U') return '↑';
      if (strum === 'x') return '×';
      return ' ';
    }).join(' ');
    visual += '\n';
    visual += pattern.map((_, i) => (i + 1).toString()).join(' ');
    return visual;
  }

  /**
   * Get all strumming patterns
   * @returns {Object} All strumming patterns
   */
  getAllStrummingPatterns() {
    return this.strummingPatterns;
  }

  /**
   * Get playing style information
   * @param {string} styleName - Style name
   * @returns {Object} Playing style information
   */
  getPlayingStyle(styleName) {
    return this.playingStyles[styleName] || null;
  }

  /**
   * Get all playing styles
   * @returns {Object} All playing styles
   */
  getAllPlayingStyles() {
    return this.playingStyles;
  }

  /**
   * Get guitar type information
   * @param {string} typeName - Guitar type
   * @returns {Object} Guitar type information
   */
  getGuitarType(typeName) {
    return this.guitarTypes[typeName] || null;
  }

  /**
   * Get all guitar types
   * @returns {Object} All guitar types
   */
  getAllGuitarTypes() {
    return this.guitarTypes;
  }

  /**
   * Get tuning
   * @param {string} tuningName - Tuning name
   * @returns {Array} Tuning notes
   */
  getTuning(tuningName) {
    return this.tunings[tuningName] || this.tunings.standard;
  }

  /**
   * Generate fingerpicking pattern
   * @param {string} patternType - Pattern type
   * @param {number} measures - Number of measures
   * @returns {Object} Fingerpicking pattern
   */
  generateFingerpickingPattern(patternType = 'travis', measures = 4) {
    const patterns = {
      travis: {
        pattern: ['T', '1', '2', '3', 'T', '1', '2', '3'],
        description: 'Alternating thumb bass with fingers',
        strings: [6, 3, 2, 1, 5, 3, 2, 1]
      },
      classical: {
        pattern: ['p', 'i', 'm', 'a', 'p', 'i', 'm', 'a'],
        description: 'Classical arpeggio pattern',
        strings: [6, 3, 2, 1, 5, 3, 2, 1]
      },
      folk: {
        pattern: ['T', '1', 'T', '2', 'T', '1', 'T', '2'],
        description: 'Simple folk pattern',
        strings: [6, 3, 5, 2, 6, 3, 5, 2]
      }
    };

    const selected = patterns[patternType] || patterns.travis;
    const fullPattern = [];

    for (let i = 0; i < measures; i++) {
      fullPattern.push(...selected.pattern);
    }

    return {
      type: patternType,
      pattern: fullPattern,
      strings: Array(measures).fill(selected.strings).flat(),
      description: selected.description
    };
  }

  /**
   * Calculate fret position for note
   * @param {string} note - Note name
   * @param {string} stringNote - Open string note
   * @returns {number} Fret number
   */
  calculateFretPosition(note, stringNote) {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    // Extract note names (remove octave)
    const targetNote = note.replace(/\d+/, '');
    const openNote = stringNote.replace(/\d+/, '');

    const targetIndex = notes.indexOf(targetNote);
    const openIndex = notes.indexOf(openNote);

    if (targetIndex === -1 || openIndex === -1) {
      return null;
    }

    let fret = targetIndex - openIndex;
    if (fret < 0) fret += 12;

    return fret;
  }

  /**
   * Generate scale fingering positions
   * @param {Array} scaleNotes - Array of scale notes
   * @param {string} tuning - Tuning name
   * @returns {Array} Scale positions on fretboard
   */
  generateScalePositions(scaleNotes, tuning = 'standard') {
    const tuningNotes = this.getTuning(tuning);
    const positions = [];

    tuningNotes.forEach((stringNote, stringIndex) => {
      const stringPositions = [];

      scaleNotes.forEach(note => {
        const fret = this.calculateFretPosition(note, stringNote);
        if (fret !== null && fret <= 12) {
          stringPositions.push({
            string: stringIndex + 1,
            fret: fret,
            note: note
          });
        }
      });

      if (stringPositions.length > 0) {
        positions.push({
          string: stringIndex + 1,
          openNote: stringNote,
          positions: stringPositions
        });
      }
    });

    return positions;
  }

  /**
   * Get practice exercises
   * @param {string} level - Skill level (beginner, intermediate, advanced)
   * @returns {Array} Practice exercises
   */
  getPracticeExercises(level = 'beginner') {
    const exercises = {
      beginner: [
        {
          name: 'Chromatic Exercise',
          description: 'Play each fret sequentially on each string',
          pattern: '1-2-3-4 on each string',
          focus: 'Finger independence and strength'
        },
        {
          name: 'Basic Chord Changes',
          description: 'Practice switching between G, C, D, and Em',
          pattern: 'G-C-D-G, then G-Em-C-D',
          focus: 'Smooth chord transitions'
        },
        {
          name: 'Simple Strumming',
          description: 'Practice basic down-up strumming pattern',
          pattern: 'D-D-U-U-D-U',
          focus: 'Rhythm and timing'
        }
      ],
      intermediate: [
        {
          name: 'Spider Exercise',
          description: 'Index finger stays down while others move',
          pattern: '1-2-1-3-1-4, then 2-3-2-4, then 3-4',
          focus: 'Finger independence'
        },
        {
          name: 'Barre Chords',
          description: 'Practice F and Bm barre chords',
          pattern: 'C-F-G-Am progression',
          focus: 'Barre chord strength and clarity'
        },
        {
          name: 'Travis Picking',
          description: 'Alternating bass fingerpicking',
          pattern: 'Thumb alternates between bass strings while fingers pick melody',
          focus: 'Independence between thumb and fingers'
        }
      ],
      advanced: [
        {
          name: 'Two-Hand Tapping',
          description: 'Tap frets with both hands',
          pattern: 'Tap arpeggios across the fretboard',
          focus: 'Advanced technique and coordination'
        },
        {
          name: 'Jazz Chord Voicings',
          description: 'Practice complex jazz chord shapes',
          pattern: 'ii-V-I progressions with extensions',
          focus: 'Advanced harmony and voicings'
        },
        {
          name: 'Sweep Picking Arpeggios',
          description: 'Sweep pick through arpeggio shapes',
          pattern: 'Major and minor arpeggio sweeps',
          focus: 'Speed and accuracy'
        }
      ]
    };

    return exercises[level] || exercises.beginner;
  }

  /**
   * Analyze chord progression difficulty
   * @param {Array} chords - Array of chord names
   * @returns {Object} Difficulty analysis
   */
  analyzeProgressionDifficulty(chords) {
    let totalDifficulty = 0;
    let hasBarreChords = false;
    const chordData = [];

    chords.forEach(chordName => {
      const chord = this.chordLibrary[chordName];

      if (chord) {
        chordData.push({
          chord: chordName,
          difficulty: chord.difficulty
        });

        if (chord.difficulty === 'beginner') totalDifficulty += 1;
        if (chord.difficulty === 'intermediate') totalDifficulty += 2;
        if (chord.difficulty === 'advanced') totalDifficulty += 3;
        if (chord.barre) hasBarreChords = true;
      }
    });

    const avgDifficulty = totalDifficulty / chords.length;

    let overallLevel;
    if (avgDifficulty <= 1.5) overallLevel = 'beginner';
    else if (avgDifficulty <= 2.5) overallLevel = 'intermediate';
    else overallLevel = 'advanced';

    return {
      chords: chordData,
      overallLevel: overallLevel,
      hasBarreChords: hasBarreChords,
      averageDifficulty: avgDifficulty,
      recommendations: hasBarreChords
        ? ['Practice barre chords separately', 'Ensure proper thumb placement']
        : ['Focus on smooth transitions', 'Practice with a metronome']
    };
  }
}

module.exports = Guitar;
