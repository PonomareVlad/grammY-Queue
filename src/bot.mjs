import {Bot} from "grammy";
import RabbitMQManager from "rabbitmq-management-api";

export const {
    RABBITMQ_USERNAME: username,
    RABBITMQ_PASSWORD: password,
    RABBITMQ_BASE_URL: baseURL,
    TELEGRAM_BOT_TOKEN: token,
    TELEGRAM_SECRET_TOKEN: secretToken = String(token).split(":").pop()
} = process.env;

const manager = new RabbitMQManager({baseURL, auth: {username, password}, https: true});

export const bot = new Bot(token);

bot.command("test", async ctx => {
    const result = await manager.getClusterName();
    console.debug(result);
    return ctx.reply(JSON.stringify(result) || "ok");
});

bot.on("message:text", ctx => ctx.reply(ctx.msg.text));
