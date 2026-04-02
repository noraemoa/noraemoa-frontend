export type BalanceGameConfig = {
  id: number;
  question: string;
  choice_1: BalanceChoice;
  choice_2: BalanceChoice;
};

export type BalanceChoice = {
  choiceText: string;
  choiceKey: string;
};

export const QnA: BalanceGameConfig[] = [
  {
    id: 1,
    question: "더 끌리는 공간은?",
    choice_1: {
      choiceText: "작은 조명 하나 있는 어두운 방",
      choiceKey: "space_dark_room",
    },
    choice_2: {
      choiceText: "탁 트인 밝은 공간",
      choiceKey: "space_bright_open",
    },
  },
  {
    id: 2,
    question: "좋은 걸 발견했을 때 나는?",
    choice_1: {
      choiceText: "혼자 알고 있는 게 좋다",
      choiceKey: "discovery_keep_myself",
    },
    choice_2: {
      choiceText: "바로 공유하고 싶다",
      choiceKey: "discovery_share_now",
    },
  },
  {
    id: 3,
    question: "길을 잃었다면 나는?",
    choice_1: {
      choiceText: "그냥 계속 걷다가 뭔가 발견함",
      choiceKey: "lost_keep_walking",
    },
    choice_2: {
      choiceText: "바로 지도 켜고 최단 경로 찾음",
      choiceKey: "lost_open_map",
    },
  },
  {
    id: 4,
    question: "더 중요한 건?",
    choice_1: { choiceText: "가사", choiceKey: "important_lyrics" },
    choice_2: { choiceText: "멜로디", choiceKey: "important_melody" },
  },
  {
    id: 5,
    question: "더 끌리는 장면은?",
    choice_1: {
      choiceText: "창밖 보면서 혼자 생각하는 장면",
      choiceKey: "scene_window_thinking",
    },
    choice_2: {
      choiceText: "차 안에서 음악 크게 틀고 달리는 장면",
      choiceKey: "scene_drive_loud",
    },
  },
  {
    id: 6,
    question: "날씨 하나만 고른다면?",
    choice_1: {
      choiceText: "비 오는 날, 괜히 감성 충만해지는 타입",
      choiceKey: "weather_rainy",
    },
    choice_2: {
      choiceText: "맑은 날, 이유 없이 기분 좋아지는 타입",
      choiceKey: "weather_sunny",
    },
  },
  {
    id: 7,
    question: "더 나다운 순간은?",
    choice_1: {
      choiceText: "새벽 2시, 갑자기 인생 생각 시작하는 나",
      choiceKey: "moment_2am",
    },
    choice_2: {
      choiceText: "오후 3시, “오늘 뭐하지?” 하면서 괜히 들뜬 나",
      choiceKey: "moment_3pm",
    },
  },
  {
    id: 8,
    question: "길 걸을 때 나는?",
    choice_1: {
      choiceText: "천천히 걸으면서 생각 많아지는 편",
      choiceKey: "walking_slow",
    },
    choice_2: {
      choiceText: "리듬 타면서 거의 뮤직비디오 찍는 편",
      choiceKey: "walking_musicvideo",
    },
  },
];
