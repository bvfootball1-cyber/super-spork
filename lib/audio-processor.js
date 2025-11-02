const WavUtils = require('./wav-utils');
const fs = require('fs');
const path = require('path');

/**
 * Audio Processor
 * High-level audio processing utilities for combining, extracting,
 * and manipulating multiple audio files
 */

class AudioProcessor {
  constructor() {
    this.wavUtils = new WavUtils();
  }

  /**
   * Combine multiple audio files sequentially
   * @param {Array<string>} filePaths - Array of WAV file paths
   * @param {string} outputPath - Output file path
   * @returns {Object} Result with success status
   */
  combineSequentially(filePaths, outputPath) {
    try {
      const wavFiles = filePaths.map(filePath => {
        const result = this.wavUtils.readWav(filePath);
        if (!result.success) {
          throw new Error(`Failed to read ${filePath}: ${result.error}`);
        }
        return result.data;
      });

      const combined = this.wavUtils.concatenate(wavFiles);
      const writeResult = this.wavUtils.writeWav(combined, outputPath);

      return {
        success: true,
        outputPath: outputPath,
        numFiles: filePaths.length,
        ...writeResult
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Mix multiple audio files together
   * @param {Array<Object>} inputs - Array of {path, volume} objects
   * @param {string} outputPath - Output file path
   * @returns {Object} Result with success status
   */
  mixTogether(inputs, outputPath) {
    try {
      const wavFiles = [];
      const volumes = [];

      inputs.forEach(input => {
        const result = this.wavUtils.readWav(input.path);
        if (!result.success) {
          throw new Error(`Failed to read ${input.path}: ${result.error}`);
        }
        wavFiles.push(result.data);
        volumes.push(input.volume || 1.0);
      });

      const mixed = this.wavUtils.mix(wavFiles, volumes);
      const writeResult = this.wavUtils.writeWav(mixed, outputPath);

      return {
        success: true,
        outputPath: outputPath,
        numFiles: inputs.length,
        ...writeResult
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Extract portion of audio file
   * @param {string} inputPath - Input file path
   * @param {string} outputPath - Output file path
   * @param {number} startTime - Start time in seconds
   * @param {number} endTime - End time in seconds
   * @returns {Object} Result with success status
   */
  extractSegment(inputPath, outputPath, startTime, endTime) {
    try {
      const result = this.wavUtils.readWav(inputPath);
      if (!result.success) {
        throw new Error(`Failed to read ${inputPath}: ${result.error}`);
      }

      const trimmed = this.wavUtils.trim(result.data, startTime, endTime);
      const writeResult = this.wavUtils.writeWav(trimmed, outputPath);

      return {
        success: true,
        outputPath: outputPath,
        duration: endTime - startTime,
        ...writeResult
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Split audio file into multiple segments
   * @param {string} inputPath - Input file path
   * @param {string} outputDir - Output directory
   * @param {number} segmentDuration - Duration of each segment in seconds
   * @returns {Object} Result with success status
   */
  splitIntoSegments(inputPath, outputDir, segmentDuration) {
    try {
      const result = this.wavUtils.readWav(inputPath);
      if (!result.success) {
        throw new Error(`Failed to read ${inputPath}: ${result.error}`);
      }

      const totalDuration = result.metadata.duration;
      const numSegments = Math.ceil(totalDuration / segmentDuration);
      const segments = [];

      // Create output directory if it doesn't exist
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const baseName = path.basename(inputPath, '.wav');

      for (let i = 0; i < numSegments; i++) {
        const startTime = i * segmentDuration;
        const endTime = Math.min((i + 1) * segmentDuration, totalDuration);
        const outputPath = path.join(outputDir, `${baseName}_segment_${i + 1}.wav`);

        const trimmed = this.wavUtils.trim(result.data, startTime, endTime);
        this.wavUtils.writeWav(trimmed, outputPath);

        segments.push({
          index: i + 1,
          path: outputPath,
          startTime: startTime,
          endTime: endTime,
          duration: endTime - startTime
        });
      }

      return {
        success: true,
        numSegments: segments.length,
        segments: segments
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Normalize audio volume
   * @param {string} inputPath - Input file path
   * @param {string} outputPath - Output file path
   * @param {number} targetLevel - Target peak level (0.0 to 1.0)
   * @returns {Object} Result with success status
   */
  normalizeVolume(inputPath, outputPath, targetLevel = 0.9) {
    try {
      const result = this.wavUtils.readWav(inputPath);
      if (!result.success) {
        throw new Error(`Failed to read ${inputPath}: ${result.error}`);
      }

      const analysis = this.wavUtils.analyze(result.data);
      const maxValue = Math.pow(2, parseInt(result.metadata.bitDepth) - 1) - 1;
      const currentPeak = analysis.peakLevel;
      const targetPeak = maxValue * targetLevel;
      const gain = targetPeak / currentPeak;

      const normalized = this.wavUtils.changeVolume(result.data, gain);
      const writeResult = this.wavUtils.writeWav(normalized, outputPath);

      return {
        success: true,
        outputPath: outputPath,
        gainApplied: gain,
        originalPeak: currentPeak,
        newPeak: targetPeak,
        ...writeResult
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Apply crossfade between two audio files
   * @param {string} file1Path - First file path
   * @param {string} file2Path - Second file path
   * @param {string} outputPath - Output file path
   * @param {number} crossfadeDuration - Crossfade duration in seconds
   * @returns {Object} Result with success status
   */
  crossfade(file1Path, file2Path, outputPath, crossfadeDuration = 2) {
    try {
      const result1 = this.wavUtils.readWav(file1Path);
      const result2 = this.wavUtils.readWav(file2Path);

      if (!result1.success || !result2.success) {
        throw new Error('Failed to read input files');
      }

      // Apply fade out to end of first file
      const fadeOut1 = this.wavUtils.fadeOut(result1.data, crossfadeDuration);

      // Apply fade in to start of second file
      const fadeIn2 = this.wavUtils.fadeIn(result2.data, crossfadeDuration);

      // Calculate overlap point
      const duration1 = this.wavUtils.getDuration(fadeOut1);
      const trimStart = Math.max(0, duration1 - crossfadeDuration);

      // Trim first file to remove the part that will be crossfaded
      const trimmed1 = this.wavUtils.trim(fadeOut1, 0, trimStart);

      // Combine the files
      const combined = this.wavUtils.concatenate([trimmed1, fadeIn2]);
      const writeResult = this.wavUtils.writeWav(combined, outputPath);

      return {
        success: true,
        outputPath: outputPath,
        crossfadeDuration: crossfadeDuration,
        ...writeResult
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Convert audio format (sample rate, bit depth, channels)
   * @param {string} inputPath - Input file path
   * @param {string} outputPath - Output file path
   * @param {Object} options - Conversion options
   * @returns {Object} Result with success status
   */
  convertFormat(inputPath, outputPath, options = {}) {
    try {
      const result = this.wavUtils.readWav(inputPath);
      if (!result.success) {
        throw new Error(`Failed to read ${inputPath}: ${result.error}`);
      }

      let wav = result.data;

      // Apply conversions if specified
      if (options.sampleRate && options.sampleRate !== result.metadata.sampleRate) {
        wav = this.wavUtils.resample(wav, options.sampleRate);
      }

      if (options.bitDepth && options.bitDepth !== result.metadata.bitDepth) {
        wav = this.wavUtils.changeBitDepth(wav, options.bitDepth.toString());
      }

      if (options.channels && options.channels !== result.metadata.numChannels) {
        wav = this.wavUtils.convertChannels(wav, options.channels);
      }

      const writeResult = this.wavUtils.writeWav(wav, outputPath);

      return {
        success: true,
        outputPath: outputPath,
        conversions: {
          sampleRate: options.sampleRate || result.metadata.sampleRate,
          bitDepth: options.bitDepth || result.metadata.bitDepth,
          channels: options.channels || result.metadata.numChannels
        },
        ...writeResult
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Create audio loop by repeating
   * @param {string} inputPath - Input file path
   * @param {string} outputPath - Output file path
   * @param {number} repetitions - Number of times to repeat
   * @returns {Object} Result with success status
   */
  createLoop(inputPath, outputPath, repetitions = 4) {
    try {
      const result = this.wavUtils.readWav(inputPath);
      if (!result.success) {
        throw new Error(`Failed to read ${inputPath}: ${result.error}`);
      }

      const wavFiles = Array(repetitions).fill(result.data);
      const looped = this.wavUtils.concatenate(wavFiles);
      const writeResult = this.wavUtils.writeWav(looped, outputPath);

      return {
        success: true,
        outputPath: outputPath,
        repetitions: repetitions,
        totalDuration: result.metadata.duration * repetitions,
        ...writeResult
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Batch process multiple files with same operation
   * @param {Array<string>} inputPaths - Array of input file paths
   * @param {string} outputDir - Output directory
   * @param {Function} operation - Operation to apply (function that takes wav and returns wav)
   * @param {string} suffix - Suffix to add to output filenames
   * @returns {Object} Result with success status
   */
  batchProcess(inputPaths, outputDir, operation, suffix = '_processed') {
    try {
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const results = [];

      inputPaths.forEach(inputPath => {
        const result = this.wavUtils.readWav(inputPath);
        if (result.success) {
          const processed = operation(result.data);
          const baseName = path.basename(inputPath, '.wav');
          const outputPath = path.join(outputDir, `${baseName}${suffix}.wav`);

          const writeResult = this.wavUtils.writeWav(processed, outputPath);
          results.push({
            input: inputPath,
            output: outputPath,
            success: writeResult.success
          });
        } else {
          results.push({
            input: inputPath,
            success: false,
            error: result.error
          });
        }
      });

      const successCount = results.filter(r => r.success).length;

      return {
        success: true,
        totalFiles: inputPaths.length,
        successCount: successCount,
        failedCount: inputPaths.length - successCount,
        results: results
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Analyze multiple audio files
   * @param {Array<string>} filePaths - Array of file paths
   * @returns {Object} Analysis results
   */
  analyzeMultiple(filePaths) {
    const analyses = [];

    filePaths.forEach(filePath => {
      const result = this.wavUtils.readWav(filePath);
      if (result.success) {
        const analysis = this.wavUtils.analyze(result.data);
        analyses.push({
          file: filePath,
          ...analysis
        });
      }
    });

    // Calculate aggregate statistics
    const totalDuration = analyses.reduce((sum, a) => sum + a.duration, 0);
    const avgRMS = analyses.reduce((sum, a) => sum + a.rmsLevel, 0) / analyses.length;
    const maxPeak = Math.max(...analyses.map(a => a.peakLevel));

    return {
      fileCount: analyses.length,
      totalDuration: totalDuration,
      averageRMS: avgRMS,
      maximumPeak: maxPeak,
      files: analyses
    };
  }
}

module.exports = AudioProcessor;
