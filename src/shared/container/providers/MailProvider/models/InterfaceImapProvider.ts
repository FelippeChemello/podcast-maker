export default interface InterfaceMailProvider {
  getEmail(): Promise<string>;
}
