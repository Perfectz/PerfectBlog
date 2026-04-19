---
title: Voice-trained CRM in one weekend
slug: voice-trained-crm
date: 2026-04-12
category: usecases
tags: AI, CRM, Whisper, Local LLM
summary: Talk to your contacts list, get summaries, schedule follow-ups, and learn where voice-first AI workflows break.
readTime: 14 min
featured: true
author: Patrick Zgambo
cover: assets/storyboard.jpeg
---

## The premise

My CRM was a graveyard: a spreadsheet full of investors, students, ex-coworkers, and people I met once at events. The problem was not the contacts. The problem was the fifteen seconds after meeting someone, when the useful context starts evaporating.

So I gave myself a weekend and one rule: I would not touch the keyboard. I had to talk to the CRM, and it had to talk back.

> The CRM is not the spreadsheet. The CRM is the moment between meeting someone and forgetting why they mattered.

## The stack

- Whisper.cpp for local speech-to-text
- A small local model for extraction and action selection
- SQLite for people, touches, and follow-up intents
- A tiny menu-bar recorder that captured ten-second voice notes

The goal was not production polish. The goal was speed, privacy, and learning where the workflow cracked.

```bash
git clone https://github.com/ggerganov/whisper.cpp
cd whisper.cpp && make -j
./models/download-ggml-model.sh base.en
```

## The prompt split

The key move was splitting the model work into two prompts. The first prompt extracted facts without opinions. The second prompt chose the next action.

```text
ROLE: Extractor.
Return JSON only.
Do not infer facts that are not present.
```

That made the system less flashy and much more reliable. Clever prompts demo well; boring prompts survive Tuesday.

## What broke

1. Whisper hallucinated during silence.
2. Names with similar sounds merged into the same contact.
3. Pronouns drifted when I spoke about more than one person.
4. I kept wanting the schema to be perfect before I had enough examples.

The fix was a rigid spine and a soft body: stable tables for people and touches, plus flexible fact arrays that could evolve as I learned.

## What to steal

- Split extraction from action.
- Treat local-first as a design constraint.
- Store raw transcripts, extracted facts, and model decisions separately.
- Make the system useful before making it clever.

Next version lives on my phone, syncs when I am home, and reads the last three touches before a meeting.
