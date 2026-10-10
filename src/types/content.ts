// Контракт контента. UI рендерит строго по этим типам, поэтому добавление
// нового кластера/темы = добавление данных, без правок компонентов.

export type GlossaryItem = {
  term: string;
  definition: string;
};

export type TopicPractice = {
  psychoeducation: string; // «Сказать клиенту»
  mistake: string; // «Частая ошибка»
  red_flags: string; // «Красные флаги»
};

export type Topic = {
  id: string;
  title: string;
  cards: string[]; // Быстрый старт — карточки микрообучения
  longread: string; // Теоретическая база
  practice: TopicPractice; // В кабинете
  glossary: GlossaryItem[];
};

export type TestOption = {
  text: string;
  isCorrect: boolean;
  feedback: string;
};

export type TestQuestion = {
  id: string;
  question: string;
  options: TestOption[];
};

export type ClusterTest = {
  // Порог прохождения: минимум верных ответов. По умолчанию — все.
  passScore?: number;
  questions: TestQuestion[];
};

export type Avatar = {
  name: string;
  case: string;
};

export type Cluster = {
  id: string;
  title: string;
  description: string;
  disclaimer: string;
  avatar: Avatar;
  topics: Topic[];
  test: ClusterTest;
};

// Заготовка будущего кластера для хаба (без контента — только карточка).
export type ClusterStub = {
  id: string;
  title: string;
  description: string;
};

export type TopicStatus = "new" | "progress" | "done";

// Прогресс пользователя — тот же формат в localStorage и в Supabase (JSONB).
export type ProgressData = {
  status: Record<string, TopicStatus>;
  testPassed: Record<string, boolean>;
};
