const fs = require('fs');
const path = require('path');
const { WaveFile } = require('wavefile');

/**
 * WAV File Utilities
 * Provides comprehensive WAV file manipulation including reading, writing,
 * editing, combining, converting, and analyzing WAV audio files
 */

class WavUtils {
  constructor() {
    this.supportedBitDepths = [8, 16, 24, 32];
    this.supportedSampleRates = [8000, 11025, 16000, 22050, 44100, 48000, 96000, 192000];
  }

  /**
   * Read a WAV file and return its data
   * @param {string} filePath - Path to WAV file
   * @returns {Object} WAV file data and metadata
   */
  readWav(filePath) {
    try {
      const buffer = fs.readFileSync(filePath);
      const wav = new WaveFile(buffer);

      return {
        success: true,
        data: wav,
        metadata: {
          sampleRate: wav.fmt.sampleRate,
          bitDepth: wav.bitDepth,
          numChannels: wav.fmt.numChannels,
          duration: this.getDuration(wav),
          format: wav.fmt.audioFormat,
          dataType: wav.dataType,
          samples: wav.data.samples
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
   * Create a new WAV file
   * @param {Array} samples - Audio samples
   * @param {Object} options - WAV options (sampleRate, bitDepth, numChannels)
   * @returns {WaveFile} WAV file object
   */
  createWav(samples, options = {}) {
    const {
      sampleRate = 44100,
      bitDepth = 16,
      numChannels = 1
    } = options;

    const wav = new WaveFile();

    // Create WAV from samples
    wav.fromScratch(numChannels, sampleRate, bitDepth.toString(), samples);

    return wav;
  }

  /**
   * Write WAV file to disk
   * @param {WaveFile} wav - WAV file object
   * @param {string} outputPath - Output file path
   * @returns {Object} Success status
   */
  writeWav(wav, outputPath) {
    try {
      fs.writeFileSync(outputPath, wav.toBuffer());
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
   * Get duration of WAV file in seconds
   * @param {WaveFile} wav - WAV file object
   * @returns {number} Duration in seconds
   */
  getDuration(wav) {
    const numSamples = wav.data.samples.length / wav.fmt.numChannels;
    return numSamples / wav.fmt.sampleRate;
  }

  /**
   * Convert WAV to different sample rate
   * @param {WaveFile} wav - WAV file object
   * @param {number} newSampleRate - Target sample rate
   * @returns {WaveFile} Resampled WAV
   */
  resample(wav, newSampleRate) {
    const newWav = new WaveFile(wav.toBuffer());
    newWav.toSampleRate(newSampleRate);
    return newWav;
  }

  /**
   * Convert WAV to different bit depth
   * @param {WaveFile} wav - WAV file object
   * @param {string} newBitDepth - Target bit depth (e.g., '16', '24', '32')
   * @returns {WaveFile} Converted WAV
   */
  changeBitDepth(wav, newBitDepth) {
    const newWav = new WaveFile(wav.toBuffer());
    newWav.toBitDepth(newBitDepth);
    return newWav;
  }

  /**
   * Convert mono to stereo or stereo to mono
   * @param {WaveFile} wav - WAV file object
   * @param {number} targetChannels - Number of target channels (1 or 2)
   * @returns {WaveFile} Converted WAV
   */
  convertChannels(wav, targetChannels) {
    const newWav = new WaveFile(wav.toBuffer());

    if (targetChannels === 1 && wav.fmt.numChannels === 2) {
      // Stereo to mono
      newWav.toStereo(false);
    } else if (targetChannels === 2 && wav.fmt.numChannels === 1) {
      // Mono to stereo
      newWav.toStereo(true);
    }

    return newWav;
  }

  /**
   * Trim WAV file
   * @param {WaveFile} wav - WAV file object
   * @param {number} startTime - Start time in seconds
   * @param {number} endTime - End time in seconds
   * @returns {WaveFile} Trimmed WAV
   */
  trim(wav, startTime, endTime) {
    const sampleRate = wav.fmt.sampleRate;
    const numChannels = wav.fmt.numChannels;
    const startSample = Math.floor(startTime * sampleRate) * numChannels;
    const endSample = Math.floor(endTime * sampleRate) * numChannels;

    const trimmedSamples = wav.data.samples.slice(startSample, endSample);

    return this.createWav(trimmedSamples, {
      sampleRate: wav.fmt.sampleRate,
      bitDepth: parseInt(wav.bitDepth),
      numChannels: wav.fmt.numChannels
    });
  }

  /**
   * Combine multiple WAV files sequentially
   * @param {Array<WaveFile>} wavFiles - Array of WAV file objects
   * @returns {WaveFile} Combined WAV
   */
  concatenate(wavFiles) {
    if (wavFiles.length === 0) {
      throw new Error('No WAV files provided');
    }

    // Use first file's properties as reference
    const reference = wavFiles[0];
    let combinedSamples = [];

    wavFiles.forEach(wav => {
      // Ensure all files have same format
      let processedWav = wav;

      if (wav.fmt.sampleRate !== reference.fmt.sampleRate) {
        processedWav = this.resample(processedWav, reference.fmt.sampleRate);
      }

      if (wav.bitDepth !== reference.bitDepth) {
        processedWav = this.changeBitDepth(processedWav, reference.bitDepth);
      }

      if (wav.fmt.numChannels !== reference.fmt.numChannels) {
        processedWav = this.convertChannels(processedWav, reference.fmt.numChannels);
      }

      combinedSamples = combinedSamples.concat(Array.from(processedWav.data.samples));
    });

    return this.createWav(combinedSamples, {
      sampleRate: reference.fmt.sampleRate,
      bitDepth: parseInt(reference.bitDepth),
      numChannels: reference.fmt.numChannels
    });
  }

  /**
   * Mix multiple WAV files together (overlay)
   * @param {Array<WaveFile>} wavFiles - Array of WAV file objects
   * @param {Array<number>} volumes - Volume levels for each file (0.0 to 1.0)
   * @returns {WaveFile} Mixed WAV
   */
  mix(wavFiles, volumes = null) {
    if (wavFiles.length === 0) {
      throw new Error('No WAV files provided');
    }

    // Set default volumes
    if (!volumes) {
      volumes = new Array(wavFiles.length).fill(1.0 / wavFiles.length);
    }

    // Use first file's properties as reference
    const reference = wavFiles[0];

    // Normalize all files to same format
    const normalizedWavs = wavFiles.map(wav => {
      let processedWav = new WaveFile(wav.toBuffer());

      if (wav.fmt.sampleRate !== reference.fmt.sampleRate) {
        processedWav = this.resample(processedWav, reference.fmt.sampleRate);
      }

      if (wav.bitDepth !== reference.bitDepth) {
        processedWav = this.changeBitDepth(processedWav, reference.bitDepth);
      }

      if (wav.fmt.numChannels !== reference.fmt.numChannels) {
        processedWav = this.convertChannels(processedWav, reference.fmt.numChannels);
      }

      return processedWav;
    });

    // Find maximum length
    const maxLength = Math.max(...normalizedWavs.map(wav => wav.data.samples.length));

    // Mix samples
    const mixedSamples = new Array(maxLength).fill(0);

    normalizedWavs.forEach((wav, index) => {
      const volume = volumes[index];
      const samples = wav.data.samples;

      for (let i = 0; i < samples.length; i++) {
        mixedSamples[i] += samples[i] * volume;
      }
    });

    // Normalize to prevent clipping
    const maxSample = Math.max(...mixedSamples.map(Math.abs));
    const maxValue = Math.pow(2, parseInt(reference.bitDepth) - 1) - 1;

    if (maxSample > maxValue) {
      const normalizeFactor = maxValue / maxSample;
      for (let i = 0; i < mixedSamples.length; i++) {
        mixedSamples[i] *= normalizeFactor;
      }
    }

    return this.createWav(mixedSamples, {
      sampleRate: reference.fmt.sampleRate,
      bitDepth: parseInt(reference.bitDepth),
      numChannels: reference.fmt.numChannels
    });
  }

  /**
   * Apply fade in effect
   * @param {WaveFile} wav - WAV file object
   * @param {number} duration - Fade duration in seconds
   * @returns {WaveFile} WAV with fade in
   */
  fadeIn(wav, duration) {
    const samples = Array.from(wav.data.samples);
    const fadeLength = Math.floor(duration * wav.fmt.sampleRate * wav.fmt.numChannels);

    for (let i = 0; i < fadeLength && i < samples.length; i++) {
      const fadeFactor = i / fadeLength;
      samples[i] *= fadeFactor;
    }

    return this.createWav(samples, {
      sampleRate: wav.fmt.sampleRate,
      bitDepth: parseInt(wav.bitDepth),
      numChannels: wav.fmt.numChannels
    });
  }

  /**
   * Apply fade out effect
   * @param {WaveFile} wav - WAV file object
   * @param {number} duration - Fade duration in seconds
   * @returns {WaveFile} WAV with fade out
   */
  fadeOut(wav, duration) {
    const samples = Array.from(wav.data.samples);
    const fadeLength = Math.floor(duration * wav.fmt.sampleRate * wav.fmt.numChannels);
    const startFade = samples.length - fadeLength;

    for (let i = startFade; i < samples.length; i++) {
      const fadeFactor = (samples.length - i) / fadeLength;
      samples[i] *= fadeFactor;
    }

    return this.createWav(samples, {
      sampleRate: wav.fmt.sampleRate,
      bitDepth: parseInt(wav.bitDepth),
      numChannels: wav.fmt.numChannels
    });
  }

  /**
   * Change volume/gain
   * @param {WaveFile} wav - WAV file object
   * @param {number} gain - Gain factor (1.0 = no change, 2.0 = double volume)
   * @returns {WaveFile} WAV with adjusted volume
   */
  changeVolume(wav, gain) {
    const samples = Array.from(wav.data.samples);
    const maxValue = Math.pow(2, parseInt(wav.bitDepth) - 1) - 1;

    for (let i = 0; i < samples.length; i++) {
      samples[i] = Math.max(-maxValue, Math.min(maxValue, samples[i] * gain));
    }

    return this.createWav(samples, {
      sampleRate: wav.fmt.sampleRate,
      bitDepth: parseInt(wav.bitDepth),
      numChannels: wav.fmt.numChannels
    });
  }

  /**
   * Reverse audio
   * @param {WaveFile} wav - WAV file object
   * @returns {WaveFile} Reversed WAV
   */
  reverse(wav) {
    const samples = Array.from(wav.data.samples);
    const numChannels = wav.fmt.numChannels;

    // Reverse by complete frames
    const reversedSamples = [];
    for (let i = samples.length - numChannels; i >= 0; i -= numChannels) {
      for (let ch = 0; ch < numChannels; ch++) {
        reversedSamples.push(samples[i + ch]);
      }
    }

    return this.createWav(reversedSamples, {
      sampleRate: wav.fmt.sampleRate,
      bitDepth: parseInt(wav.bitDepth),
      numChannels: wav.fmt.numChannels
    });
  }

  /**
   * Generate silence
   * @param {number} duration - Duration in seconds
   * @param {Object} options - WAV options
   * @returns {WaveFile} Silent WAV
   */
  generateSilence(duration, options = {}) {
    const {
      sampleRate = 44100,
      bitDepth = 16,
      numChannels = 1
    } = options;

    const numSamples = Math.floor(duration * sampleRate * numChannels);
    const samples = new Array(numSamples).fill(0);

    return this.createWav(samples, { sampleRate, bitDepth, numChannels });
  }

  /**
   * Generate sine wave tone
   * @param {number} frequency - Frequency in Hz
   * @param {number} duration - Duration in seconds
   * @param {Object} options - WAV options
   * @returns {WaveFile} Tone WAV
   */
  generateTone(frequency, duration, options = {}) {
    const {
      sampleRate = 44100,
      bitDepth = 16,
      numChannels = 1,
      amplitude = 0.5
    } = options;

    const numSamples = Math.floor(duration * sampleRate);
    const maxValue = Math.pow(2, bitDepth - 1) - 1;
    const samples = [];

    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      const value = Math.sin(2 * Math.PI * frequency * t) * amplitude * maxValue;

      for (let ch = 0; ch < numChannels; ch++) {
        samples.push(Math.round(value));
      }
    }

    return this.createWav(samples, { sampleRate, bitDepth, numChannels });
  }

  /**
   * Analyze WAV file for audio characteristics
   * @param {WaveFile} wav - WAV file object
   * @returns {Object} Analysis results
   */
  analyze(wav) {
    const samples = wav.data.samples;
    const numChannels = wav.fmt.numChannels;

    // Calculate RMS (volume)
    let sumSquares = 0;
    for (let i = 0; i < samples.length; i++) {
      sumSquares += samples[i] * samples[i];
    }
    const rms = Math.sqrt(sumSquares / samples.length);

    // Find peak
    const peak = Math.max(...samples.map(Math.abs));
    const maxValue = Math.pow(2, parseInt(wav.bitDepth) - 1) - 1;

    // Detect clipping
    const clippedSamples = samples.filter(s => Math.abs(s) >= maxValue).length;
    const clippingPercentage = (clippedSamples / samples.length) * 100;

    return {
      duration: this.getDuration(wav),
      sampleRate: wav.fmt.sampleRate,
      bitDepth: wav.bitDepth,
      numChannels: wav.fmt.numChannels,
      rmsLevel: rms,
      peakLevel: peak,
      dynamicRange: maxValue / (rms || 1),
      clippingPercentage: clippingPercentage,
      isClipping: clippingPercentage > 0.1,
      fileSize: wav.toBuffer().length
    };
  }

  /**
   * Extract a specific channel from stereo WAV
   * @param {WaveFile} wav - WAV file object
   * @param {number} channel - Channel to extract (0 = left, 1 = right)
   * @returns {WaveFile} Mono WAV of specified channel
   */
  extractChannel(wav, channel = 0) {
    if (wav.fmt.numChannels === 1) {
      return new WaveFile(wav.toBuffer());
    }

    const samples = [];
    for (let i = channel; i < wav.data.samples.length; i += wav.fmt.numChannels) {
      samples.push(wav.data.samples[i]);
    }

    return this.createWav(samples, {
      sampleRate: wav.fmt.sampleRate,
      bitDepth: parseInt(wav.bitDepth),
      numChannels: 1
    });
  }
}

module.exports = WavUtils;
