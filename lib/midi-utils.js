const MidiWriter = require('midi-writer-js');
const { Midi } = require('@tonejs/midi');
const fs = require('fs');

/**
 * MIDI File Utilities
 * Provides comprehensive MIDI file manipulation including reading, writing,
 * creating, editing, and analyzing MIDI files
 */

class MidiUtils {
  constructor() {
    this.noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    this.defaultVelocity = 64;
    this.defaultDuration = '4'; // Quarter note
  }

  /**
   * Read a MIDI file
   * @param {string} filePath - Path to MIDI file
   * @returns {Object} MIDI data and metadata
   */
  async readMidi(filePath) {
    try {
      const midiData = fs.readFileSync(filePath);
      const midi = new Midi(midiData);

      return {
        success: true,
        data: midi,
        metadata: {
          name: midi.name,
          duration: midi.duration,
          durationTicks: midi.durationTicks,
          header: {
            ppq: midi.header.ppq,
            tempos: midi.header.tempos,
            timeSignatures: midi.header.timeSignatures,
            keySignatures: midi.header.keySignatures,
            meta: midi.header.meta
          },
          tracks: midi.tracks.map((track, index) => ({
            index: index,
            name: track.name,
            instrument: track.instrument,
            channel: track.channel,
            notes: track.notes.length,
            duration: track.duration
          }))
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Create a new MIDI file
   * @param {Object} options - MIDI options (tempo, timeSignature, key)
   * @returns {Object} MIDI writer track
   */
  createMidi(options = {}) {
    const {
      tempo = 120,
      timeSignature = [4, 4],
      key = 'C'
    } = options;

    const track = new MidiWriter.Track();

    // Set tempo
    track.setTempo(tempo);

    // Set time signature
    track.setTimeSignature(...timeSignature);

    // Set key signature (optional)
    if (key) {
      track.setKeySignature(key);
    }

    return {
      track: track,
      tempo: tempo,
      timeSignature: timeSignature
    };
  }

  /**
   * Add notes to a MIDI track
   * @param {MidiWriter.Track} track - MIDI track
   * @param {Array} notes - Array of note objects {pitch, duration, velocity}
   * @returns {MidiWriter.Track} Updated track
   */
  addNotes(track, notes) {
    notes.forEach(note => {
      const noteEvent = new MidiWriter.NoteEvent({
        pitch: note.pitch || 'C4',
        duration: note.duration || this.defaultDuration,
        velocity: note.velocity || this.defaultVelocity,
        wait: note.wait || 0
      });
      track.addEvent(noteEvent);
    });

    return track;
  }

  /**
   * Add a chord to MIDI track
   * @param {MidiWriter.Track} track - MIDI track
   * @param {Array} pitches - Array of note names
   * @param {Object} options - Note options
   * @returns {MidiWriter.Track} Updated track
   */
  addChord(track, pitches, options = {}) {
    const {
      duration = this.defaultDuration,
      velocity = this.defaultVelocity,
      wait = 0
    } = options;

    const chordEvent = new MidiWriter.NoteEvent({
      pitch: pitches,
      duration: duration,
      velocity: velocity,
      wait: wait
    });

    track.addEvent(chordEvent);
    return track;
  }

  /**
   * Write MIDI file to disk
   * @param {MidiWriter.Track} track - MIDI track
   * @param {string} outputPath - Output file path
   * @returns {Object} Success status
   */
  writeMidi(track, outputPath) {
    try {
      const write = new MidiWriter.Writer(track);
      const buffer = Buffer.from(write.buildFile());
      fs.writeFileSync(outputPath, buffer);

      return {
        success: true,
        path: outputPath,
        size: fs.statSync(outputPath).size
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Convert note name and octave to MIDI note number
   * @param {string} noteName - Note name (e.g., 'C4', 'A#5')
   * @returns {number} MIDI note number (0-127)
   */
  noteToMidi(noteName) {
    const match = noteName.match(/^([A-G][#b]?)(\d+)$/);
    if (!match) return null;

    const note = match[1];
    const octave = parseInt(match[2]);

    let noteIndex = this.noteNames.indexOf(note);
    if (noteIndex === -1) {
      // Handle flats
      const sharp = note[0] + '#';
      noteIndex = this.noteNames.indexOf(sharp);
      if (noteIndex === -1) return null;
    }

    return (octave + 1) * 12 + noteIndex;
  }

  /**
   * Convert MIDI note number to note name
   * @param {number} midiNote - MIDI note number (0-127)
   * @returns {string} Note name with octave
   */
  midiToNote(midiNote) {
    const octave = Math.floor(midiNote / 12) - 1;
    const noteIndex = midiNote % 12;
    return this.noteNames[noteIndex] + octave;
  }

  /**
   * Create a melody from note names
   * @param {Array} noteNames - Array of note names
   * @param {Object} options - MIDI and note options
   * @returns {MidiWriter.Track} MIDI track with melody
   */
  createMelody(noteNames, options = {}) {
    const {
      tempo = 120,
      duration = '4',
      velocity = 64
    } = options;

    const midiData = this.createMidi({ tempo });
    const notes = noteNames.map(pitch => ({
      pitch,
      duration,
      velocity
    }));

    this.addNotes(midiData.track, notes);
    return midiData.track;
  }

  /**
   * Create a chord progression
   * @param {Array} chords - Array of chord objects {notes, duration}
   * @param {Object} options - MIDI options
   * @returns {MidiWriter.Track} MIDI track with progression
   */
  createChordProgression(chords, options = {}) {
    const {
      tempo = 120,
      velocity = 64
    } = options;

    const midiData = this.createMidi({ tempo });

    chords.forEach(chord => {
      this.addChord(midiData.track, chord.notes, {
        duration: chord.duration || '4',
        velocity: velocity
      });
    });

    return midiData.track;
  }

  /**
   * Create drum pattern
   * @param {Array} pattern - Array of drum hits {drum, time, velocity}
   * @param {Object} options - MIDI options
   * @returns {MidiWriter.Track} MIDI track with drum pattern
   */
  createDrumPattern(pattern, options = {}) {
    const {
      tempo = 120,
      channel = 10 // Standard drum channel
    } = options;

    const track = new MidiWriter.Track();
    track.setTempo(tempo);

    // Common drum mappings (General MIDI)
    const drumMap = {
      kick: 36,
      snare: 38,
      hihat: 42,
      openHihat: 46,
      crash: 49,
      ride: 51,
      tom1: 48,
      tom2: 45,
      tom3: 43
    };

    pattern.forEach(hit => {
      const pitch = drumMap[hit.drum] || hit.drum;
      const noteEvent = new MidiWriter.NoteEvent({
        pitch: pitch,
        duration: hit.duration || '8',
        velocity: hit.velocity || 100,
        wait: hit.wait || 0,
        channel: channel
      });
      track.addEvent(noteEvent);
    });

    return track;
  }

  /**
   * Create arpeggio from chord notes
   * @param {Array} chordNotes - Array of note names
   * @param {Object} options - Arpeggio options
   * @returns {MidiWriter.Track} MIDI track with arpeggio
   */
  createArpeggio(chordNotes, options = {}) {
    const {
      pattern = 'up', // 'up', 'down', 'updown', 'random'
      repeats = 1,
      noteDuration = '8',
      tempo = 120,
      velocity = 64
    } = options;

    const midiData = this.createMidi({ tempo });
    let notes = [];

    for (let i = 0; i < repeats; i++) {
      switch (pattern) {
        case 'up':
          notes = notes.concat(chordNotes);
          break;
        case 'down':
          notes = notes.concat([...chordNotes].reverse());
          break;
        case 'updown':
          notes = notes.concat(chordNotes);
          notes = notes.concat([...chordNotes].reverse().slice(1, -1));
          break;
        case 'random':
          const randomNotes = [...chordNotes];
          for (let j = randomNotes.length - 1; j > 0; j--) {
            const k = Math.floor(Math.random() * (j + 1));
            [randomNotes[j], randomNotes[k]] = [randomNotes[k], randomNotes[j]];
          }
          notes = notes.concat(randomNotes);
          break;
      }
    }

    const noteObjects = notes.map(pitch => ({
      pitch,
      duration: noteDuration,
      velocity
    }));

    this.addNotes(midiData.track, noteObjects);
    return midiData.track;
  }

  /**
   * Analyze MIDI file for musical characteristics
   * @param {Midi} midi - MIDI object from readMidi
   * @returns {Object} Analysis results
   */
  analyzeMidi(midi) {
    const allNotes = [];
    const noteCounts = {};
    let totalNotes = 0;

    midi.tracks.forEach(track => {
      track.notes.forEach(note => {
        const noteName = this.midiToNote(note.midi);
        const pitchClass = noteName.replace(/\d+/, '');

        allNotes.push({
          name: noteName,
          pitchClass: pitchClass,
          time: note.time,
          duration: note.duration,
          velocity: note.velocity
        });

        noteCounts[pitchClass] = (noteCounts[pitchClass] || 0) + 1;
        totalNotes++;
      });
    });

    // Find most common notes
    const sortedNotes = Object.entries(noteCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([note, count]) => ({
        note,
        count,
        percentage: (count / totalNotes) * 100
      }));

    // Calculate tempo range
    const tempos = midi.header.tempos.map(t => t.bpm);
    const avgTempo = tempos.reduce((sum, t) => sum + t, 0) / tempos.length;

    // Analyze velocity (dynamics)
    const velocities = allNotes.map(n => n.velocity);
    const avgVelocity = velocities.reduce((sum, v) => sum + v, 0) / velocities.length;

    return {
      duration: midi.duration,
      totalTracks: midi.tracks.length,
      totalNotes: totalNotes,
      tempo: {
        average: avgTempo,
        range: tempos,
        changes: midi.header.tempos.length
      },
      timeSignature: midi.header.timeSignatures[0],
      noteDistribution: sortedNotes.slice(0, 12),
      dynamics: {
        averageVelocity: avgVelocity,
        minVelocity: Math.min(...velocities),
        maxVelocity: Math.max(...velocities)
      },
      tracks: midi.tracks.map(track => ({
        name: track.name,
        notes: track.notes.length,
        instrument: track.instrument,
        channel: track.channel
      }))
    };
  }

  /**
   * Transpose MIDI notes
   * @param {Midi} midi - MIDI object
   * @param {number} semitones - Number of semitones to transpose (positive or negative)
   * @returns {Midi} Transposed MIDI
   */
  transposeMidi(midi, semitones) {
    const newMidi = midi.clone();

    newMidi.tracks.forEach(track => {
      track.notes.forEach(note => {
        note.midi = Math.max(0, Math.min(127, note.midi + semitones));
      });
    });

    return newMidi;
  }

  /**
   * Change MIDI tempo
   * @param {Midi} midi - MIDI object
   * @param {number} newTempo - New tempo in BPM
   * @returns {Midi} MIDI with updated tempo
   */
  changeTempo(midi, newTempo) {
    const newMidi = midi.clone();
    newMidi.header.tempos.forEach(tempo => {
      tempo.bpm = newTempo;
    });
    return newMidi;
  }

  /**
   * Extract a specific track from MIDI
   * @param {Midi} midi - MIDI object
   * @param {number} trackIndex - Track index to extract
   * @returns {Array} Track notes
   */
  extractTrack(midi, trackIndex) {
    if (trackIndex >= midi.tracks.length) {
      return null;
    }

    const track = midi.tracks[trackIndex];
    return track.notes.map(note => ({
      name: this.midiToNote(note.midi),
      midi: note.midi,
      time: note.time,
      duration: note.duration,
      velocity: note.velocity
    }));
  }

  /**
   * Merge multiple MIDI tracks
   * @param {Array<MidiWriter.Track>} tracks - Array of MIDI tracks
   * @returns {MidiWriter.Writer} Combined MIDI writer
   */
  mergeTracks(tracks) {
    return new MidiWriter.Writer(tracks);
  }

  /**
   * Create scale pattern
   * @param {string} rootNote - Root note (e.g., 'C4')
   * @param {Array} intervals - Array of intervals (semitones from root)
   * @param {Object} options - MIDI options
   * @returns {MidiWriter.Track} MIDI track with scale
   */
  createScale(rootNote, intervals, options = {}) {
    const {
      tempo = 120,
      duration = '8',
      velocity = 64,
      ascending = true,
      descending = false
    } = options;

    const rootMidi = this.noteToMidi(rootNote);
    const notes = [];

    if (ascending) {
      intervals.forEach(interval => {
        notes.push(this.midiToNote(rootMidi + interval));
      });
    }

    if (descending) {
      const descendingIntervals = [...intervals].reverse();
      descendingIntervals.forEach(interval => {
        notes.push(this.midiToNote(rootMidi + interval));
      });
    }

    return this.createMelody(notes, { tempo, duration, velocity });
  }

  /**
   * Generate MIDI from rhythm pattern
   * @param {Array} rhythmPattern - Array of note durations
   * @param {string} pitch - Note pitch
   * @param {Object} options - MIDI options
   * @returns {MidiWriter.Track} MIDI track with rhythm
   */
  createRhythm(rhythmPattern, pitch = 'C4', options = {}) {
    const {
      tempo = 120,
      velocity = 64
    } = options;

    const midiData = this.createMidi({ tempo });
    const notes = rhythmPattern.map(duration => ({
      pitch,
      duration,
      velocity
    }));

    this.addNotes(midiData.track, notes);
    return midiData.track;
  }
}

module.exports = MidiUtils;
