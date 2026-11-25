# BOND native macOS companion — planned phase

The web application cannot create a global floating overlay or continue after its browser tab closes. The native companion is deliberately deferred until the web/API foundation is stable.

Recommended next phase: Tauri 2 (or Electron if the required native audio/window APIs are easier there) with:

- A small always-on-top transparent assistant window.
- Global shortcut configured by the user.
- Explicit microphone permission and visible recording state.
- A single stop/close action that tears down every audio stream and session.
- A shared authenticated API client; no API keys embedded in the desktop binary.
- OS startup/background behavior opt-in only, with a clear microphone indicator.

Do not describe browser speech recognition as Gemini Live or as a system-wide assistant.
