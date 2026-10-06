---
title: ReforgerMods.net
slug: reforger-mods-api
summary: An API and data platform for the Arma Reforger ecosystem. I built and operate a production API handling 100K+ requests a day, with API key auth, rate limiting, caching, monitoring, third-party integrations, and paying customers.
label: Project
date: 2026-07-06
status: Active
featured: true
order: 1
demo: https://reforgermods.net
tags: Go, REST API, Caching, Rate Limiting, Stripe, Cloudflare, Linux
---

## Overview

The Arma Reforger Workshop doesn't give developers a real API, so anyone building a hosting panel, bot, or dashboard around mod data has had to scrape pages themselves. I built ReforgerMods.net to fix that: a public API and data platform for the Reforger ecosystem, live at [reforgermods.net](https://reforgermods.net).

It started as a small Workshop metadata scraper. It has since grown into a production service with third-party developers and communities depending on it, plus paying customers on top of the free tier. The API handles 100K+ requests a day.

## What It Does

The core is a REST API written in Go (`/v2`, with `/v1` still running for existing integrations) covering:

- Searching and listing Workshop mods, with filtering, sorting, and pagination
- Mod detail lookups, including dependencies and version history
- Server discovery and per-server detail, refreshed roughly every minute
- Population history and other ecosystem data

Full docs, including endpoint references and rate limits, are at [reforgermods.net/api](https://reforgermods.net/api).

## Caching and Reliability

A scraper-backed API falls apart if the upstream source is slow, so caching and refresh behavior got real attention early on. Responses are served from cache against a fresh and a stale TTL. Once data goes stale it's still served immediately while a background job refreshes it, instead of making the caller wait on a live scrape. Cold misses kick off an async refresh job and return a `202 Accepted` with a job reference rather than blocking the request.

Clients get `ETag` support for cheap `304` responses.

## Auth, Rate Limiting, and Tiers

Requests authenticate with API keys, and rate limits are enforced per key. Free, Developer, and Pro tiers each get their own request budget, so the bots, panels, and hosting tools built on top of the API get a higher ceiling as they move up. Paid tiers are handled through Stripe.

## Production and Infrastructure

I run the whole stack myself: Linux VPS administration, systemd services, Caddy as a reverse proxy, Cloudflare in front, and Docker where it makes sense. Parts of the platform run on Cloudflare Workers with R2. Uptime Kuma watches service health, fail2ban handles basic hardening, and internal metrics track traffic, cache hit rate, refresh job status, and request origin (country, client, user agent, path, query) so I can actually see what the service is doing instead of guessing.

The site and the API aren't one monolithic app - they're separate pieces that get deployed and updated independently.

## The Broader Platform

What started as a Workshop API has grown into more of a platform: server indexing, mod/server relationship data, deployment stats, and a handful of admin tools (config generation, dependency checking, hosting calculators). There's also a [desktop launcher](https://github.com/SowinskiBraeden/reforgermods-launcher) for Arma Reforger.

Underneath that sits a separate analytics pipeline: a Go indexer backed by SQLite, and an OCaml worker that handles periodic aggregation - historical server and mod data, exposure and deployment calculations, dependency relationships - then publishes it atomically for the API to read. It runs on systemd timers rather than anything fancier.

One of those aggregation queries got slow enough to notice: a dependency-relationship calculation was taking about 12 minutes per run. The cause was a SQL expression that quietly stopped the index I expected to be used from being used at all. Rewriting it to keep the index in play brought that part of the run down to about 2 seconds.

## Notes

This is the project where I've had to think seriously about what it means to run production software other people depend on - uptime, backwards compatibility, and the fact that breaking changes now have real consequences for people who didn't write the code. It's also the first time I've had actual paying customers for something I built, which changes how carefully I think about reliability and support.
