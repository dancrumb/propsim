import { BehaviorSubject, type Observable } from "rxjs";

export enum WatchLocation {
  Main = -1,
  Cog0 = 0,
  Cog1 = 1,
  Cog2 = 2,
  Cog3 = 3,
  Cog4 = 4,
  Cog5 = 5,
  Cog6 = 6,
  Cog7 = 7,
}

type Watch = {
  watchId: number;
  observable: Observable<{ location: WatchLocation; data: number[] }>;
  location: WatchLocation;
  renderAs: "byte" | "word" | "dword";
};

const rangeOverlaps =
  (rangeA: [number, number]) => (rangeB: [number, number]) => {
    return rangeA[0] <= rangeB[1] && rangeA[1] >= rangeB[0];
  };

export class ObservableBuffer {
  private observers: Map<[number, number], Watch> = new Map();
  private _internal: Buffer;

  constructor(size: number) {
    this._internal = Buffer.alloc(size);
  }

  get length() {
    return this._internal.length;
  }

  watch(
    from: number,
    to: number,
    location: WatchLocation,
    renderAs: "byte" | "word" | "dword"
  ): Observable<{ location: WatchLocation; data: number[] }> {
    if (from < 0 || to >= this._internal.length) {
      throw new Error(
        `Watch range exceeds buffer length. Buffer length: ${this._internal.length}, requested range: [${from}, ${to}]`
      );
    }
    const initialData = this.readRange(from, to, renderAs);
    const observer: Watch = {
      watchId: +Date(),
      observable: new BehaviorSubject<{
        location: WatchLocation;
        data: number[];
      }>({
        location,
        data: [...initialData],
      }),
      location,
      renderAs,
    };
    this.observers.set([from, to], observer);
    return observer.observable;
  }

  private readRange(
    start: number,
    end: number,
    type: "byte" | "word" | "dword"
  ): number[] {
    const values: number[] = [];
    for (let i = start; i <= end; ) {
      let value: number;
      switch (type) {
        case "byte":
          value = this._internal.readUInt8(i);
          i += 1;
          break;
        case "word":
          value = this._internal.readUInt16LE(i);
          i += 2;
          break;
        case "dword":
          value = this._internal.readUInt32LE(i);
          i += 4;
          break;
      }
      values.push(value);
    }
    return values;
  }

  private notifyObservers(offset: number, size: number) {
    const updatedRange: [number, number] = [offset, offset + size - 1];
    const impactedWatches = Array.from(this.observers.keys()).filter(
      rangeOverlaps(updatedRange)
    );
    for (const watchKey of impactedWatches) {
      const watch = this.observers.get(watchKey);
      if (watch) {
        const values: number[] = [];
        for (let i = watchKey[0]; i <= watchKey[1]; ) {
          let value: number;
          switch (watch.renderAs) {
            case "byte":
              value = this._internal.readUInt8(i);
              i += 1;
              break;
            case "word":
              value = this._internal.readUInt16LE(i);
              i += 2;
              break;
            case "dword":
              value = this._internal.readUInt32LE(i);
              i += 4;
              break;
          }
          values.push(value);
        }
        (
          watch.observable as BehaviorSubject<{
            location: WatchLocation;
            data: number[];
          }>
        ).next({
          location: watch.location,
          data: values,
        });
      }
    }
  }

  loadFromBuffer(source: Buffer, offset = 0) {
    source.copy(this._internal, offset);
  }

  at(index: number) {
    return this._internal[index];
  }

  put(index: number, value: number) {
    if (value & 0xffffff00) {
      throw new Error(
        `Value ${value} exceeds byte size. Only values between 0x00 and 0xff are allowed.`
      );
    }
    this._internal[index] = value;
    this.notifyObservers(index, 1);
  }

  writeUInt8(value: number, offset: number) {
    this._internal.writeUInt8(value, offset);
    this.notifyObservers(offset, 1);
  }

  writeUInt16LE(value: number, offset: number) {
    this._internal.writeUInt16LE(value, offset);
    this.notifyObservers(offset, 2);
  }

  writeUInt32LE(value: number, offset: number) {
    this._internal.writeUInt32LE(value, offset);
    this.notifyObservers(offset, 4);
  }

  writeInt32LE(value: number, offset: number) {
    this._internal.writeInt32LE(value, offset);
    this.notifyObservers(offset, 4);
  }

  readUInt8(offset: number): number {
    return this._internal.readUInt8(offset);
  }

  readUInt16LE(offset: number): number {
    return this._internal.readUInt16LE(offset);
  }

  readUInt32LE(offset: number): number {
    return this._internal.readUInt32LE(offset);
  }
}
