---
title: The 20 charts every BI, finance and treasury team should master
slug: chart-training-guide
date: 2026-04-24
category: training
tags: Charts, BI, Finance, Treasury, Dashboards, AI Prompts
summary: A quick-pick guide for choosing the right chart, with use cases, warnings, and AI prompts for VS Code and Excel.
readTime: 22 min
featured: false
author: Patrick Zgambo
cover: assets/avatar/chart-tablet.png
---

## The 20 charts every BI, finance and treasury team should master
A quick-pick guide grouped by the question you're trying to answer. Every chart uses data from one running example - the Spring Launch 2026 marketing campaign - and every card gives you the decision rule, the risk, and copy-ready prompts for VS Code and Excel.

## Start here
Use this guide as a working template, not a gallery. Pick the question first, then choose the chart that answers it with the least visual effort.

- **Best for:** BI teams, finance teams, treasury operators, founders, and analysts building dashboards with AI assistance.
- **Output:** One readable chart per business question, plus a prompt you can paste into VS Code, Excel, or Copilot.
- **Template:** Question, when to use it, when to avoid it, then implementation prompts.

## How each card works
Every chart follows the same structure so you can scan fast:

1. **Decision label:** The job the chart does.
2. **Campaign question:** The business question it answers.
3. **Use when:** The situation where this chart is the clearest option.
4. **Avoid when:** The common misuse that makes the chart misleading.
5. **Prompt starter:** A VS Code/Python prompt and an Excel/Copilot prompt.

## The running example: Spring Launch 2026
A 30-day product launch campaign across five paid and owned channels, with a headline target of $500K in attributed revenue. Every chart below uses data from this one campaign - so the story compounds as you scroll.
- **Window:** 30 days, Mar 25 - Apr 23, 2026.
- **Channels:** Paid Search, Paid Social, Email, Organic, Display.
- **Goal:** $500K attributed revenue from a $100K budget.
- **Dataset:** date, channel, creative, impressions, clicks, spend, conversions, revenue, order_value.

## Quick-pick map
- **Headline number:** KPI Tile, Bullet Chart.
- **Change over time:** Line, Area, Combo, Small Multiples.
- **Compare categories:** Bar, Horizontal Bar, Pareto, Radar.
- **Composition and mix:** Donut, Stacked Bar, Treemap.
- **Bridge, flow and stages:** Waterfall, Funnel, Sankey.
- **Distribution and relationships:** Histogram, Box Plot, Scatter Plot, Heatmap.

## Group 1 - Show the headline number
Use when someone asks "how are we doing right now?" One big number per KPI, with the context that tells them whether it's good or bad.

### 01 / HEADLINE KPIs - KPI Tile

```chartdemo kpi
```
A single headline number with context - trend, target, or period comparison. The most-read element on any campaign dashboard.
> **Campaign question:** How is the Spring Launch tracking overall?
**Use when:** Anchoring a campaign dashboard with the 4-6 numbers leadership asks about first: revenue, spend, ROAS, CAC, conversions.
**Avoid when:** You show a number with no target, trend, or comparison. "$428K" alone tells no one whether the campaign is winning or losing.

**Prompt starter:**
```text
VS Code / Python: Write Python using pandas + matplotlib to create a 2x2 KPI card grid from campaign.csv. Cards: Revenue (vs $500K goal), Spend (vs $100K), ROAS (vs 5.0x), CAC (vs $45). Show current value, % of target, up/down arrow, green/red.
```
```text
Excel / Copilot: In Excel: "Build a KPI scorecard at the top of the Dashboard sheet using the Campaign table. Show Revenue, Spend, ROAS, CAC with current value, target, and a colored arrow. Use large font cards, not a chart."
```

### 02 / ACTUAL vs. TARGET - Bullet Chart

```chartdemo bullet
```
A compact KPI bar - actual value, target marker, and qualitative bands (poor / good / excellent) all in one row.
> **Campaign question:** How is each headline metric pacing against its target and its historical range?
**Use when:** Executive scorecards: ROAS, CAC, CVR, CTR - anywhere you want actual-vs-target with context, without a wall of gauges.
**Avoid when:** You don't have clear qualitative bands. Without the bands, a bullet is just a bar.

**Prompt starter:**
```text
VS Code / Python: Use plotly.graph_objects.Indicator with mode="number+gauge" and bullet shape. Build 4 bullets: ROAS, CAC, CVR, CTR. Bands = poor / good / excellent from historical quartiles. Target line from the campaign plan.
```
```text
Excel / Copilot: In Excel: "Build a bullet chart using stacked horizontal bars - 3 light-to-dark gray stacked bars for qualitative bands, a colored overlay bar for actual, and an error bar for the target marker. Repeat for ROAS, CAC, CVR, CTR."
```

