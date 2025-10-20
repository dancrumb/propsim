import { useEffect } from "react";
import { EventEmitter } from "tseep";

type EventBusMap = {
  requestDialog: (
    dialogType: string,
    onGoTo: (address: number) => void
  ) => void;
  closeDialog: (dialogType: string) => void;
  stopSimulation: () => void;
};

export class EventBus extends EventEmitter<EventBusMap> {
  private static instance: EventBus;

  private constructor() {
    super();
  }

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public emitEvent(
    event: keyof EventBusMap,
    ...args: Parameters<EventBusMap[typeof event]>
  ): void {
    this.emit(event, ...args);
  }

  public subscribeEvent<K extends keyof EventBusMap>(
    event: K,
    listener: EventBusMap[K]
  ) {
    this.addListener(event, listener);
    return {
      unsubscribe: () => {
        this.removeListener(event, listener);
      },
    };
  }
}

export const useEventBus = <K extends keyof EventBusMap>(
  eventName: K,
  handler: EventBusMap[K]
) => {
  const eventBus = EventBus.getInstance();
  useEffect(() => {
    const { unsubscribe } = eventBus.subscribeEvent(eventName, handler);
    return () => unsubscribe();
  }, [eventName, handler]);
};
