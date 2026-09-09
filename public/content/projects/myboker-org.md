---
title: myboker.org
slug: myboker-org
summary: A home poker league tracker with player stats, leaderboards, session history, and settlement tracking. Built around an append-only event ledger and now live as a public web app.
label: Project
date: 2026-06-28
status: Active
featured: true
order: 2
github: https://git.sowinski.dev/SowinskiBraeden/boker
live: https://myboker.org
tags: Python, Flask, Jinja, Chart.js, PostgreSQL, Analytics
---

## Overview

This project started as a small internal tool called Boker for tracking buy-ins and payouts during casual poker nights. It has since grown into [myboker.org](https://myboker.org), a more complete home league tracker that I now run publicly.

The app covers the full workflow: recording sessions, tracking buy-ins and rebuys, calculating settlements and payouts, and surfacing per-player stats and leaderboards over time. There is a public-facing side for players to check standings and session history, and an admin area for managing the actual data entry during and after a game.

The core data model is an append-only event ledger backed by PostgreSQL in production. Every buy-in, rebuy, payout, and correction is recorded as its own event rather than overwriting state, which keeps the full history auditable and makes it straightforward to reconstruct any session at any point.

## Focus Areas

- Designing an append-only event ledger for trustworthy, auditable record keeping
- Building player stats, leaderboards, and session analytics from raw event data
- Handling settlement and payout calculations across variable buy-ins and rebuys
- Creating simple admin tooling that works well in a real-world, low-distraction context

## Notes

The storage model is the part I keep coming back to. Because every action is an event rather than a snapshot, it is easy to trace what happened in a session, catch data entry mistakes, and replay history accurately. It is a genuinely useful tool for a specific problem — nobody wants to manage a poker league in a spreadsheet — and that constraint kept the design grounded throughout.