## Group 2 - Show change over time
Use when time is the x-axis. Line for trends, Area for cumulative or stacked volume, Combo for a count-plus-rate pair, Small Multiples when you have 5+ series.

### 03 / TREND OVER TIME - Line Chart

```chartdemo line
```
The default for anything measured across continuous time. Clear, honest, and nearly impossible to misread.
> **Campaign question:** How did daily revenue trend across the 30-day window - and are we tracking to goal?
**Use when:** Showing a campaign metric over time - daily revenue, daily clicks, daily ROAS - especially with a reference target line.
**Avoid when:** The x-axis isn't ordered time, or you've crammed more than ~5 channels onto one line chart. Use Small Multiples instead.

**Prompt starter:**
```text
VS Code / Python: Using pandas, group campaign.csv by date and sum revenue. Plot a line chart of daily revenue for the 30-day window. Add a horizontal dashed line at $16,667/day (the $500K / 30 pace). Annotate the best day.
```
```text
Excel / Copilot: In Excel: "From the Campaign table, make a line chart of daily revenue. Add a target line at $16,667. Label the peak day. Format the y-axis as currency."
```

### 04 / CUMULATIVE / STACKED TREND - Area Chart

```chartdemo area
```
Emphasizes magnitude and cumulative totals over time.
> **Campaign question:** How are cumulative conversions building - and which channels are carrying the load?
**Use when:** Showing cumulative conversions, cumulative revenue, or stacked volumes where the channels sum to a meaningful total.
**Avoid when:** Series overlap so much they hide each other - use a regular line chart instead.

**Prompt starter:**
```text
VS Code / Python: From campaign.csv, compute cumulative conversions per channel per day. Stacked area chart, 30 days. Subtle gradient fill, muted grid, legend at bottom.
```
```text
Excel / Copilot: In Excel: "Add a Cumulative Conversions column per channel using a running SUMIFS. Insert a stacked area chart with date on x-axis and each channel stacked."
```

### 05 / COUNT + RATE OVER TIME - Combo (Dual-Axis) Chart

```chartdemo combo
```
Bars for one metric, a line for another - usually a volume and a rate sharing an x-axis.
> **Campaign question:** Did click volume and CTR move together across the 30-day campaign?
**Use when:** Pairing a count and a rate: clicks + CTR, impressions + conversion rate, spend + ROAS.
**Avoid when:** The two metrics aren't related - a dual axis implies a relationship readers will try to interpret.

**Prompt starter:**
```text
VS Code / Python: Matplotlib combo chart: daily clicks as bars (left axis), CTR % as a line (right axis, 0-10%). Shared x-axis across the 30 days. Label both axes clearly.
```
```text
Excel / Copilot: In Excel: "Select Clicks and CTR from the daily Campaign table. Insert a Combo chart: Clicks as Clustered Column, CTR as Line with Secondary Axis. Format CTR as percentage."
```

### 06 / MANY SERIES, SIDE-BY-SIDE - Small Multiples

```chartdemo multiples
```
A grid of miniature charts - one per category - that share the same scale and type. Readers compare shapes, not overlapping lines.
> **Campaign question:** How did daily revenue trend for each channel, side by side?
**Use when:** You'd reach for a line chart with 5+ series. Small multiples solve the spaghetti problem: same x and y scales, one panel per series, easy to scan.
**Avoid when:** Readers need to compare exact values at the same point in time - overlaid lines are better for that single task.

**Prompt starter:**
```text
VS Code / Python: Use matplotlib plt.subplots(1, 5, sharey=True) to build a row of 5 mini line charts - one per channel - plotting daily revenue. Same y-axis across all. Title each panel with the channel name. Muted grid, no legend.
```
```text
Excel / Copilot: In Excel: "Create 5 small line charts in a row on the Dashboard sheet - one per channel - each showing daily revenue. Set identical y-axis min/max across all 5. Remove legends put the channel name in each chart title."
```

## Group 3 - Compare across categories
Use when the question is "which one is biggest, best, or worst?" Bar for a handful of items, Horizontal Bar for rankings and long labels, Pareto for 80/20, Radar for multi-metric comparison.

### 07 / COMPARING A FEW CATEGORIES - Bar / Column Chart

