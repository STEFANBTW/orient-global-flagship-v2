# SoriKyo Workspace — Agent Rules

## Custom Shorthand Commands

The following patterns act as shorthand triggers. When the user types any of these,
treat it as an instruction to immediately invoke the corresponding skill or action
without asking for clarification.

### /mindmap [aesthetic name]
- **Triggers:** `aesthetic-mindmap-builder` skill
- **Example:** `/mindmap Brutalism` or `/mindmap 05` or `/mindmap Glassmorphism`
- **Action:** Read the SKILL.md at `.agents/skills/aesthetic-mindmap-builder/SKILL.md`,
  identify the target aesthetic from the argument, and execute all 6 phases in full.
  Do not summarise the plan first — just start Phase 0B discovery immediately.

### /mindmap-status
- **Triggers:** A progress check across all 20 aesthetics
- **Action:** List all 20 aesthetic folders under `aesthetics/`, check which have a
  `*_Mindmap.html` file, and report a status table showing Done / In Progress / Not Started.

### /mindmap-next
- **Triggers:** `aesthetic-mindmap-builder` skill on the next unbuilt aesthetic
- **Action:** Run `/mindmap-status` first to find the lowest-numbered aesthetic without
  a mindmap HTML file, then immediately start building it.

---

## General Rules

- When working in this workspace, all mindmap HTML files go in
  `aesthetics/XX_FolderName/XX_Name_Mindmap.html`
- All generated images for mindmaps go in `aesthetics/XX_FolderName/assets/images/`
- If image generation quota is exceeded, always write `image_prompts_fallback.md`
  to the aesthetic's folder — never skip this step
- Never modify `aesthetics/01_Minimalism/` unless the user explicitly asks
- The live-server process runs on port 8080. If it is not running, start it before
  opening any mindmap URL
- Anytime the user asks a question, expect to provide a direct explanation or answer, rather than executing code or performing tool actions, unless an action is explicitly requested.

