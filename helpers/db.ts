import { Deck } from "../types.ts";

export const getDeck = async (deckId: string): Promise<Deck> => {
  const text = await Deno.readTextFile(`./files/decks.json`);
  const decks = JSON.parse(text);
  return decks.find((deck: Deck) => deck.id === deckId);
};
