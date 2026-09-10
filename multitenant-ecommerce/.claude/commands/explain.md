---
description: Explain a concept/code area and save a concise note next to it
argument-hint: <topic and/or file paths>
---

Explain the following for this codebase: **$ARGUMENTS**

Rules:
- Read the actual referenced files first; ground every claim in real
  `file:line`, not generic knowledge.
- Cover: what it is, why it's used here, how the pieces connect (a small
  ASCII diagram if there's a data flow), and any bug you notice in passing.
- Keep it tight — no filler, no restating the question.
- After explaining in chat, also write the same content (condensed) to a
  `*-notes.md` file next to the most relevant source file, kebab-case name.
- Use fenced code blocks with real snippets from the repo, trimmed to the
  point being made.
