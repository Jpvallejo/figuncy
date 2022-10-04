import { chromium } from "playwright";
import cron from "node-cron";
import { Telegraf } from "telegraf";
import * as dotenv from "dotenv";

dotenv.config();

try {
  const telegramToken = process.env.TELEGRAM_TOKEN || "";
  const channelId = process.env.CHANNEL_ID || "";

  if (!telegramToken || telegramToken === "") {
    throw new Error("Please provide a token via environment variables");
  }

  const bot = new Telegraf(telegramToken);
  let chatId = 0;

  bot.start((ctx) => {
    chatId = ctx.chat.id;
    ctx.reply("Este bot te avisa si hay figuritas con un mensaje en telegram.");
  });

  const url =
    "https://www.zonakids.com/productos/1-album-tapa-dura-fifa-world-cup-qatar-2022/";

  const toescape = `
  *HAY FIGURITAS\\!\\!*
  HAY STOCK DEL ALBUM TAPA DURA.
  Andá a ${url}
`;

const message = toescape.replace(/\./g, "\\.").replace(/\-/g, "\\-");

  cron.schedule("0,30 * * * * *", async () => {
    console.log(
      `Running on: ${new Date().toLocaleString("es-AR", {
        timeZone: "America/Buenos_Aires",
      })}`
    );

    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const content = await page.inputValue('#product_form input[type="submit"]');
    if (content === "Sin stock") {
      bot.telegram.sendMessage(
        channelId,
        "SIN STOCK",
        {
          parse_mode: "MarkdownV2",
        }
      );
    }
    else {
      bot.telegram.sendMessage(
        channelId,
        message,
        {
          parse_mode: "MarkdownV2",
        }
      );
    }

    await browser.close();
  });

  bot.launch();
  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));

  console.log("bot started!");
}
catch (e) {
  console.log(e);
}
