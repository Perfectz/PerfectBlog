from __future__ import annotations

from pathlib import Path

import matplotlib

matplotlib.use("Agg")

import matplotlib.pyplot as plt
import numpy as np
from matplotlib.patches import FancyBboxPatch, Polygon, Rectangle
from matplotlib.path import Path as MplPath
from matplotlib.patches import PathPatch


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "charts"

BG = "#FAFBFC"
PANEL = "#FFFFFF"
GRID = "#DDE5F0"
TEXT = "#172033"
MUTED = "#5F6B7A"
CYAN = "#1B9AAA"
MAGENTA = "#C4457A"
GOLD = "#D59A1A"
GREEN = "#2F9F68"
BLUE = "#4B73D9"
RED = "#D1495B"
ON_ACCENT = "#FFFFFF"

CHANNELS = ["Paid Search", "Paid Social", "Email", "Organic", "Display"]
SHORT = ["Search", "Social", "Email", "Organic", "Display"]
COLORS = [CYAN, MAGENTA, GOLD, GREEN, BLUE]


def setup() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    plt.rcParams.update(
        {
            "font.family": "Arial",
            "font.size": 11,
            "axes.facecolor": BG,
            "figure.facecolor": BG,
            "axes.edgecolor": GRID,
            "axes.labelcolor": MUTED,
            "xtick.color": MUTED,
            "ytick.color": MUTED,
            "text.color": TEXT,
            "axes.titleweight": "bold",
            "axes.titlecolor": TEXT,
            "svg.fonttype": "none",
        }
    )


def save(fig: plt.Figure, name: str) -> None:
    fig.savefig(OUT / f"{name}.svg", format="svg", bbox_inches="tight", facecolor=fig.get_facecolor())
    plt.close(fig)


def style_axis(ax: plt.Axes, title: str, subtitle: str | None = None) -> None:
    ax.set_title(title, loc="left", fontsize=18, pad=18)
    if subtitle:
        ax.text(0, 1.02, subtitle, transform=ax.transAxes, color=MUTED, fontsize=10, va="bottom")
    ax.grid(True, axis="y", color=GRID, alpha=0.5, linewidth=0.8)
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.spines["left"].set_color(GRID)
    ax.spines["bottom"].set_color(GRID)


def add_source(ax: plt.Axes, text: str = "Source: Spring Launch 2026 sample campaign data") -> None:
    ax.text(1, -0.18, text, transform=ax.transAxes, ha="right", color=MUTED, fontsize=9)


def kpi() -> None:
    fig, ax = plt.subplots(figsize=(11.2, 5.6))
    ax.set_axis_off()
    fig.text(0.04, 0.93, "Executive Launch Scorecard", fontsize=21, weight="bold", color=TEXT)
    fig.text(0.04, 0.875, "Spring Launch 2026 is close to revenue target while efficiency needs one more optimization pass.", fontsize=11, color=MUTED)
    metrics = [
        ("Revenue", "$428K", "86% of $500K goal", CYAN),
        ("Spend", "$92K", "92% of budget", MAGENTA),
        ("ROAS", "4.7x", "Target 5.0x", GOLD),
        ("CAC", "$41", "$4 under target", GREEN),
    ]
    for idx, (label, value, note, color) in enumerate(metrics):
        x = 0.045 + idx * 0.237
        card = FancyBboxPatch((x, 0.18), 0.205, 0.53, boxstyle="round,pad=0.018,rounding_size=0.03", transform=ax.transAxes, facecolor=PANEL, edgecolor=GRID, linewidth=1.2)
        ax.add_patch(card)
        ax.text(x + 0.025, 0.61, label.upper(), transform=ax.transAxes, color=MUTED, fontsize=10, weight="bold")
        ax.text(x + 0.025, 0.41, value, transform=ax.transAxes, color=TEXT, fontsize=34, weight="bold")
        ax.plot([x + 0.025, x + 0.18], [0.35, 0.35], transform=ax.transAxes, color=color, lw=3)
        ax.text(x + 0.025, 0.27, note, transform=ax.transAxes, color=MUTED, fontsize=10)
    save(fig, "kpi")


