export class InvalidKeyError extends Error {
    constructor(message: string) {
      super(message); 
      this.name = "InvalidKeyError"; 
  }
}