```chartdemo bar
```
The workhorse. Use vertical bars when comparing a handful of categories.
> **Campaign question:** Which channels drove the most conversions?
**Use when:** Comparing performance across a handful of discrete campaign dimensions: channel, region, device, audience segment.
**Avoid when:** Long category names that don't fit horizontally (switch to horizontal bar), or a truncated y-axis that distorts the comparison.

**Prompt starter:**
```text
VS Code / Python: Group campaign.csv by channel and sum conversions. Bar chart, sorted descending, y-axis starts at zero, data labels on each bar. Highlight top channel in accent color.
```
```text
Excel / Copilot: In Excel: "Pivot the Campaign table by channel with sum of conversions, then insert a clustered column chart sorted largest to smallest. Show data labels."
```

### 08 / RANKINGS - Horizontal Bar Chart

```chartdemo horizontal
```
The right choice for rankings and long labels. Readers scan top-to-bottom naturally.
> **Campaign question:** Which ad creatives are converting best - and which should we kill?
**Use when:** Ranking creatives, ad sets, keywords, or audiences - anywhere labels are long and you want the winners to pop.
**Avoid when:** Time is the axis - time should run left-to-right, not top-to-bottom.

**Prompt starter:**
```text
VS Code / Python: From campaign.csv, compute conversion rate per creative (conversions/clicks). Plot top 8 as a horizontal bar chart sorted descending. Highlight top 3 in blue, rest in gray. Show % at end of each bar.
```
```text
Excel / Copilot: In Excel: "From the Campaign table, add a Conv Rate column = conversions/clicks. Insert a bar chart of the top 8 creatives by Conv Rate, sorted descending. Color-code top 3."
```

### 09 / 80/20 ANALYSIS - Pareto Chart

```chartdemo pareto
```
Descending bars with a cumulative percentage line - the canonical "where does 80% of the impact come from?" chart.
> **Campaign question:** Which 20% of creatives are driving 80% of conversions?
**Use when:** Prioritization: which creatives, accounts, products, or issue categories concentrate the value. Finds the "vital few."
**Avoid when:** The distribution is flat - a Pareto implies concentration. If the cumulative line rises linearly, there's no 80/20 story to tell.

**Prompt starter:**
```text
VS Code / Python: Group campaign.csv by creative, sum conversions, sort descending. Bar chart of top 10 creatives with a cumulative-% line on a secondary axis (0-100%). Add a dashed reference line at 80%.
```
```text
Excel / Copilot: In Excel: "Select the Creative and Conversions columns (sorted descending). Insert > Statistic Charts > Pareto. Add a dashed horizontal line at 80% on the secondary axis."
```

### 10 / MULTI-METRIC COMPARISON - Radar / Spider Chart

```chartdemo radar
```
Plots multiple metrics on radial axes so you can compare a small number of entities across many dimensions at once.
> **Campaign question:** Which channel is strongest across Reach, CTR, CVR, ROAS, and Retention - and where are the weak spots?
**Use when:** Comparing 2-4 entities (channels, products, competitors) across 4-8 normalized metrics. Great for finding strengths and gaps.
**Avoid when:** You have more than ~4 overlapping shapes, or metrics aren't normalized to the same scale. The shape becomes meaningless.

**Prompt starter:**
```text
VS Code / Python: Use plotly.graph_objects.Scatterpolar to plot 3 channels (Paid Search, Paid Social, Email) across 5 metrics (Reach, CTR, CVR, ROAS, Retention), each normalized 0-100. Fill='toself', low opacity.
```
```text
Excel / Copilot: In Excel: "From the normalized Channel-Metric matrix (rows = metric, columns = channel, values 0-100), insert a Radar chart (Filled variant). Light fill, 3 series."
```

## Group 4 - Show composition & mix
Use when the question is "what's the breakdown of a whole?" Donut for a simple split, Stacked Bar for composition that shifts across groups or time, Treemap for hierarchies.

### 11 / PARTS OF A WHOLE - Donut / Pie Chart

```chartdemo donut
```
Useful only in small doses - 2 to 5 slices, big differences. The donut leaves room for the total in the center.
> **Campaign question:** How is the $100K budget split across channels?
**Use when:** Communicating budget allocation or channel share when there are only a few slices with clearly different sizes.
**Avoid when:** You have more than 5 slices, or shares are close in size - a bar chart lets people compare precisely.

**Prompt starter:**
```text
VS Code / Python: Donut chart of total spend by channel. Put total spend in the center. Show % on each slice (not in a legend). Don't include channels under 5% - group them as "Other."
```
```text
Excel / Copilot: In Excel: "From the Campaign PivotTable of Spend by Channel, insert a doughnut chart with percentage labels on each slice. Add a text box in the hole showing total spend."
```