def bullet() -> None:
    fig, ax = plt.subplots(figsize=(11.2, 5.6))
    metrics = [("Revenue", 428, 500, "$428K"), ("Spend", 92, 100, "$92K"), ("ROAS", 4.7, 5.0, "4.7x"), ("CAC", 41, 45, "$41")]
    y = np.arange(len(metrics))[::-1]
    ax.set_xlim(0, 1.2)
    for idx, (label, actual, target, actual_label) in enumerate(metrics):
        yi = y[idx]
        ax.barh(yi, 1.0, color="#26304A", height=0.48)
        ax.barh(yi, 0.72, color="#303B59", height=0.48)
        ax.barh(yi, 0.42, color="#3B4668", height=0.48)
        ax.barh(yi, min(actual / target, 1.08), color=COLORS[idx], height=0.21)
        ax.vlines(1.0, yi - 0.34, yi + 0.34, color=TEXT, linewidth=2.2)
        ax.text(1.12, yi, actual_label, va="center", ha="right", fontsize=11, weight="bold")
    ax.set_yticks(y, [m[0] for m in metrics])
    ax.set_xticks([0, 0.5, 1.0], ["0%", "50%", "Target"])
    style_axis(ax, "Actual vs. Target Pacing", "Bullet charts show target progress without gauge clutter.")
    add_source(ax)
    save(fig, "bullet")


def line() -> None:
    fig, ax = plt.subplots(figsize=(11.2, 5.6))
    days = np.arange(1, 31)
    revenue = 9000 + days * 440 + 3800 * np.sin(days / 3.4) + np.where(days > 21, 4200, 0)
    ax.plot(days, revenue / 1000, color=CYAN, lw=3.2, marker="o", ms=4)
    ax.axhline(16.667, color=MAGENTA, ls="--", lw=2, label="$16.7K/day pace")
    peak = revenue.argmax()
    ax.annotate("Retargeting push", xy=(days[peak], revenue[peak] / 1000), xytext=(days[peak] - 8, revenue[peak] / 1000 + 7), arrowprops={"arrowstyle": "->", "color": MAGENTA}, color=TEXT)
    ax.set_ylabel("Daily revenue ($K)")
    ax.set_xlabel("Campaign day")
    ax.legend(frameon=False, labelcolor=TEXT)
    style_axis(ax, "Daily Revenue Trend", "Revenue clears daily pace late in the campaign after optimization.")
    add_source(ax)
    save(fig, "line")


def area() -> None:
    fig, ax = plt.subplots(figsize=(11.2, 5.6))
    days = np.arange(1, 31)
    series = np.vstack([
        np.cumsum(12 + np.linspace(0, 5, 30)),
        np.cumsum(8 + np.sin(days / 2) * 2 + np.linspace(0, 3, 30)),
        np.cumsum(5 + np.cos(days / 4) * 1.4),
        np.cumsum(4 + np.linspace(0, 2, 30)),
        np.cumsum(2 + np.sin(days / 3)),
    ])
    ax.stackplot(days, series, labels=SHORT, colors=COLORS, alpha=0.78)
    ax.set_ylabel("Cumulative conversions")
    ax.set_xlabel("Campaign day")
    ax.legend(ncol=5, frameon=False, loc="upper left", bbox_to_anchor=(0, -0.12), labelcolor=TEXT)
    style_axis(ax, "Cumulative Conversions by Channel", "Search and social carry the launch, with email compounding steadily.")
    add_source(ax)
    save(fig, "area")


def combo() -> None:
    fig, ax = plt.subplots(figsize=(11.2, 5.6))
    days = np.arange(1, 31)
    clicks = 1800 + days * 55 + 420 * np.sin(days / 3)
    ctr = 3.2 + days * 0.055 + 0.35 * np.sin(days / 4)
    ax.bar(days, clicks, color=CYAN, alpha=0.55, label="Clicks")
    ax2 = ax.twinx()
    ax2.plot(days, ctr, color=MAGENTA, lw=3, label="CTR")
    ax.set_ylabel("Clicks")
    ax2.set_ylabel("CTR %", color=MAGENTA)
    ax.set_xlabel("Campaign day")
    style_axis(ax, "Clicks and CTR Moved Together", "Volume increased without sacrificing click quality.")
    ax2.tick_params(colors=MAGENTA)
    ax2.spines["right"].set_color(GRID)
    add_source(ax)
    save(fig, "combo")


