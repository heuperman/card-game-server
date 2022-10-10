import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

import { Match } from "./match.ts";
import { Card, Contestant } from "./types.ts";

const queue: Contestant[] = [];

const sendMatchState = (
  contestants: [Contestant, Contestant],
  match: Match
) => {
  contestants.forEach((contestant) => {
    contestant.socket.send(JSON.stringify(match));
  });
};

const handleAction = (message: MessageEvent<unknown>, match: Match) => {
  if (match.step < 12) {
    match.step++;
  } else {
    match.activePlayerIndex = match.activePlayerIndex ? 1 : 0;
    match.step = 0;
  }

  if (match.step === 2) {
    const player = match.players[match.activePlayerIndex];
    if (player.library.length > 0) {
      player.hand.unshift(player.library.pop() as Card);
    }
  }
};

const startMatch = async (contestants: [Contestant, Contestant]) => {
  console.log("starting match");
  const match = new Match();
  await match.initialise(contestants);

  console.log("sending match state");
  sendMatchState(contestants, match);

  contestants.forEach((contestant) => {
    contestant.socket.onmessage = (message) => {
      handleAction(message, match);
      sendMatchState(contestants, match);
    };
  });
};

const checkIsMatchAvailable = async () => {
  if (queue.length >= 2) {
    await startMatch(queue.splice(0, 2) as [Contestant, Contestant]);
  }
};

const app = new Application();
const router = new Router();

router.get("/", (ctx) => {
  if (ctx.isUpgradable) {
    const socket = ctx.upgrade();
    socket.onmessage = async (message) => {
      if (message.data.action === "play") {
        const { playerId, deckId } = message.data;
        queue.push({ socket, playerId, deckId });
        await checkIsMatchAvailable();
      }
    };
  }
});

app.use(oakCors());
app.use(router.routes());

console.info("CORS-enabled web server listening on port 8000");
await app.listen({ port: 8000 });
