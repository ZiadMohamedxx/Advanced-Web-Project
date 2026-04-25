/**
 * Text-to-Speech Command Handlers
 * Commands for controlling audio playback: read page, pause, resume, stop
 * Dispatch events that TextToSpeechControls listens for
 */

import { CommandConfig } from "./navigation";

export const ttsCommands: Record<string, CommandConfig> = {
  read_page: {
    aliases: [
      "read page",
      "read this page",
      "read all",
      "read this",
      "what's on screen",
      "read screen",
    ],
    handler: () => {
      document.body.dispatchEvent(
        new CustomEvent("voice-tts-command", {
          detail: { command: "read-page" },
        })
      );
    },
    description: "Read entire page content aloud",
  },

  read_selected: {
    aliases: [
      "read selected",
      "read selected text",
      "read this text",
      "read highlighted",
      "read selection",
    ],
    handler: () => {
      document.body.dispatchEvent(
        new CustomEvent("voice-tts-command", {
          detail: { command: "read-selected" },
        })
      );
    },
    description: "Read highlighted text aloud",
  },

  pause_reading: {
    aliases: [
      "pause reading",
      "pause",
      "pause audio",
      "hold on",
      "wait",
    ],
    handler: () => {
      document.body.dispatchEvent(
        new CustomEvent("voice-tts-command", {
          detail: { command: "pause-resume" },
        })
      );
    },
    description: "Pause audio playback",
  },

  resume_reading: {
    aliases: [
      "resume reading",
      "resume",
      "continue",
      "continue reading",
      "keep reading",
      "go on",
    ],
    handler: () => {
      document.body.dispatchEvent(
        new CustomEvent("voice-tts-command", {
          detail: { command: "pause-resume" },
        })
      );
    },
    description: "Resume audio playback",
  },

  stop_reading: {
    aliases: [
      "stop reading",
      "stop audio",
      "stop",
      "cancel reading",
      "stop talking",
      "quiet",
      "silence",
    ],
    handler: () => {
      document.body.dispatchEvent(
        new CustomEvent("voice-tts-command", {
          detail: { command: "stop" },
        })
      );
    },
    description: "Stop audio playback completely",
  },
};