import { BehaviorSubject } from "rxjs";

export class CogFlags {
  private _Z = new BehaviorSubject<boolean>(false);
  private _C = new BehaviorSubject<boolean>(false);

  get Z$() {
    return this._Z.asObservable();
  }

  get C$() {
    return this._C.asObservable();
  }

  get Z() {
    return this._Z.value;
  }
  get C() {
    return this._C.value;
  }

  set Z(value: boolean) {
    this._Z.next(value);
  }

  set C(value: boolean) {
    this._C.next(value);
  }

  clear() {
    this._Z.next(false);
    this._C.next(false);
  }
}
