// COMPASSai — R2 bucket client wrapper
// Source: docs/d1-r2-endpoint-mapping.md Part 2
// TODO (Module 06 build): implement R2 put, get, delete wrappers
// TODO: confirm binding name from d1-r2-endpoint-mapping.md

export interface R2ClientOptions {
  bucket: R2Bucket; // CF Workers R2Bucket binding
}

export class CompassR2Client {
  // TODO: implement per d1-r2-endpoint-mapping.md Part 2
  constructor(_options: R2ClientOptions) {
    throw new Error("NOT IMPLEMENTED — see d1-r2-endpoint-mapping.md");
  }
}
