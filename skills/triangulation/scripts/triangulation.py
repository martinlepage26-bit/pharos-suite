#!/usr/bin/env python3

import argparse
import json
import math
import sys

EPSILON = 1e-12


def cross(ax, ay, bx, by):
    return ax * by - ay * bx


def format_float(value):
    return f"{value:.6f}".rstrip("0").rstrip(".")


def solve_triangle(ab, angle_a, angle_b):
    if ab <= 0:
        raise ValueError("AB must be positive.")
    if angle_a <= 0 or angle_b <= 0:
        raise ValueError("Angles A and B must be positive.")

    angle_c = 180.0 - angle_a - angle_b
    if angle_c <= 0:
        raise ValueError("A + B must be less than 180 degrees.")

    sin_c = math.sin(math.radians(angle_c))
    if abs(sin_c) < EPSILON:
        raise ValueError("Triangle is degenerate because sin(C) is zero.")

    ac = ab * math.sin(math.radians(angle_b)) / sin_c
    bc = ab * math.sin(math.radians(angle_a)) / sin_c

    return {
        "mode": "triangle",
        "ab": ab,
        "angle_a": angle_a,
        "angle_b": angle_b,
        "angle_c": angle_c,
        "ac": ac,
        "bc": bc,
    }


def solve_target(x1, y1, x2, y2, theta1, theta2):
    theta1_rad = math.radians(theta1)
    theta2_rad = math.radians(theta2)

    d1x = math.cos(theta1_rad)
    d1y = math.sin(theta1_rad)
    d2x = math.cos(theta2_rad)
    d2y = math.sin(theta2_rad)

    # Use vector intersection instead of tangent slopes so vertical lines remain stable.
    denominator = cross(d1x, d1y, d2x, d2y)
    if abs(denominator) < EPSILON:
        raise ValueError("Sight lines are parallel or nearly parallel.")

    delta_x = x2 - x1
    delta_y = y2 - y1

    distance_1 = cross(delta_x, delta_y, d2x, d2y) / denominator
    distance_2 = cross(delta_x, delta_y, d1x, d1y) / denominator

    if distance_1 < -EPSILON or distance_2 < -EPSILON:
        raise ValueError("Bearings do not intersect in front of both sensors.")

    x = x1 + distance_1 * d1x
    y = y1 + distance_1 * d1y

    return {
        "mode": "target",
        "sensor_1": {"x": x1, "y": y1, "theta": theta1},
        "sensor_2": {"x": x2, "y": y2, "theta": theta2},
        "target": {"x": x, "y": y},
        "distance_from_sensor_1": distance_1,
        "distance_from_sensor_2": distance_2,
    }


def build_parser():
    parser = argparse.ArgumentParser(
        description="Solve triangle geometry and 2D triangulation problems."
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    triangle = subparsers.add_parser(
        "triangle",
        help="Solve AC and BC from AB, angle A, and angle B.",
    )
    triangle.add_argument("--ab", type=float, required=True, help="Known side AB.")
    triangle.add_argument("--angle-a", type=float, required=True, help="Angle A in degrees.")
    triangle.add_argument("--angle-b", type=float, required=True, help="Angle B in degrees.")
    triangle.add_argument("--json", action="store_true", help="Print JSON output.")

    target = subparsers.add_parser(
        "target",
        help="Locate a target from two sensor positions and bearing angles.",
    )
    target.add_argument("--x1", type=float, required=True, help="Sensor 1 x-coordinate.")
    target.add_argument("--y1", type=float, required=True, help="Sensor 1 y-coordinate.")
    target.add_argument("--x2", type=float, required=True, help="Sensor 2 x-coordinate.")
    target.add_argument("--y2", type=float, required=True, help="Sensor 2 y-coordinate.")
    target.add_argument("--theta1", type=float, required=True, help="Sensor 1 angle in degrees.")
    target.add_argument("--theta2", type=float, required=True, help="Sensor 2 angle in degrees.")
    target.add_argument("--json", action="store_true", help="Print JSON output.")

    return parser


def print_triangle(result, as_json):
    if as_json:
        print(json.dumps(result, indent=2, sort_keys=True))
        return

    print(f"AB = {format_float(result['ab'])}")
    print(f"A = {format_float(result['angle_a'])} deg")
    print(f"B = {format_float(result['angle_b'])} deg")
    print(f"C = {format_float(result['angle_c'])} deg")
    print(f"AC = {format_float(result['ac'])}")
    print(f"BC = {format_float(result['bc'])}")


def print_target(result, as_json):
    if as_json:
        print(json.dumps(result, indent=2, sort_keys=True))
        return

    print(f"Target x = {format_float(result['target']['x'])}")
    print(f"Target y = {format_float(result['target']['y'])}")
    print(f"Distance from sensor 1 = {format_float(result['distance_from_sensor_1'])}")
    print(f"Distance from sensor 2 = {format_float(result['distance_from_sensor_2'])}")


def main():
    parser = build_parser()
    args = parser.parse_args()

    try:
        if args.command == "triangle":
            result = solve_triangle(args.ab, args.angle_a, args.angle_b)
            print_triangle(result, args.json)
        else:
            result = solve_target(
                args.x1,
                args.y1,
                args.x2,
                args.y2,
                args.theta1,
                args.theta2,
            )
            print_target(result, args.json)
    except ValueError as error:
        print(f"Error: {error}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
