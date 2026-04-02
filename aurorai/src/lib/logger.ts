// Structured log emitter — AurorA
// Outputs JSON to console for CF Workers log viewer

export function log(
  level: "info" | "warn" | "error",
  message: string,
  context?: Record<string, unknown>,
): void {
  const entry: Record<string, unknown> = {
    level,
    message,
    timestamp: new Date().toISOString(),
  };

  if (context) {
    for (const [key, value] of Object.entries(context)) {
      if (key === "error" && value instanceof Error) {
        entry[key] = {
          name: value.name,
          message: value.message,
          stack: value.stack,
        };
      } else {
        entry[key] = value;
      }
    }
  }

  console.log(JSON.stringify(entry));
}
