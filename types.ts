export type Id = string;

/**
 * 0: "untap",
 * 1: "upkeep",
 * 2: "draw",
 * 3: "pre-combat main phase",
 * 4: "beginning of combat",
 * 5: "declare attackers",
 * 6: "declare blockers",
 * 7: "combat damage first strike",
 * 8: "combat damage regular",
 * 9: "end of combat",
 * 10: "post-combat main phase",
 * 11: "end",
 * 12: "cleanup",
 */
export type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type Card = {
  id: Id;
  name: string;
  type: "creature" | "land";
  subtypes?: string[];
  supertype?: string;
  power?: number;
  toughness?: number;
  state: {
    tapped: boolean;
    owner?: Id;
    controller?: Id;
  };
};

export type Player = {
  id: Id;
  deckId: Id;
  life: number;
  hand: Card[];
  library: Card[];
  graveyard: Card[];
  exile: Card[];
};

export type Board = {
  lands: Card[];
};

export type Contestant = { socket: WebSocket; playerId: Id; deckId: Id };

export type Deck = { id: Id; cards: Card[] };