def multiples() -> None:
    fig, axes = plt.subplots(1, 5, figsize=(12.2, 4.9), sharey=True)
    fig.suptitle("Daily Revenue by Channel", x=0.04, ha="left", fontsize=20, weight="bold", color=TEXT)
    fig.text(0.04, 0.88, "Small multiples keep each channel readable while preserving a common scale.", color=MUTED, fontsize=10)
    days = np.arange(1, 31)
    for idx, ax in enumerate(axes):
        values = 6 + days * (0.22 + idx * 0.025) + np.sin(days / (3 + idx)) * (2.2 - idx * 0.18)
        ax.plot(days, values, color=COLORS[idx], lw=2.5)
        ax.fill_between(days, values, values.min() - 1, color=COLORS[idx], alpha=0.16)
        ax.set_title(SHORT[idx], fontsize=11, color=TEXT)
        ax.grid(True, axis="y", color=GRID, alpha=0.45)
        ax.tick_params(labelsize=8)
        for spine in ax.spines.values():
            spine.set_color(GRID)
    axes[0].set_ylabel("Revenue ($K)")
    save(fig, "multiples")


def bar() -> None:
    fig, ax = plt.subplots(figsize=(11.2, 5.6))
    vals = np.array([690, 540, 420, 310, 180])
    bars = ax.bar(SHORT, vals, color=COLORS, alpha=0.88)
    ax.bar_label(bars, labels=[f"{v:,}" for v in vals], padding=4, color=TEXT, fontsize=10)
    ax.set_ylabel("Conversions")
    style_axis(ax, "Conversions by Channel", "Paid search is the largest conversion source, followed by paid social.")
    add_source(ax)
    save(fig, "bar")


def horizontal() -> None:
    fig, ax = plt.subplots(figsize=(11.2, 5.6))
    labels = ["Neon launch A", "Retro CTA", "Synth founder cut", "Product loop 07", "Static carousel", "Offer test B"]
    vals = np.array([9.8, 8.7, 7.9, 6.4, 5.8, 4.6])
    y = np.arange(len(labels))
    ax.barh(y, vals, color=[CYAN, CYAN, CYAN, "#3A435C", "#3A435C", "#3A435C"])
    ax.set_yticks(y, labels)
    ax.invert_yaxis()
    ax.set_xlabel("Conversion rate")
    ax.xaxis.set_major_formatter(lambda x, pos: f"{x:.0f}%")
    for yi, value in zip(y, vals):
        ax.text(value + 0.15, yi, f"{value:.1f}%", va="center", color=TEXT)
    style_axis(ax, "Creative Conversion Ranking", "The top three creatives deserve budget protection.")
    add_source(ax)
    save(fig, "horizontal")


def pareto() -> None:
    fig, ax = plt.subplots(figsize=(11.2, 5.6))
    labels = [f"C{i}" for i in range(1, 11)]
    vals = np.array([210, 160, 125, 86, 65, 54, 43, 38, 30, 24])
    cum = vals.cumsum() / vals.sum() * 100
    ax.bar(labels, vals, color=CYAN, alpha=0.74)
    ax2 = ax.twinx()
    ax2.plot(labels, cum, color=MAGENTA, marker="o", lw=3)
    ax2.axhline(80, color=GOLD, ls="--", lw=2)
    ax2.set_ylim(0, 105)
    ax.set_ylabel("Conversions")
    ax2.set_ylabel("Cumulative share", color=MAGENTA)
    style_axis(ax, "Creative Pareto Analysis", "Four creatives generate roughly 80% of conversions.")
    add_source(ax)
    save(fig, "pareto")


