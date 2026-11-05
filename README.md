# miguelquirozcoding.github.io

My portfolio site, live at [miguelquirozcoding.github.io](https://miguelquirozcoding.github.io/).

It's plain HTML, CSS and JavaScript with no build step, no framework and no 3D library. GitHub Pages serves it straight from the `main` branch.

## Preview it on my Mac

Open `index.html` in a browser. Everything works from the file except the 404 page, which only works once it's on GitHub Pages.

## Change the words

All the text is in `index.html`, one section at a time: About, Experience, Projects, Skills, Education and honors, and Contact.

## Add a project

1. Open `projects.js`.
2. Copy the example at the top into the list and fill it in.
3. Set `published` to `true` when it's ready.

The Projects section and its menu link appear on their own once one project is published. If a project has a screenshot, put it in `assets/projects/` and describe it in `imageAlt`.

## Change colors

The colors are tokens at the top of `styles.css`. The first block is light mode and the next two are dark mode, so change both dark blocks together.

## Publish a change

```
git add -A
```

```
git commit -m "Describe the change"
```

```
git push
```

GitHub Pages usually updates the live site within a minute or two.

## Files

| File | What it does |
| --- | --- |
| `index.html` | The page and all of its text |
| `styles.css` | The look, light and dark mode, the phone layout and the animations |
| `main.js` | Theme switch, phone menu, label tilt, Copy email and the projects list |
| `projects.js` | My projects, each with a `published` flag |
| `404.html` | The page people see when a link is broken |
| `assets/fonts/` | Barlow by Jeremy Tribby, under the SIL Open Font License |
| `assets/og-image.png` | The preview image LinkedIn and other sites show for my link |

The old site is saved on the `old-site-backup` branch.
