import {
  type Observable,
  catchError,
  lastValueFrom,
  of,
  switchMap,
  take,
  tap,
  timeout,
  TimeoutError,
} from "rxjs";
import { expect } from "vitest";

type StreamEvent<T> =
  | { type: "VALUE"; value: T }
  | { type: "ERROR"; error: unknown }
  | { type: "TIMEOUT" }
  | { type: "COMPLETION" };

export const StreamComplete = { type: "COMPLETION" };
export const StreamTimeout = { type: "TIMEOUT" };

type StreamEmissionEvent<T> = T | typeof StreamComplete | { error: unknown };

type StreamRecorderOptions = {
  timeout?: number;
};

async function streamEmitsInOrder<T>(
  stream$: Observable<T>,
  events: StreamEmissionEvent<T>[],
  options?: StreamRecorderOptions
) {
  const actualEvents: StreamEvent<T>[] = [];

  const timeoutMilliseconds = options?.timeout ?? 2000;

  try {
    const innerStream = stream$.pipe(
      timeout({ each: timeoutMilliseconds }),
      tap({
        next: (valueEvent) =>
          actualEvents.push({ type: "VALUE", value: valueEvent }),
        complete: () => actualEvents.push({ type: "COMPLETION" }),
        error: (e) => {
          if (e instanceof TimeoutError) {
            actualEvents.push({ type: "TIMEOUT" });
          } else {
            actualEvents.push({ error: e, type: "ERROR" });
          }
        },
      })
    );

    const expectingStream = of(0).pipe(
      switchMap(() => innerStream),
      take(events.length),
      catchError(() => of())
    );

    await lastValueFrom(expectingStream);
  } catch {}

  return actualEvents;
}

export function expectEmitsInOrder<T>(
  stream$: Observable<T>,
  events: StreamEmissionEvent<T>[],
  options?: {
    timeout?: number;
  }
) {
  return expect(
    streamEmitsInOrder(stream$, events, options)
  ).resolves.toStrictEqual(streamEmissionEventToStreamEvent(events));
}

function streamEmissionEventToStreamEvent<T>(events: StreamEmissionEvent<T>[]) {
  return events.map((event) => {
    if (event === StreamComplete) {
      return StreamComplete;
    }

    if (typeof event === "object" && event && "error" in event) {
      return { type: "ERROR", error: event.error };
    }

    if (
      typeof event === "object" &&
      event &&
      "type" in event &&
      event.type === "TIMEOUT"
    ) {
      return { type: "TIMEOUT" };
    }

    return { type: "VALUE", value: event };
  });
}
