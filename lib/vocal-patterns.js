/**
 * Vocal Pattern Analysis
 * Provides utilities for analyzing and working with vocal patterns,
 * including melody contours, phrasing, rhythm patterns, and vocal techniques
 */

class VocalPatterns {
  constructor() {
    // Common vocal ranges (in Hz)
    this.vocalRanges = {
      soprano: { min: 261.63, max: 1046.50, notes: 'C4-C6' },
      mezzosoprano: { min: 220.00, max: 880.00, notes: 'A3-A5' },
      alto: { min: 174.61, max: 698.46, notes: 'F3-F5' },
      tenor: { min: 130.81, max: 523.25, notes: 'C3-C5' },
      baritone: { min: 110.00, max: 392.00, notes: 'A2-G4' },
      bass: { min: 82.41, max: 329.63, notes: 'E2-E4' }
    };

    // Vocal techniques
    this.techniques = {
      vibrato: 'Oscillation of pitch',
      melisma: 'Multiple notes on one syllable',
      portamento: 'Smooth glide between notes',
      staccato: 'Short, detached notes',
      legato: 'Smooth, connected notes',
      falsetto: 'High, light vocal register',
      belt: 'Powerful, chest-dominant sound',
      whistle: 'Highest vocal register',
      growl: 'Gritty, distorted sound',
      runs: 'Rapid scale passages',
      riff: 'Short melodic phrase'
    };

    // Common phrasing patterns
    this.phrasingPatterns = {
      'AABA': 'Verse-Verse-Bridge-Verse',
      'ABAB': 'Verse-Chorus-Verse-Chorus',
      'AAA': 'Strophic (all verses same)',
      'ABABCB': 'Verse-Chorus-Verse-Chorus-Bridge-Chorus'
    };

    // Rhythm syllable patterns
    this.rhythmPatterns = {
      iambic: [1, 2], // weak-STRONG
      trochaic: [2, 1], // STRONG-weak
      dactylic: [3, 1, 1], // STRONG-weak-weak
      anapestic: [1, 1, 3], // weak-weak-STRONG
      spondaic: [2, 2] // STRONG-STRONG
    };
  }

  /**
   * Analyze melody contour
   * @param {Array} notes - Array of note frequencies or MIDI numbers
   * @returns {Object} Contour analysis
   */
  analyzeMelodyContour(notes) {
    if (notes.length < 2) {
      return { error: 'Need at least 2 notes for contour analysis' };
    }

    const movements = [];
    let ascendingCount = 0;
    let descendingCount = 0;
    let staticCount = 0;

    for (let i = 1; i < notes.length; i++) {
      const diff = notes[i] - notes[i - 1];

      if (diff > 0) {
        movements.push('ascending');
        ascendingCount++;
      } else if (diff < 0) {
        movements.push('descending');
        descendingCount++;
      } else {
        movements.push('static');
        staticCount++;
      }
    }

    // Analyze overall shape
    let shape;
    if (ascendingCount > descendingCount * 2) {
      shape = 'ascending';
    } else if (descendingCount > ascendingCount * 2) {
      shape = 'descending';
    } else if (notes[0] < notes[Math.floor(notes.length / 2)] &&
               notes[Math.floor(notes.length / 2)] > notes[notes.length - 1]) {
      shape = 'arch';
    } else if (notes[0] > notes[Math.floor(notes.length / 2)] &&
               notes[Math.floor(notes.length / 2)] < notes[notes.length - 1]) {
      shape = 'valley';
    } else {
      shape = 'undulating';
    }

    // Calculate range
    const range = Math.max(...notes) - Math.min(...notes);

    return {
      shape: shape,
      movements: movements,
      statistics: {
        ascending: ascendingCount,
        descending: descendingCount,
        static: staticCount,
        totalMovements: movements.length
      },
      range: range,
      highest: Math.max(...notes),
      lowest: Math.min(...notes),
      averagePitch: notes.reduce((sum, n) => sum + n, 0) / notes.length
    };
  }

