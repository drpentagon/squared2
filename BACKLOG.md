# Backlog

What is coming, and what was deliberately left behind. The second half records what was decided and why, so picking something up does not mean rediscovering the reasoning.

# Planned features

## Tiles and mechanics

**Fragile walls** — an on/off toggle on the wall object, so a wall can break when the ball hits it. `FragileRedirector` already does exactly this for redirectors: it extends `Redirector` and sets `consumed` in `onBounce`. The same relationship applies here, except as a flag on one object rather than a subclass, which is what the toggle implies.

**Teleport tile.**

**Balls in different colours.** The four items below all depend on this one, so colour has to be modelled first — on the ball, in the level data, and in what `interact` can ask about.

**Goals that only accept a given colour.**

**Tiles that paint the ball a colour.**

**Tiles that only let a given colour through.**

## Accounts

**Login.** This reverses a deliberate decision: the backend has no authentication, chosen rather than overlooked, and anyone with the URL can edit and delete levels today. Everything below depends on it.

**Record who created a level.** The twenty levels that exist have no owner, so this needs a decision about what they belong to.

**Let the overview list your own levels.**

## Statistics

**Count level starts, losses and clears.** Does not need login — these are per level, not per person.

**Record time, redirectors and bounces when a level is cleared.** Per person, so it needs login to mean anything.

**Show your result for a level against everyone else's**, a bar chart or similar.

**Statistics change what a release can destroy.** They accumulate on the live side while nobody is editing locally, and step 3 of a release uploads the local database over the live one — so any play recorded between the pull and the push is lost. Levels are only written when someone is editing, which is why the current flow is safe; statistics are written whenever anyone plays.

# Deferred decisions

## Rendering

**Render at the device's pixel ratio.** Everything draws in CSS pixels, so on a phone with a 3x screen the browser upscales the result and the dot grid goes soft. The canvas buffer would become `innerWidth * devicePixelRatio` with the transform multiplied to match. Deferred on 2026-11-16 to keep the scaling change to one thing at a time; `Canvas.sync()` is where it goes.

**The burner's pulse jumps after a dialogue.** Its phase follows `performance.now()`, and the loop is parked while a dialogue is open, so it resumes wherever the wall clock got to. Following game time instead means `clock` has to hold an accumulated elapsed value that `resync()` does not disturb.

**The title screen shows an empty timer and status panel.** They are visible during dialogues by choice, but at startup no game frame has been drawn yet, so both are blank until the title is dismissed. Drawing one frame before opening the dialogue would fix it.

## Layout

**The tools panel's breakpoint is width-based.** `@media (max-width: 700px)` in `styles.css` moves it above the board, while everything else now decides by orientation through `viewport.landscape`. A landscape phone is narrow in height but wide in width, so the two disagree.

## Game

**Score is always zero.** `GameMode.update` passes a literal `0` to the level-clear dialogue. There is no scoring; the row exists in the dialogue waiting for one.

**The burner is silent.** Every other tile plays something — `playBounce`, `playBell`, `playFragileBounce`. Losing the square to a burner makes no sound at all.

## Robustness

**Losing the API mid-game prints an error every frame.** `fetchNext()` throws inside `GameMode.update`, the loop's `finally` schedules the next frame anyway, and nothing tells the player. A catch belongs around that one API call in `GameMode`, not around the loop body — wrapping the loop would show "no connection" for any bug in `update` or `render`.

**`gameStates` has no `as const`.** `StateName` therefore resolves to `string`, so `enterMode("gaem")` compiles. Adding `as const` snaps the type back to a union with no other change; it was skipped on purpose.

**The database is written on two sides.** Levels are authored locally and in the deployed app, and nothing merges them — the release flow only copies, so whichever side is written second wins. Ids collide, because both files hand out `AUTOINCREMENT` numbers from the same starting point, so a real merge would need level identities that do not come from the row id. See `.claude/commands/release.md`.

## Housekeeping

**The Railway CLI is old.** 5.12.1 against 5.74.1. `railway list` and `railway volume list` return stale data on this version, which is why deletions and new volumes appear to be missing when they are not.

**The Railway project is still called `zooming-enchantment`,** the name it was generated with. The service inside it is `squared`.

**`OverviewMode` dismisses its list manually** before each navigation rather than in a lifecycle hook. Moving it to an `exit()` would be more consistent, but the list would then stay on screen during the level load instead of disappearing first.