def radar() -> None:
    labels = ["Reach", "CTR", "CVR", "ROAS", "Retention"]
    values_a = np.array([88, 72, 68, 82, 64])
    values_b = np.array([70, 82, 60, 66, 74])
    angles = np.linspace(0, 2 * np.pi, len(labels), endpoint=False)
    values_a = np.r_[values_a, values_a[0]]
    values_b = np.r_[values_b, values_b[0]]
    angles = np.r_[angles, angles[0]]
    fig, ax = plt.subplots(figsize=(8.4, 6.4), subplot_kw={"polar": True})
    ax.set_facecolor(BG)
    ax.plot(angles, values_a, color=CYAN, lw=2.8, label="Paid Search")
    ax.fill(angles, values_a, color=CYAN, alpha=0.18)
    ax.plot(angles, values_b, color=MAGENTA, lw=2.8, label="Paid Social")
    ax.fill(angles, values_b, color=MAGENTA, alpha=0.15)
    ax.set_xticks(angles[:-1], labels)
    ax.set_yticks([25, 50, 75, 100], ["25", "50", "75", "100"], color=MUTED)
    ax.tick_params(colors=MUTED)
    ax.grid(color=GRID)
    ax.set_title("Channel Strength Profile", loc="left", pad=24, fontsize=18, color=TEXT, weight="bold")
    ax.legend(frameon=False, loc="upper right", bbox_to_anchor=(1.18, 1.12), labelcolor=TEXT)
    save(fig, "radar")


def donut() -> None:
    fig, ax = plt.subplots(figsize=(9.2, 6.2))
    vals = [42, 27, 18, 8, 5]
    wedges, _ = ax.pie(vals, colors=COLORS, startangle=90, wedgeprops={"width": 0.36, "edgecolor": BG})
    ax.text(0, 0.04, "$428K", ha="center", va="center", fontsize=28, weight="bold")
    ax.text(0, -0.16, "Total revenue", ha="center", va="center", color=MUTED, fontsize=11)
    ax.legend(wedges, [f"{c} - {v}%" for c, v in zip(SHORT, vals)], frameon=False, loc="center left", bbox_to_anchor=(1, 0.5), labelcolor=TEXT)
    ax.set_title("Revenue Mix by Channel", loc="left", pad=18, fontsize=18, weight="bold")
    save(fig, "donut")


def stacked() -> None:
    fig, ax = plt.subplots(figsize=(11.2, 5.6))
    weeks = ["W1", "W2", "W3", "W4"]
    data = np.array([[180, 220, 260, 310], [130, 160, 190, 230], [80, 110, 140, 170], [60, 70, 90, 120], [36, 48, 56, 78]])
    bottom = np.zeros(4)
    for label, values, color in zip(SHORT, data, COLORS):
        ax.bar(weeks, values, bottom=bottom, label=label, color=color, alpha=0.82)
        bottom += values
    ax.set_ylabel("Conversions")
    ax.legend(ncol=5, frameon=False, loc="upper left", bbox_to_anchor=(0, -0.12), labelcolor=TEXT)
    style_axis(ax, "Weekly Conversion Build", "Every channel adds to the total, with search widening its lead.")
    add_source(ax)
    save(fig, "stacked")


def treemap() -> None:
    fig, ax = plt.subplots(figsize=(11.2, 5.8))
    ax.set_axis_off()
    fig.text(0.04, 0.93, "Budget Allocation Treemap", fontsize=20, weight="bold", color=TEXT)
    fig.text(0.04, 0.875, "Paid channels consume most spend; owned channels contribute leverage at lower cost.", color=MUTED, fontsize=10)
    rects = [
        (0.05, 0.18, 0.46, 0.62, "Paid Search\n$42K", CYAN),
        (0.53, 0.18, 0.29, 0.36, "Paid Social\n$27K", MAGENTA),
        (0.53, 0.56, 0.19, 0.24, "Email\n$18K", GOLD),
        (0.74, 0.56, 0.18, 0.24, "Organic\n$8K", GREEN),
        (0.84, 0.18, 0.08, 0.36, "Display\n$5K", BLUE),
    ]
    for x, y, w, h, label, color in rects:
        ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.008,rounding_size=0.015", transform=ax.transAxes, facecolor=color, alpha=0.82, edgecolor=BG, linewidth=2))
        ax.text(x + 0.02, y + h - 0.08, label, transform=ax.transAxes, color=ON_ACCENT, fontsize=13, weight="bold", va="top")
    save(fig, "treemap")


