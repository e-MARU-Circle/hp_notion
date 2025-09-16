ABOJC 2025 – Release Notes

Version: v0.1.0 (development paused snapshot)

Changes
- Footer menu: Added three-dot popover navigation; removed GitHub link.
- Members section: More robust Notion title detection (名前/Name/タイトル/氏名/メンバー名 + fallback to any title-type property).
- Members section: Image URL handling supports both external and file references.
- Lint/Types: Eliminated any via type guards (TitleProperty/NotionFileRef) to satisfy ESLint.

Notes
- Development is currently paused; `main` reflects the latest stable state.
- Consider protecting `main` on GitHub and enabling required checks.
