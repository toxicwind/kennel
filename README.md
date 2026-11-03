# kennel 🏠 — the agentMonitor PLACE

The agent's own desktop. Part of **pens/kelpie** (the shell pen).

## The modular doctrine

```
KENNEL (this product) = the PLACE — the walls, the bed, the flap door
  ├─ walls: Xvnc :99 (portrait 1440x2560 — rightVerticalMonitor-native)
  ├─ bed:   openbox + tint2 WM on :99
  └─ flap:  VNC :5900 + websockify :6080 (how you look in)

THINGS THAT LIVE IN THE KENNEL (separate products, sibling dirs):
  ├─ waterbowl  — the browser (chromium, CDP :25234) — agents drink data here
  ├─ coat       — the fur (e621 wallpaper rotation + palette) :25240
  └─ fetch      — brings it pretty (aesthetic pages bus) :25242
```

## Monitor-role contract (estate-wide)

`leftHorizontalMonitor` = DP-1 · `rightVerticalMonitor` = DP-2 (portrait) ·
`agentMonitor` = :99. Roles resolve via `../ww/bin/monitor-role.sh`.

## Health

```bash
bun run bin/status.ts   # walls/bed/flap/waterbowl — exit 1 if sick
```
