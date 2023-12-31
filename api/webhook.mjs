import {bot, secretToken} from "../src/bot.mjs";
import {setWebhookCallback} from "vercel-grammy";

export const config = {runtime: "edge"};

// Handler to set webhook url based on request headers
export default setWebhookCallback(bot, {
    drop_pending_updates: true,
    secret_token: secretToken,
    path: "api/update",
    onError: "return"
});
