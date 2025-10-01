export class CogFlags {
  public Z: boolean = false;
  public C: boolean = false;

  clear() {
    this.Z = false;
    this.C = false;
  }
}