### 12 / COMPOSITION ACROSS GROUPS - Stacked Bar Chart

```chartdemo stacked
```
Shows how a total breaks down across segments - and how that mix shifts between groups or time periods.
> **Campaign question:** How did weekly spend break down by channel - and is the mix shifting?
**Use when:** Tracking how spend, impressions, or conversions are split across channels week over week during a campaign.
**Avoid when:** Readers need to compare middle segments precisely - only the bottom and the total are easy to judge.

**Prompt starter:**
```text
VS Code / Python: Group campaign.csv by week and channel, sum spend, then pivot. Stacked bar chart (weeks on x-axis, stacked by channel). Legend at bottom. If the goal is mix shift, switch to 100% stacked.
```
```text
Excel / Copilot: In Excel: "Build a PivotTable of the Campaign table - rows = Week, columns = Channel, values = Sum of Spend. Insert a stacked column chart. Also produce a 100% stacked version to show mix shift."
```

### 13 / HIERARCHICAL PROPORTIONS - Treemap

```chartdemo treemap
```
Nested rectangles sized by value. Best for "show me where the money went" across a hierarchy.
> **Campaign question:** How did spend break down by channel, then by creative within each channel?
**Use when:** Budget allocations with a parent-child structure: channel -> creative, region -> product, portfolio -> position.
**Avoid when:** Too many small rectangles become unreadable. Group the long tail as "Other."

**Prompt starter:**
```text
VS Code / Python: Use plotly.express.treemap on campaign.csv. path = [channel, creative], values = spend, color = conversion_rate. Descending color scale so hot creatives pop.
```
```text
Excel / Copilot: In Excel: "Select the Channel, Creative, Spend columns. Insert > Treemap chart. Group by channel (banner labels), color by channel. Show value labels only on boxes >3%."
```

## Group 5 - Bridge, flow & stages
Use when the question is "how do we get from A to B?" Waterfall bridges two totals, Funnel shows drop-off through sequential stages, Sankey shows flows between categories.

### 14 / GOAL-TO-ACTUAL BRIDGE - Waterfall Chart

```chartdemo waterfall
```
Walks the reader from a starting value to an ending value, showing what added and subtracted along the way.
> **Campaign question:** How do we walk from our $500K revenue goal to the $428K we actually hit - by channel contribution?
**Use when:** Post-campaign recaps: goal-to-actual bridges, budget-to-spend walks, channel-by-channel contributions.
**Avoid when:** More than ~8 steps. Group smaller channels into "Other" so the bridge stays readable.

**Prompt starter:**
```text
VS Code / Python: Waterfall chart from $500K goal to $428K actual. Steps (negative or positive vs. planned): Paid Search, Paid Social, Email, Organic, Display. Green = over-delivered vs plan, red = under. Gray = goal/actual totals.
```
```text
Excel / Copilot: In Excel: "Insert a Waterfall chart (Insert > Waterfall) using the Goal-to-Actual table. Mark the first and last rows as Totals. Color positive values green, negative red."
```

### 15 / CONVERSION STAGES - Funnel Chart

```chartdemo funnel
```
Tapered stages that show drop-off through a multi-step process. Every stage is strictly smaller than the one above it.
> **Campaign question:** How many users drop off at each stage of the purchase funnel?
**Use when:** Visualizing conversion paths - impressions -> clicks -> landing -> add-to-cart -> order. Drop-offs between stages pop visually.
**Avoid when:** Steps aren't strictly sequential, or counts aren't monotonically decreasing - a funnel implies both.

**Prompt starter:**
```text
VS Code / Python: Use plotly.graph_objects.Funnel to build a 5-stage funnel: Impressions, Clicks, Landed, Add-to-Cart, Orders. Pull totals from campaign.csv. Show count and % of previous stage on each bar.
```
```text
Excel / Copilot: In Excel: "From the Funnel summary table (5 rows: Stage, Count), Insert > Funnel chart. Add data labels showing count and % retained from stage 1."
```

### 16 / FLOWS BETWEEN CATEGORIES - Sankey Diagram

```chartdemo sankey
```
Flows between nodes where ribbon width is proportional to volume. Powerful for attribution and path analysis.
> **Campaign question:** Where did traffic come from - and how much of it converted vs. dropped?
**Use when:** Multi-channel attribution, user journey mapping, budget-to-outcome flows, any multi-stage routing where volume matters.
**Avoid when:** Too many nodes - the ribbons overlap and readability collapses. Cap at ~15 nodes total.