  /**
   * Detect vocal range from frequency data
   * @param {Array} frequencies - Array of frequencies in Hz
   * @returns {Object} Vocal range classification
   */
  detectVocalRange(frequencies) {
    const min = Math.min(...frequencies);
    const max = Math.max(...frequencies);

    const matches = [];

    Object.entries(this.vocalRanges).forEach(([type, range]) => {
      // Check overlap
      const overlapMin = Math.max(min, range.min);
      const overlapMax = Math.min(max, range.max);

      if (overlapMin < overlapMax) {
        const overlap = overlapMax - overlapMin;
        const totalRange = max - min;
        const matchPercentage = (overlap / totalRange) * 100;

        matches.push({
          type: type,
          matchPercentage: matchPercentage,
          range: range
        });
      }
    });

    matches.sort((a, b) => b.matchPercentage - a.matchPercentage);

    return {
      likelyRange: matches[0]?.type || 'unknown',
      minFrequency: min,
      maxFrequency: max,
      rangeInHz: max - min,
      allMatches: matches
    };
  }

  /**
   * Analyze phrasing structure
   * @param {Array} phrases - Array of phrase objects with durations
   * @returns {Object} Phrasing analysis
   */
  analyzePhrasing(phrases) {
    // Analyze phrase lengths
    const lengths = phrases.map(p => p.duration || p.length);
    const avgLength = lengths.reduce((sum, l) => sum + l, 0) / lengths.length;

    // Detect pattern
    const pattern = phrases.map(p => p.type || 'A');
    const patternString = pattern.join('');

    // Check for common patterns
    let structureType = 'custom';
    Object.entries(this.phrasingPatterns).forEach(([type, description]) => {
      if (patternString.includes(type)) {
        structureType = type;
      }
    });

    // Analyze breath points (rests between phrases)
    const breathDurations = [];
    for (let i = 0; i < phrases.length - 1; i++) {
      if (phrases[i].endTime && phrases[i + 1].startTime) {
        breathDurations.push(phrases[i + 1].startTime - phrases[i].endTime);
      }
    }

    return {
      numberOfPhrases: phrases.length,
      pattern: patternString,
      structureType: structureType,
      averagePhraseLength: avgLength,
      phraseLengths: lengths,
      breathPoints: breathDurations.length,
      averageBreathDuration: breathDurations.length > 0
        ? breathDurations.reduce((sum, d) => sum + d, 0) / breathDurations.length
        : 0
    };
  }

  /**
   * Analyze rhythm pattern
   * @param {Array} durations - Array of note durations
   * @returns {Object} Rhythm analysis
   */
  analyzeRhythm(durations) {
    // Calculate total duration
    const totalDuration = durations.reduce((sum, d) => sum + d, 0);

    // Find most common duration (beat)
    const durationCounts = {};
    durations.forEach(d => {
      durationCounts[d] = (durationCounts[d] || 0) + 1;
    });

    const sortedDurations = Object.entries(durationCounts)
      .sort((a, b) => b[1] - a[1]);

    const commonDuration = parseFloat(sortedDurations[0][0]);

    // Detect syncopation (off-beat emphasis)
    const syncopationScore = this.detectSyncopation(durations);

    // Calculate rhythmic complexity
    const uniqueDurations = Object.keys(durationCounts).length;
    const complexity = uniqueDurations / durations.length;

    return {
      totalDuration: totalDuration,
      numberOfNotes: durations.length,
      mostCommonDuration: commonDuration,
      uniqueDurations: uniqueDurations,
      complexity: complexity,
      syncopationLevel: syncopationScore,
      durationDistribution: durationCounts
    };
  }

  /**
   * Detect syncopation in rhythm
   * @param {Array} durations - Array of note durations
   * @returns {number} Syncopation score (0-1)
   */
  detectSyncopation(durations) {
    // Simple syncopation detection based on duration variance
    const avg = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    const variance = durations.reduce((sum, d) => sum + Math.pow(d - avg, 2), 0) / durations.length;

    // Normalize to 0-1 scale (higher variance = more syncopation)
    return Math.min(variance / avg, 1);
  }