def waterfall() -> None:
    fig, ax = plt.subplots(figsize=(11.2, 5.6))
    labels = ["Gross revenue", "Refunds", "Discounts", "Shipping", "Net revenue"]
    changes = [500, -28, -44, 12, 440]
    starts = [0, 500, 472, 428, 0]
    colors = [CYAN, RED, RED, GREEN, GOLD]
    for i, (start, change, color) in enumerate(zip(starts, changes, colors)):
        bottom = min(start, start + change) if i < 4 else 0
        height = abs(change)
        ax.bar(i, height, bottom=bottom, color=color, alpha=0.82)
        ax.text(i, bottom + height + 12, f"${change:+.0f}K" if i not in [0, 4] else f"${change:.0f}K", ha="center", color=TEXT, weight="bold")
    ax.set_xticks(range(len(labels)), labels, rotation=12, ha="right")
    ax.set_ylabel("$K")
    style_axis(ax, "Revenue Bridge to Net", "A CFO-friendly bridge from gross launch revenue to net contribution.")
    add_source(ax)
    save(fig, "waterfall")


def funnel() -> None:
    fig, ax = plt.subplots(figsize=(9.8, 6.2))
    ax.set_axis_off()
    fig.text(0.05, 0.92, "Launch Conversion Funnel", fontsize=20, weight="bold", color=TEXT)
    fig.text(0.05, 0.865, "Each stage shows the key volume leaders need to protect.", color=MUTED, fontsize=10)
    stages = [("Impressions", "1.2M", 0.86, CYAN), ("Clicks", "84K", 0.68, MAGENTA), ("Trials", "9.6K", 0.48, GOLD), ("Orders", "2.4K", 0.30, GREEN)]
    for i, (label, value, width, color) in enumerate(stages):
        y = 0.68 - i * 0.14
        x0 = 0.5 - width / 2
        poly = Polygon([[x0, y], [x0 + width, y], [x0 + width - 0.04, y - 0.09], [x0 + 0.04, y - 0.09]], closed=True, transform=ax.transAxes, facecolor=color, alpha=0.82, edgecolor=BG, linewidth=2)
        ax.add_patch(poly)
        ax.text(0.5, y - 0.048, f"{label}  |  {value}", transform=ax.transAxes, ha="center", va="center", color=ON_ACCENT, fontsize=13, weight="bold")
    save(fig, "funnel")


def sankey() -> None:
    fig, ax = plt.subplots(figsize=(11.2, 5.6))
    ax.set_axis_off()
    fig.text(0.04, 0.93, "Spend to Revenue Flow", fontsize=20, weight="bold", color=TEXT)
    fig.text(0.04, 0.875, "Sankey-style flow highlights where spend turns into the most attributed revenue.", color=MUTED, fontsize=10)

    def flow(y0, y1, width, color):
        verts = [(0.18, y0), (0.38, y0), (0.56, y1), (0.78, y1)]
        codes = [MplPath.MOVETO, MplPath.CURVE4, MplPath.CURVE4, MplPath.CURVE4]
        patch = PathPatch(MplPath(verts, codes), transform=ax.transAxes, lw=width, edgecolor=color, facecolor="none", alpha=0.45, capstyle="round")
        ax.add_patch(patch)

    flow(0.62, 0.70, 44, CYAN)
    flow(0.48, 0.48, 32, MAGENTA)
    flow(0.34, 0.27, 22, GOLD)
    nodes = [(0.08, 0.36, 0.15, 0.34, "Spend\n$92K", PANEL), (0.76, 0.64, 0.16, 0.12, "Search\n$180K", CYAN), (0.76, 0.42, 0.16, 0.12, "Social\n$116K", MAGENTA), (0.76, 0.20, 0.16, 0.12, "Email\n$77K", GOLD)]
    for x, y, w, h, label, color in nodes:
        ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.014,rounding_size=0.02", transform=ax.transAxes, facecolor=color, edgecolor=GRID, linewidth=1.2))
        ax.text(x + w / 2, y + h / 2, label, transform=ax.transAxes, ha="center", va="center", color=TEXT if color == PANEL else ON_ACCENT, weight="bold")
    save(fig, "sankey")


