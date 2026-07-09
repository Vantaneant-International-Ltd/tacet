# Tacet web app UI kit

The canonical Tacet product surface: three-column desktop layout (sidebar · feed · people rail), light theme by default with a working dark-mode toggle.

- `index.html` — interactive Today view: compose + share (adds to feed with a toast), like posts, follow/join, switch tabs, toggle theme.
- Composes bundle components only (`SideNav`, `PostCard`, `PersonCard`, `CommunityCard`, `SearchField`, `Tabs`, `Chip`, `Card`, `Toast`, `Button`, `IconButton`, `Avatar`, `Icon`) — no re-implemented primitives.
- Layout rules: max content width 1220, 24px gutters, sidebar 250 / rail 320, feed cards stack at 14px gaps.
