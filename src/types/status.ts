export type Name = string;

export type Status = string;

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

export type Alternatives = Array<Name>;

export type Dependencies = Array<Alternatives>;

export type Info = {
  readonly name: Name;
  readonly status: Status;
  readonly description: Description;
  readonly depends: Dependencies;
};
