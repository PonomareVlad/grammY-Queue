import "grammy-debug-edge";
import {Bot} from "grammy";

export const {
    TELEGRAM_BOT_TOKEN: token,
    TELEGRAM_SECRET_TOKEN: secretToken = String(token).split(":").pop(),
    RABBITMQ_EXCHANGE: exchange = "amq.default",
    RABBITMQ_USERNAME: username,
    RABBITMQ_PASSWORD: password,
    RABBITMQ_API_URL: url,
    RABBITMQ_VHOST: vhost
} = process.env;

export const bot = new Bot(token);

const safe = bot.errorBoundary(console.error);

safe.command("test", async ctx => {
    const result = await publishToQueue({
        payload: ctx.match,
        routing_key: "test",
        exchange: "test",
    });
    return ctx.reply(JSON.stringify(result) || "ok");
});

safe.on("message:text", ctx => ctx.reply(ctx.msg.text));

async function publishToQueue({properties = {}, routing_key, payload, payload_encoding = "string"} = {}) {
    const {href} = new URL(`/api/exchanges/${vhost}/${exchange}/publish`, url);
    const response = await fetch(href, {
        body: JSON.stringify({payload, payload_encoding, routing_key, properties}),
        headers: {
            "Authorization": `Basic ${btoa([username, password].join(":"))}`,
            "Content-Type": "application/json"
        },
        method: "POST"
    });
    const result = await response.text();
    try {
        const {routed} = JSON.parse(result);
        return routed || false;
    } catch {
        throw new Error(result);
    }
}
