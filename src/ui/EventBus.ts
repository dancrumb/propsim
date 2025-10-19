import { EventEmitter } from "tseep";

type EventBusMap = {
  requestDialog: (
    dialogType: string,
    onGoTo: (address: number) => void
  ) => void;
  closeDialog: (dialogType: string) => void;
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
