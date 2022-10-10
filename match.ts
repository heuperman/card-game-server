import { getDeck } from "./helpers/db.ts";
import { shuffle } from "./helpers/shuffle.ts";
import { Board, Contestant, Id, Player, Step } from "./types.ts";

export class Match {
  id: Id;
  step: Step;
  activePlayerIndex: number;
  players: Player[];
  board: Board;
  winner: Id | null;

  constructor() {
    this.players = [];
    this.id = crypto.randomUUID();
    this.step = 0;
    this.activePlayerIndex = 0;
    this.board = { lands: [] };
    this.winner = null;
  }

  async initialise(contestants: [Contestant, Contestant]) {
    await Promise.all(
      this.players.map(async (player, index) => {
        const deck = await getDeck(contestants[index].deckId);

        player.id = contestants[index].playerId;
        player.life = 20;
        player.library = shuffle(deck.cards);
        player.graveyard = [];
        player.exile = [];
        player.hand = player.library.splice(0, 7);
      })
    );
  }
}
