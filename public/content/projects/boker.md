---
title: Boker
slug: boker
summary: A lightweight poker tracking web app for recording buy-ins, payouts, and session history through an append-only ledger, with player stats and analytics over time.
label: Project
date: 2026-03-22
status: Active
featured: true
order: 2
github: https://github.com/SowinskiBraeden/boker
tags: Python, Flask, Jinja, Chart.js, CSV, Analytics
---

## Overview

This project reflects my interest in practical software that solves a real problem with a clean and trustworthy data model.

I built it as a web portal for tracking low-stakes poker nights without relying on a spreadsheet. The app includes public-facing statistics pages, per-session and per-player views, and an admin area for recording buy-ins, cash-outs, payouts, and notes. Rather than overwriting records, the system uses an append-only CSV ledger so the full financial history stays visible and easy to audit.

## Focus Areas

- Designing an append-only event ledger for trustworthy record keeping
- Building clear player and session analytics from raw event data
- Creating simple admin tooling for real-world use without unnecessary complexity

## Notes

One of the parts I like most about this project is the storage model. Each row represents an event rather than a final snapshot, which makes rebuys, corrections, payouts, and session changes easier to follow over time. It is a small project, but it reflects how I like to build software: practical, structured, and designed so the data remains easy to trust.
