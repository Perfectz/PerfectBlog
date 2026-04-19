---
title: Prompt scaffolding 101
slug: prompt-scaffolding-101
date: 2026-03-28
category: training
tags: Prompting, Training, Agents
summary: The four-layer scaffold I use before turning a prompt into a repeatable workflow.
readTime: 11 min
featured: false
author: Patrick Zgambo
cover: assets/sunglasses.png
---

## The scaffold

Most weak prompts fail because they ask the model to infer the job, the context, the constraints, and the output format at the same time.

I use four layers:

1. Role: what job is the model doing?
2. Context: what facts does it need?
3. Rules: what must it avoid?
4. Output: what shape should the answer take?

## A useful baseline

```text
ROLE:
You are a careful editor.

CONTEXT:
You are revising a short technical note for founders.

RULES:
Keep claims precise. Do not add new facts.

OUTPUT:
Return a revised version and a short change list.
```

## Why it matters

The scaffold is not magic. It simply makes the invisible decisions visible. Once visible, they can be tested, changed, and reused.
