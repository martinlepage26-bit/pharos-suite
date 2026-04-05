---
name: triangulation
description: Explain triangulation concepts and solve triangulation problems from a known baseline plus two angles or from two sensor coordinates plus bearing angles. Use when Codex needs to compute unknown triangle sides with the Law of Sines, locate a target from two lines of sight, distinguish triangulation from trilateration, or turn angle-and-position inputs into a repeatable CLI calculation.
---

# Triangulation

Use this skill to explain or solve angle-based location problems.

## Core Idea

Triangulation determines an unknown position or distance from known observation points by forming a triangle or by intersecting two lines of sight. It is common in surveying, navigation, radar, astronomy, robotics, computer vision, and sensor networks.

Use triangulation when the inputs are primarily angles.

Do not confuse it with trilateration:

- Triangulation uses angles
- Trilateration uses distances
- GPS is a trilateration example, not a triangulation example

## Choose a Workflow

- If the input gives side `AB` and angles `A` and `B`, run `scripts/triangulation.py triangle`.
- If the input gives `(x1, y1)`, `(x2, y2)`, `theta1`, and `theta2`, run `scripts/triangulation.py target`.
- If the user asks for an explanation only, summarize the geometry first and run the script only if numeric inputs are present.

## Solve a Triangle from One Side and Two Angles

Given:

- Baseline `AB`
- Angle `A`
- Angle `B`

Compute the third angle:

```text
C = 180 - A - B
```

Apply the Law of Sines:

```text
AB / sin(C) = AC / sin(B) = BC / sin(A)
```

Solve for the unknown sides:

```text
AC = AB * sin(B) / sin(C)
BC = AB * sin(A) / sin(C)
```

Run:

```bash
python3 scripts/triangulation.py triangle --ab 10 --angle-a 30 --angle-b 60
```

Validate that:

- `AB` is positive
- `A` and `B` are positive
- `A + B < 180`

## Locate a Target from Two Sensors

Given:

- Sensor 1 at `(x1, y1)` with bearing `theta1`
- Sensor 2 at `(x2, y2)` with bearing `theta2`

The source geometry is:

```text
y - y1 = tan(theta1) * (x - x1)
y - y2 = tan(theta2) * (x - x2)
```

The script solves the equivalent intersection with direction vectors instead of raw tangent slopes so vertical lines and near-parallel cases behave more safely.

By default:

- `theta1` and `theta2` are degrees
- Angles are measured counterclockwise from the positive x-axis

Run:

```bash
python3 scripts/triangulation.py target --x1 0 --y1 0 --x2 10 --y2 0 --theta1 45 --theta2 135
```

If the problem uses compass headings instead of math angles, convert first:

```text
theta_math = 90 - heading_clockwise_from_north
```

Expect an error when:

- The sight lines are parallel or nearly parallel
- The intersection falls behind one of the sensors

## Output

- Use plain text for quick answers
- Add `--json` for machine-readable output

## Script

- `scripts/triangulation.py`: Solve both numeric workflows deterministically
