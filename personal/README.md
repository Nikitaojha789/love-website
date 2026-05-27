# 💕 Romantic Proposal Website

A beautiful, emotional, and fully responsive romantic proposal website.

## How to Run

Just open `index.html` in any browser. No server needed.

---

## Adding Your Content

### 📸 Photos
Place your couple photos inside `assets/images/` and name them:
```
photo1.jpg
photo2.jpg
photo3.jpg
photo4.jpg
photo5.jpg
photo6.jpg
```
Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`

To add more photos, copy a `gallery-item` block in `index.html` and update the `src` and `data-caption`.

---

### 🎬 Videos
Place your video files inside `assets/videos/` and name them:
```
video1.mp4
video2.mp4
video3.mp4
```
Supported formats: `.mp4`, `.webm`

---

### 🎵 Music
Place your background music file at:
```
assets/music/love.mp3
```
Click the **♪** button (bottom-left) to toggle music on/off.

---

## Customising Text

All text is clearly commented in `index.html`. Search for:
- `<!-- Edit the letter text below -->` — love letter
- `<!-- Edit section title -->` — section headings
- `<!-- Edit each timeline event -->` — timeline
- `<!-- Edit each promise card -->` — promises

To edit the **Reasons I Love You** list, open `script.js` and find:
```js
// ===== EDIT YOUR REASONS HERE =====
const reasonsList = [ ... ]
```

---

## Easter Eggs

- Click the **♥** on any promise card to reveal a hidden message
- Click anywhere on the page to spawn floating hearts
- Click either proposal button for the final ending animation
- Click the **💕** button (bottom-right) for the "Reasons I Love You" popup

---

## File Structure

```
index.html          ← Main website
style.css           ← All styles
script.js           ← All interactions & animations
assets/
  images/           ← Place your photos here
  videos/           ← Place your videos here
  music/            ← Place love.mp3 here
```
