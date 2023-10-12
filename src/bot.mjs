import {Bot} from "grammy";
import {AMQPWebSocketClient} from "@cloudamqp/amqp-client";

export const {
    AMQP_URL: url,
    TELEGRAM_BOT_TOKEN: token,
    TELEGRAM_SECRET_TOKEN: secretToken = String(token).split(":").pop()
} = process.env;

export const bot = new Bot(token);

bot.command("test", async ctx => {
    const amqp = new AMQPWebSocketClient(url, "/", "guest", "guest");
    const conn = await amqp.connect()
    const ch = await conn.channel()
    const q = await ch.queue()
    const result = await q.publish(ctx.match, {deliveryMode: 2});
    await conn.close();
    return ctx.reply(JSON.stringify(result));
})

bot.on("message:text", ctx => ctx.reply(ctx.msg.text));
