export type Name = string;

export type Status = string;

export type Description = string;

export type Alternatives = Array<Name>;

export type Dependencies = Array<Alternatives>;

export type Info = {
  readonly name: Name;
  readonly status: Status;
  readonly description: Description;
  readonly depends: Dependencies;
};