def histogram() -> None:
    rng = np.random.default_rng(7)
    values = rng.gamma(4.2, 26, 500) + 35
    fig, ax = plt.subplots(figsize=(11.2, 5.6))
    ax.hist(values, bins=18, color=CYAN, alpha=0.76, edgecolor=BG)
    ax.axvline(values.mean(), color=MAGENTA, ls="--", lw=2.4, label=f"Mean ${values.mean():.0f}")
    ax.set_xlabel("Order value")
    ax.set_ylabel("Orders")
    ax.legend(frameon=False, labelcolor=TEXT)
    style_axis(ax, "Order Value Distribution", "Most orders cluster below $175, with a profitable high-value tail.")
    add_source(ax)
    save(fig, "histogram")


def boxplot() -> None:
    rng = np.random.default_rng(9)
    data = [rng.normal(126 + i * 14, 24 + i * 3, 120) for i in range(5)]
    fig, ax = plt.subplots(figsize=(11.2, 5.6))
    bp = ax.boxplot(data, patch_artist=True, tick_labels=SHORT, medianprops={"color": TEXT, "linewidth": 2})
    for patch, color in zip(bp["boxes"], COLORS):
        patch.set_facecolor(color)
        patch.set_alpha(0.58)
        patch.set_edgecolor(color)
    for item in bp["whiskers"] + bp["caps"]:
        item.set_color(MUTED)
    ax.set_ylabel("Order value")
    style_axis(ax, "Order Value Spread by Channel", "Email and search produce the highest median order values.")
    add_source(ax)
    save(fig, "boxplot")


def scatter() -> None:
    rng = np.random.default_rng(4)
    spend = rng.uniform(2, 18, 36)
    revenue = spend * rng.uniform(3.2, 6.4, 36) + rng.normal(0, 6, 36)
    roas = revenue / spend
    fig, ax = plt.subplots(figsize=(11.2, 5.6))
    sc = ax.scatter(spend, revenue, c=roas, cmap="cool", s=90, alpha=0.86, edgecolor=BG)
    ax.set_xlabel("Spend ($K)")
    ax.set_ylabel("Revenue ($K)")
    cb = fig.colorbar(sc, ax=ax)
    cb.set_label("ROAS")
    cb.ax.yaxis.label.set_color(MUTED)
    cb.ax.tick_params(colors=MUTED)
    style_axis(ax, "Creative Spend vs Revenue", "Bubble color exposes the creative units that scale profitably.")
    add_source(ax)
    save(fig, "scatter")


def heatmap() -> None:
    matrix = np.array([
        [4.7, 5.1, 5.3, 4.9, 5.8, 6.1, 5.7],
        [3.8, 4.0, 4.4, 4.1, 4.7, 5.0, 4.8],
        [6.2, 6.5, 6.0, 5.8, 6.4, 6.8, 6.6],
        [5.0, 5.2, 4.9, 5.4, 5.6, 5.7, 5.5],
        [2.8, 3.0, 3.1, 2.9, 3.2, 3.4, 3.3],
    ])
    fig, ax = plt.subplots(figsize=(11.2, 5.6))
    im = ax.imshow(matrix, cmap="magma", aspect="auto")
    ax.set_xticks(range(7), ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"])
    ax.set_yticks(range(5), SHORT)
    for i in range(matrix.shape[0]):
        for j in range(matrix.shape[1]):
            ax.text(j, i, f"{matrix[i, j]:.1f}x", ha="center", va="center", color=TEXT if matrix[i, j] < 5.7 else BG, fontsize=9, weight="bold")
    cb = fig.colorbar(im, ax=ax)
    cb.set_label("ROAS")
    cb.ax.yaxis.label.set_color(MUTED)
    cb.ax.tick_params(colors=MUTED)
    ax.set_title("ROAS Heatmap by Channel and Day", loc="left", fontsize=18, pad=18, weight="bold")
    save(fig, "heatmap")


def main() -> None:
    setup()
    for fn in [
        kpi,
        bullet,
        line,
        area,
        combo,
        multiples,
        bar,
        horizontal,
        pareto,
        radar,
        donut,
        stacked,
        treemap,
        waterfall,
        funnel,
        sankey,
        histogram,
        boxplot,
        scatter,
        heatmap,
    ]:
        fn()
    print(f"Generated {len(list(OUT.glob('*.svg')))} chart SVGs in {OUT}")


if __name__ == "__main__":
    main()
