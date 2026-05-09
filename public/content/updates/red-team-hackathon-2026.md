---
title: 3rd Place at the inaugural Red Team Hackathon
slug: red-team-hackathon-2026
summary: Team Cerberus Gate earned a third-place finish for Find My Force, a prototype that classified RF signals, grouped related receiver readings, and estimated emitter locations using geolocation services.
label: Update
date: 2026-03-12
status: Achievement
featured: true
order: 1
tags: Hackathon, RF, Machine Learning, Geolocation, BCIT
---

## Team Cerberus Gate

At the inaugural Red Team Hackathon, I competed with **Team Cerberus Gate** on the **Find My Force** challenge.

Our team built a prototype for identifying and tracking platforms based on Radio Frequency (RF) emissions. The system combined machine-learning-based signal classification, modulation analysis, observation grouping, and emitter geolocation to turn raw signal readings into more useful tracking information.

## Project

Find My Force was designed around a pipeline that could take RF observations from multiple receivers, classify the signal type and modulation, group related readings together, and estimate where the emitting source was likely located.

The prototype included services for processing IQ signal snapshots, identifying known and unknown signal patterns, associating readings from different receivers, and producing geolocation estimates with uncertainty values. This helped turn separate receiver observations into a clearer picture of potential emitters and their movement over time.

## My Role

My main focus was developing the geolocation services used to estimate emitter positions from grouped receiver observations. I worked on converting receiver latitude and longitude data into a local coordinate system, estimating distance from RSSI values using a path-loss model, and applying weighted least-squares trilateration to produce latitude/longitude estimates with an uncertainty radius.

I also helped with the signal-processing pipeline by assisting with AI classification and the grouping of signal readings. This included supporting the flow from classified observations into associated groups, where readings could be compared by timestamp, predicted label, embedding similarity, RSSI, and time-of-arrival data before being passed into the geolocation system.

## Result

Our team finished **3rd place** and also received the **Best Dressed Award**.

## Why it mattered to me

This was the kind of challenge I enjoy most: ambiguous requirements, technical constraints, short timelines, and a working prototype that had to come together quickly.

It gave me a chance to work on a project that blended backend-style pipeline design, signal analysis, machine learning, and geolocation. I especially enjoyed building practical services that connected raw technical data to a useful result: identifying what a signal might be and where it may have come from.