  /**
   * Analyze melisma (multiple notes per syllable)
   * @param {Array} syllables - Array of syllable objects {text, notes[]}
   * @returns {Object} Melisma analysis
   */
  analyzeMelisma(syllables) {
    const melismaCount = syllables.filter(s => s.notes && s.notes.length > 1).length;
    const totalSyllables = syllables.length;

    const notesPerSyllable = syllables.map(s => s.notes?.length || 1);
    const avgNotesPerSyllable = notesPerSyllable.reduce((sum, n) => sum + n, 0) / totalSyllables;

    const maxNotesOnSyllable = Math.max(...notesPerSyllable);

    return {
      totalSyllables: totalSyllables,
      melismaticSyllables: melismaCount,
      melismaPercentage: (melismaCount / totalSyllables) * 100,
      averageNotesPerSyllable: avgNotesPerSyllable,
      maxNotesOnSyllable: maxNotesOnSyllable,
      style: avgNotesPerSyllable > 2 ? 'highly melismatic' :
             avgNotesPerSyllable > 1.5 ? 'melismatic' : 'syllabic'
    };
  }

  /**
   * Detect vocal leaps (large interval jumps)
   * @param {Array} notes - Array of MIDI note numbers
   * @returns {Object} Leap analysis
   */
  detectVocalLeaps(notes) {
    const leaps = [];
    const smallLeapThreshold = 4; // Major 3rd
    const largeLeapThreshold = 8; // Minor 6th

    for (let i = 1; i < notes.length; i++) {
      const interval = Math.abs(notes[i] - notes[i - 1]);

      if (interval >= smallLeapThreshold) {
        leaps.push({
          from: notes[i - 1],
          to: notes[i],
          interval: interval,
          direction: notes[i] > notes[i - 1] ? 'ascending' : 'descending',
          size: interval >= largeLeapThreshold ? 'large' : 'small'
        });
      }
    }

    const largeLeaps = leaps.filter(l => l.size === 'large').length;

    return {
      totalLeaps: leaps.length,
      largeLeaps: largeLeaps,
      leapPercentage: (leaps.length / (notes.length - 1)) * 100,
      leaps: leaps,
      style: largeLeaps > notes.length * 0.3 ? 'disjunct' : 'conjunct'
    };
  }

  /**
   * Analyze vibrato pattern
   * @param {Array} pitchData - Array of pitch measurements over time
   * @returns {Object} Vibrato analysis
   */
  analyzeVibrato(pitchData) {
    if (pitchData.length < 10) {
      return { error: 'Insufficient data for vibrato analysis' };
    }

    // Detect oscillations
    let oscillations = 0;
    let lastDirection = null;

    for (let i = 1; i < pitchData.length; i++) {
      const currentDirection = pitchData[i] > pitchData[i - 1] ? 'up' : 'down';

      if (lastDirection && currentDirection !== lastDirection) {
        oscillations++;
      }

      lastDirection = currentDirection;
    }

    // Calculate rate (oscillations per second)
    const timeSpan = pitchData.length / 100; // Assuming 100Hz sampling
    const vibratoRate = oscillations / 2 / timeSpan; // Divide by 2 for full cycles

    // Calculate depth (pitch variation)
    const maxPitch = Math.max(...pitchData);
    const minPitch = Math.min(...pitchData);
    const vibratoDepth = maxPitch - minPitch;

    return {
      detected: oscillations > 4,
      rate: vibratoRate,
      depth: vibratoDepth,
      oscillations: oscillations,
      quality: vibratoRate >= 5 && vibratoRate <= 7 ? 'natural' :
               vibratoRate < 5 ? 'slow' : 'fast'
    };
  }

