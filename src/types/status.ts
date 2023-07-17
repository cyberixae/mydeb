export type PackageId = string;

export type Synopsis = string;

export type EDParagraph = {
  readonly _ED: 'paragraph';
  readonly lines: Array<string>;
};
export type EDVerbatim = {
  readonly _ED: 'verbatim';
  readonly lines: Array<string>;
};
export type EDBlank = {
  readonly _ED: 'blank';
};
export type EDElement = EDParagraph | EDVerbatim | EDBlank;

export type ExtendedDescription = Array<EDElement>;

export type Description = {
  readonly synopsis: Synopsis;
  readonly extended: ExtendedDescription;
};

export type Alternatives = Array<PackageId>;

export type Dependencies = Array<Alternatives>;

export type InstallationStatus = boolean;

export type PackageInfo = {
  readonly packageId: PackageId;
  readonly description: Description;
  readonly dependencies: Dependencies;
  readonly installationStatus: InstallationStatus;
};
export type ReverseDeps = Array<PackageId>;

export type IsAvailable = boolean;
export type DepAvailability = Record<PackageId, IsAvailable>;

export type PackageDetails = {
  readonly info: PackageInfo;
  readonly reverse: ReverseDeps;
  readonly available: DepAvailability;
};

export type PackageResponse = {
  readonly pkg: PackageDetails;
};

export type PackagesResponse = {
  readonly packages: Array<PackageInfo>;
};
