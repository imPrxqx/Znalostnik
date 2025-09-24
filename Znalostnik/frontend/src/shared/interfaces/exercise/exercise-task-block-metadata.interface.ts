export interface BaseBlockMetadata {}

export interface TextBlockMetadata extends BaseBlockMetadata {
  data: { content: string };
}

export interface MultipleChoiceBlockMetadata extends BaseBlockMetadata {
  data: { options: { id: string; content: string }[] };
  solution: { correctOptions: string[] };
}

export interface TrueFalseBlockMetadata extends BaseBlockMetadata {
  data: { options: { true: string; false: string }[] };
  solution: { correctOption: boolean };
}
