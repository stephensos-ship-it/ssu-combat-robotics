# The club website

Plain HTML, CSS and one JavaScript file. No build step, no framework, no accounts to
renew. You edit a file, push it, and the live site changes about a minute later.

**This folder is its own thing.** It is published to the public internet. The rest of
`CombatRobotics/` is not, and must not be — see "What must never go in here" below.

## Files

| File | What it is |
|---|---|
| `index.html` | Home |
| `about.html` | About the club |
| `robots.html` | What we build |
| `sponsors.html` | Sponsorship, tiers, what a season costs |
| `join.html` | How to join, meeting time |
| `css/styles.css` | Every style for every page. There is only one stylesheet. |
| `js/arena.js` | The animated background: two robots fight, one gets chased off, the next pair drives in |
| `favicon.svg` | The club mark, used as the browser-tab icon |

Each page is a complete standalone HTML file. The header and footer are copied into all
five, so **if you change the navigation or the footer, change it in all five files.**
That is the one cost of having no build step, and it is worth it.

## Editing

Open the `.html` file in any text editor. The text lives between the tags; you do not
need to understand the rest. To preview, double-click the file and it opens in your
browser exactly as it will look live.

Things that need filling in or updating over time:

- **`[STILL BEING VOTED ON]`** on `join.html` — replace with the dues amount once the club votes.
- **`Room TBD`** on `join.html` — replace once a room is booked. (There is no venue
  placeholder on `index.html`; the showcase venue is simply not mentioned there yet, so add
  it to the season line if you want it public.)
- **The season line** at the bottom of `index.html` — one sentence naming the current
  season's event. Update it once a year; the rest of the homepage is written to last.
- **`$1,500`** on `sponsors.html` — the yearly program need. Re-check it each year.
- **Contact email** — `combatrobotics@sonoma.edu`, in the footer of all five pages and on
  `sponsors.html`. ✅ Switched off the founder's personal address on 2026-09-03, so the site
  no longer breaks the day his account closes. Keep it that way: **never put a personal
  address back on this site.**

## The address

The site is at **https://ssucombatrobotics.org**, registered at Porkbun and pointed at
GitHub Pages. The old `stephensos-ship-it.github.io/ssu-combat-robotics/` URL still works
and redirects here.

**The domain renews for about $12 a year.** If nobody pays it, the site goes dark and the
name becomes available for anyone to register. Make sure auto-renew is on and that the card
behind it is not one that expires with a graduating student.

## Publishing changes

```
git add -A
git commit -m "what you changed"
git push
```

GitHub rebuilds the site automatically. Give it a minute, then reload.

## What must never go in here

This folder is public. The parent `CombatRobotics/` folder is not, and contains things
that should stay private:

- **`docs/FUNDING.md` and `docs/OUTREACH.md`** — the funding strategy, the target list,
  and drafted emails. Publishing these tells every prospect exactly what you are about to
  send them and what you think of their odds.
- **`docs/BUDGET.md` and `docs/STATUS.md`** — internal numbers and unresolved questions.
- **The roster** — student names, SSU IDs and emails. Never publish this.
- **`slides/` and `CombatRoboticsSlideshows.zip`** — curriculum donated by another club.
  It is theirs, it is 300+ MB, and it is not ours to redistribute.

The site repository is deliberately separate from the project folder so that pushing the
website cannot accidentally publish any of the above.

## Who owns this

The GitHub account that owns this repository controls the website. **It should be a club
account, not a personal one**, so the site survives the founder graduating. If it is
currently on a personal account, moving it is a two-minute job under Settings, Transfer
ownership, and it should happen before the handoff rather than after.

Record the account name and who has the password in `docs/STATUS.md` under the accounts
inventory, alongside the Associated Students account and the Discord.
