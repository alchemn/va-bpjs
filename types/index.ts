export interface QAItem {
  q: string;
  a: string[];
}

export interface CategoryData {
  title: string;
  question: QAItem[];
}