**Prompt starter:**
```text
VS Code / Python: Use plotly.graph_objects.Sankey to build a 2-level Sankey: nodes = [5 channels, 2 outcomes (Converted / Not)]. Links from each channel to each outcome weighted by session count.
```
```text
Excel / Copilot: Excel doesn't have a native Sankey. Easiest path: "Use the free Power Query + 3rd-party visual, or export the ChannelxOutcome matrix and render with an online Sankey builder." Copilot prompt: "Prepare the source/target/value table from tbl_Campaign for a Sankey."
```

## Group 6 - Distribution & relationships
Use when the question is "what does the data actually look like?" Histogram for one variable's shape, Box Plot to compare distributions, Scatter to find relationships, Heatmap for 2-D patterns.

### 17 / DISTRIBUTION OF ONE VARIABLE - Histogram

```chartdemo histogram
```
Shows how values of a single variable are distributed - shape, spread, and skew in one picture.
> **Campaign question:** What does the distribution of order values look like - are we getting lots of small orders or a few big ones?
**Use when:** Understanding order-value spread, session duration, time-to-conversion - any single numeric variable.
**Avoid when:** Bin count is too small (hides the shape) or too large (looks random). Start with 15 bins.

**Prompt starter:**
```text
VS Code / Python: Histogram of order_value from campaign.csv using 15 equal-width bins. Draw a vertical line at the median and annotate it. Label axes "Order Value ($)" and "Orders."
```
```text
Excel / Copilot: In Excel: "Using the Orders column, insert a Histogram chart (Insert > Statistic Charts). Set bin width to 20. Add a vertical line at the median value and annotate it."
```

### 18 / COMPARE DISTRIBUTIONS - Box Plot

```chartdemo boxplot
```
Shows median, quartiles, whiskers, and outliers for each category - the right tool when you need to compare distributions, not just averages.
> **Campaign question:** How do order-value distributions differ across channels - and where are the outliers?
**Use when:** Comparing distributions across categories: order value by channel, handle time by region, session duration by device. Exposes skew and outliers an average hides.
**Avoid when:** The audience isn't statistics-fluent. Box plots require explanation the first time - pair with a short legend ("Box = middle 50%, whisker = 1.5x IQR, dots = outliers").

**Prompt starter:**
```text
VS Code / Python: Use seaborn.boxplot on campaign.csv: x = channel, y = order_value. Overlay a stripplot of outliers in a contrasting color. Label axes in dollars and include a note about IQR/whisker method.
```
```text
Excel / Copilot: In Excel: "From the Orders table with Channel and OrderValue columns, Insert > Statistic Charts > Box and Whisker. Show mean marker and outliers. Sort channels by median."
```

### 19 / RELATIONSHIP BETWEEN TWO VARIABLES - Scatter Plot

```chartdemo scatter
```
Reveals correlation, clusters, and outliers between two numeric variables. Bubble size adds a third dimension.
> **Campaign question:** Does higher ad spend correlate with more conversions - and which creatives are outliers?
**Use when:** Exploring spend vs. conversions, impressions vs. CTR, bid vs. win rate - any two campaign metrics that might be related.
**Avoid when:** Fewer than ~15 data points - the pattern won't be visible.

**Prompt starter:**
```text
VS Code / Python: Scatter plot of all 42 creatives: x = spend, y = conversions, bubble size = impressions, color = channel. Add a trendline and label the 3 biggest positive and negative residuals.
```
```text
Excel / Copilot: In Excel: "From the per-creative table, insert a scatter (XY) chart with Spend on x-axis and Conversions on y-axis. Add a linear trendline and label the top 3 and bottom 3 creatives."
```

### 20 / TWO-DIMENSIONAL PATTERNS - Heatmap

```chartdemo heatmap
```
A color-encoded grid that exposes patterns across two dimensions - hot spots and cold spots.
> **Campaign question:** When during the week do conversions peak - by day-of-week and hour?
**Use when:** Finding send-time or ad-schedule patterns: day-of-week x hour, channel x device, audience x creative.
**Avoid when:** Exact values matter - color is approximate. Pair with a table if precision is required.

**Prompt starter:**
```text
VS Code / Python: Use seaborn.heatmap with a pivot of conversions: index = day_of_week, columns = hour_of_day. Sequential blue palette, annotated cells. Add a title "Conversions by day x hour."
```
```text
Excel / Copilot: In Excel: "Make a PivotTable with Day of Week as rows, Hour as columns, Sum of Conversions as values. Apply conditional formatting (color scale, white->blue) to the value cells."
```

## How to use this guide
Start with the question, not the chart type. If a chart does not clarify a decision, downgrade it to a table, KPI tile, or short written note.