  /**
   * Generate vocal exercise pattern
   * @param {string} exerciseType - Type of exercise
   * @param {Object} options - Exercise options
   * @returns {Object} Exercise pattern
   */
  generateVocalExercise(exerciseType, options = {}) {
    const {
      startNote = 60, // Middle C
      range = 12, // One octave
      steps = 1 // Semitones per step
    } = options;

    let pattern = [];

    switch (exerciseType) {
      case 'scale':
        // Ascending and descending scale
        for (let i = 0; i <= range; i += steps) {
          pattern.push(startNote + i);
        }
        for (let i = range - steps; i >= 0; i -= steps) {
          pattern.push(startNote + i);
        }
        break;

      case 'arpeggio':
        // Major triad arpeggio
        const arpeggioIntervals = [0, 4, 7, 12, 7, 4, 0];
        pattern = arpeggioIntervals.map(interval => startNote + interval);
        break;

      case 'sirens':
        // Smooth glides
        for (let i = 0; i <= range; i++) {
          pattern.push(startNote + i);
        }
        for (let i = range; i >= 0; i--) {
          pattern.push(startNote + i);
        }
        break;

      case 'staccato':
        // Repeated notes with rests
        for (let i = 0; i <= range; i += 2) {
          pattern.push(startNote + i);
          pattern.push(null); // Rest
        }
        break;

      case 'lip-trill':
        // Rapid repetition on same note
        for (let i = 0; i < 8; i++) {
          pattern.push(startNote);
        }
        break;

      default:
        pattern = [startNote];
    }

    return {
      type: exerciseType,
      pattern: pattern,
      startNote: startNote,
      range: range,
      description: this.getExerciseDescription(exerciseType)
    };
  }

  /**
   * Get description for vocal exercise
   * @param {string} exerciseType - Type of exercise
   * @returns {string} Description
   */
  getExerciseDescription(exerciseType) {
    const descriptions = {
      scale: 'Ascending and descending scale for pitch accuracy and range',
      arpeggio: 'Major triad arpeggio for interval training',
      sirens: 'Smooth glides for register transitions',
      staccato: 'Short detached notes for breath control',
      'lip-trill': 'Rapid lip vibration for relaxation and warm-up'
    };

    return descriptions[exerciseType] || 'Custom vocal exercise';
  }

  /**
   * Analyze breath support requirements
   * @param {Array} phrases - Array of phrase objects with durations
   * @returns {Object} Breath support analysis
   */
  analyzeBreathSupport(phrases) {
    const phraseLengths = phrases.map(p => p.duration || 0);
    const avgPhraseLength = phraseLengths.reduce((sum, l) => sum + l, 0) / phraseLengths.length;
    const maxPhraseLength = Math.max(...phraseLengths);

    // Estimate breath capacity needed (longer phrases = more capacity)
    let capacityLevel;
    if (maxPhraseLength > 8) {
      capacityLevel = 'advanced';
    } else if (maxPhraseLength > 5) {
      capacityLevel = 'intermediate';
    } else {
      capacityLevel = 'beginner';
    }

    return {
      averagePhraseLength: avgPhraseLength,
      maxPhraseLength: maxPhraseLength,
      capacityRequired: capacityLevel,
      recommendations: this.getBreathRecommendations(maxPhraseLength)
    };
  }

  /**
   * Get breath support recommendations
   * @param {number} maxPhraseLength - Maximum phrase length
   * @returns {Array} Array of recommendations
   */
  getBreathRecommendations(maxPhraseLength) {
    const recommendations = [
      'Practice diaphragmatic breathing exercises'
    ];

    if (maxPhraseLength > 6) {
      recommendations.push('Work on breath capacity with sustained note exercises');
      recommendations.push('Practice breath control with crescendo/decrescendo exercises');
    }

    if (maxPhraseLength > 8) {
      recommendations.push('Consider adding breath marks in the score');
      recommendations.push('Practice circular breathing techniques');
    }

    return recommendations;
  }
}

module.exports = VocalPatterns;
