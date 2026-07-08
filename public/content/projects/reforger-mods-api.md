---
title: Reforger Mods API
slug: reforger-mods-api
summary: A public, unofficial REST API for Arma Reforger Workshop metadata, built with caching, background refresh jobs, rate limiting, and production reliability in mind.
label: Project
date: 2026-07-06
status: Active
featured: true
order: 1
github: https://github.com/SowinskiBraeden/ReforgerWorkshopAPI
live: https://api.reforgermods.net
tags: Go, REST API, Web Scraping, Observability, Documentation
---

## Overview

The Arma Reforger Workshop is primarily a website, not a developer API. Panels, hosting tools, bots, and dashboards that need structured mod data have no clean way to get it. I built Reforger Mods API to fill that gap.

It is a public REST API, live at [api.reforgermods.net](https://api.reforgermods.net), that fetches and normalizes Workshop metadata into predictable, documented responses for developers. After the most recent relaunch, it started receiving identified traffic from third-party, which makes it one of the first projects I have built that is genuinely used beyond my own stack.

## What It Does

- Search and list Workshop mods with structured, filterable responses
- Retrieve detailed mod metadata normalized from raw Workshop pages
- Cache responses to avoid hammering upstream on repeated lookups
- Serve stale data while background refresh jobs revalidate it
- Return `202 Accepted` on cold cache misses so consumers are not blocked waiting on a full upstream scrape

## Reliability and API Design

A scraper-backed API has an obvious weak point: if the upstream source is slow or flaky, every request suffers. I treated reliability as a first-class concern from the start.

Cached responses return fast. When data is stale, it gets served immediately while a refresh job runs in the background. On a cold miss, the API returns `202 Accepted` with a job reference instead of making the caller wait. Rate limiting and defensive scraper error handling mean that one bad upstream page does not cascade into a broken API response.

Internal metrics track traffic, cache hit rates, refresh job behavior, and errors, so I can actually tell what the service is doing in production rather than guessing.

## Documentation

The API includes public-facing documentation covering all endpoints, response shapes, cache behavior, and how to handle `202 Accepted` responses correctly. Getting the docs right felt important, if external tools are depending on this, they need to be able to understand it without digging through source code.

Live API and docs: [api.reforgermods.net](https://api.reforgermods.net)

## Notes

This project sits at the intersection of a few things I am consistently interested in: backend infrastructure, reliability engineering, and practical tooling for game communities. It is also the first project where I have had to think seriously about backwards compatibility and defensive API design — once external consumers exist, breaking changes have real consequences. That constraint pushed me to build it more carefully than I would have if it were purely internal.
