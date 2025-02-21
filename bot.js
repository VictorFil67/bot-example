import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import { commands } from "./commands.js";
import fs from "fs";
import { error } from "console";
import { type } from "os";

dotenv.config();
const { API_KEY_BOT, URL_TO_BOT, URL_TO_IMG, CONTACT } = process.env;

const bot = new TelegramBot(API_KEY_BOT, {
  polling: { interval: 300, autoStart: true },
});

// bot.on("polling_error", (err) => err.data.error.message);
//**1**
// bot.on("text", async (msg) => {
//   try {
//     if (msg.text === "/start") {
//       console.log(msg);
//       await bot.sendMessage(msg.chat.id, "You lunched the bot");
//     } else if (msg.text === "/ref") {
//       console.log(msg);
//       await bot.sendMessage(msg.chat.id, `${URL_TO_BOT}?start=${msg.from.id}`);
//     } else {
//       const msgWait = await bot.sendMessage(
//         msg.chat.id,
//         "The bot is generation the request..."
//       );
//       setTimeout(async () => {
//         await bot.editMessageText(msg.text, {
//           chat_id: msgWait.chat.id,
//           message_id: msgWait.message_id,
//         });
//         await bot.deleteMessage(msgWait.chat.id, msgWait.message_id);
//         await bot.sendMessage(msg.chat.id, msg.text);
//       }, 3000);
//     }
//   } catch (error) {
//     console.log(error.message);
//   }
// });
//**2**
let firstNum = 0;
let secondNum = 0;
let regexp = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
let text = "";

bot.on("text", async (msg) => {
  try {
    if (msg.text.startsWith("/start")) {
      await bot.sendMessage(msg.chat.id, "You lunched the bot 👋");

      if (msg.text.length > 6) {
        const refID = msg.text.slice(7);
        await bot.sendMessage(
          msg.chat.id,
          `You have entered the user's link with ID ${refID}`
        );
      }
    } else if (msg.text === "/ref") {
      await bot.sendMessage(msg.chat.id, `${URL_TO_BOT}?start=${msg.from.id}`);
    } else if (
      !isNaN(parseInt(msg.text)) &&
      firstNum === 0 &&
      text != "Enter your email" &&
      text != "Enter your password"
    ) {
      console.log("text: ", text);
      console.log(parseInt(msg.text));
      firstNum = parseInt(msg.text);
      await bot.sendMessage(msg.chat.id, "Enter anothe number");
    } else if (
      !isNaN(parseInt(msg.text)) &&
      firstNum !== 0 &&
      text != "Enter your email" &&
      text != "Enter your password"
    ) {
      console.log("text: ", text);
      console.log(parseInt(msg.text));
      secondNum = parseInt(msg.text);
      let sum = firstNum + secondNum;
      await bot.sendMessage(msg.chat.id, `The sum is ${sum}`);
      firstNum = 0;
      secondNum = 0;
    } else if (msg.text == "/help") {
      await bot.sendMessage(
        msg.chat.id,
        `Раздел помощи HTML\n\n<b>Жирный Текст</b>\n<i>Текст Курсивом</i>\n<code>Текст с Копированием</code>\n<s>Перечеркнутый текст</s>\n<u>Подчеркнутый текст</u>\n<pre language='c++'>код на c++</pre>\n<a href='t.me'>Гиперссылка</a>`,
        {
          parse_mode: "HTML",
        }
      );
    } else if (msg.text == "/x") {
      await bot.sendMessage(msg.chat.id, `https://2ip.ua/ru/`, {
        // disable_web_page_preview: true,
        disable_notification: true,
      });
    } else if (msg.text == "/keyboard_menu") {
      await bot.sendMessage(msg.chat.id, `Bot's menu`, {
        reply_markup: {
          keyboard: [
            ["⭐️ Picture", "⭐️ Video"],
            ["⭐️ Audio", "⭐️ Voice message"],
            [
              { text: "⭐️ Contact", request_contact: true },
              { text: "⭐️ Geolocation", request_location: true },
            ],
            ["❌ Close menu"],
          ],
          resize_keyboard: true,
        },
      });
    } else if (msg.text == "❌ Close menu") {
      await bot.sendMessage(msg.chat.id, "Menu is closed", {
        reply_markup: {
          remove_keyboard: true,
        },
      });
    } else if (msg.text == "⭐️ Picture") {
      await bot.sendPhoto(msg.chat.id, URL_TO_IMG, { caption: "Avatar" }); //by link
      await bot.sendPhoto(msg.chat.id, "./Gold.jpg", {
        caption: "<b>Gold</b>",
        parse_mode: "HTML",
      }); //by path
      //by Readable Stream
      const imageStream = fs.createReadStream("./Gold&Sjnya_fireplace.jpg");
      await bot.sendPhoto(msg.chat.id, imageStream);
      //by buffer
      const imageBuffer = fs.readFileSync("./Cool_dogs.png");
      await bot.sendPhoto(msg.chat.id, imageBuffer);
    } else if (msg.text == "⭐️ Video") {
      await bot.sendVideo(msg.chat.id, "./video/VID-20240426-WA0000.mp4", {
        caption: "<b>My Friends</b>",
        parse_mode: "HTML",
      });
    } else if (msg.text == "⭐️ Audio") {
      await bot.sendAudio(msg.chat.id, "./Машина Времени - Поворот.mp3", {
        caption: "<b>⭐️Audio</b>",
        parse_mode: "HTML",
      });
    } else if (msg.text == "⭐️ Voice message") {
      await bot.sendVoice(
        msg.chat.id,
        "./Машина Времени - Пока Горит Свеча.mp3",
        {
          caption: "⭐️Voice message",
          parse_mode: "HTML",
        }
      );
    } else if (msg.text == "⭐️ Contact") {
      await bot.sendContact(msg.chat.id, CONTACT, "Contact", {
        reply_to_message_id: msg.message_id,
      });
    } else if (msg.text == "⭐️ Geolocation") {
      const letitude = 50.236;
      const longitude = 28.623;
      await bot.sendLocation(msg.chat.id, letitude, longitude, {
        reply_to_message_id: msg.message_id,
      });
    } else if (msg.text == "/inline_menu") {
      await bot.sendMessage(msg.chat.id, "Inline menu", {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "Sticker", callback_data: "sticker" },
              { text: "Circle video", callback_data: "circleVideo" },
            ],
            [{ text: "Buy file", callback_data: "buyFile" }],
            [{ text: "Check subscription", callback_data: "checkSubs" }],
            [{ text: "Close menu", callback_data: "closeMenu" }],
          ],
          // resize_keyboard: true,
        },
      });
    } else if (msg.text == "/authorization") {
      const botMessage = await bot.sendMessage(msg.chat.id, "Enter your email");
      text = botMessage.text;
    } else if (text == "Enter your email" && !msg.text.match(regexp)) {
      console.log("text: ", text);
      console.log("msg.text: ", msg.text);
      await bot.sendMessage(msg.chat.id, "Enter the right email");
    } else if (text == "Enter your email" && msg.text.match(regexp)) {
      console.log("text: ", text);
      console.log("msg.text: ", msg.text);
      const botMessage = await bot.sendMessage(
        msg.chat.id,
        "Enter your password"
      );
      text = botMessage.text;
    } else if (text == "Enter your password" && msg.text.length <= 5) {
      console.log("text: ", text);
      console.log("msg.text: ", msg.text);
      // const botMessage =
      await bot.sendMessage(
        msg.chat.id,
        `You enter the password of the length of ${msg.text.length} characters The password length must not be less than 6 characters`
      );
      // text = botMessage.text;
    } else if (text == "Enter your password" && msg.text.length > 5) {
      console.log("text: ", text);
      console.log("msg.text: ", msg.text);
      const botMessage = await bot.sendMessage(
        msg.chat.id,
        "You entered the right email and password"
      );
      text = botMessage.text;
    } else {
      await bot.sendMessage(msg.chat.id, msg.text);
    }
  } catch (error) {
    console.log(error);
  }
});
//

bot.on("photo", async (pic) => {
  try {
    const photoGroup = [];
    for (let index = pic.photo.length - 1; index >= 0; index--) {
      const photoPath = await bot.downloadFile(
        pic.photo[index].file_id,
        "./images"
      );
      photoGroup.push({
        type: "photo",
        media: photoPath,
        caption: `File size: ${pic.photo[index].file_size} byte\nWidth: ${pic.photo[index].width}\nHeight: ${pic.photo[index].height}`,
      });
    }
    console.log(photoGroup);
    await bot.sendMediaGroup(pic.chat.id, photoGroup);
    for (let index = 0; index < pic.photo.length; index += 1) {
      fs.unlink(photoGroup[index].media, (error) => {
        if (error) {
          console.log(error);
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
});

bot.on("video", async (video) => {
  //   console.log(video);
  try {
    const thumbPath = await bot.downloadFile(
      video.video.thumbnail.file_id,
      "./images"
    );

    const { file_id, file_name, duration, width, height, file_size } =
      video.video;

    const videoGroup = [
      {
        type: "video",
        media: file_id,
        caption: `Title: ${file_name}\nDuration: ${duration}\nWidth: ${width}\nHeight: ${height}\nFile size: ${file_size}`,
      },
      {
        type: "photo",
        media: thumbPath,
      },
    ];

    await bot.sendMediaGroup(video.chat.id, videoGroup);

    fs.unlink(thumbPath, (error) => {
      if (error) {
        console.log(error);
      }
    });
  } catch (error) {
    console.log(error);
  }
});

bot.on("audio", async (audio) => {
  // console.log(audio);
  try {
    await bot.sendAudio(audio.chat.id, audio.audio.file_id, {
      caption: `Title: ${audio.audio.file_name}\nDuration: ${audio.audio.duration} sec\nFile size: ${audio.audio.file_size} b`,
    });
  } catch (error) {
    console.log(error);
  }
});

bot.on("voice", async (voice) => {
  try {
    await bot.sendVoice(voice.chat.id, voice.voice.file_id, {
      caption: `Duration: ${voice.voice.duration} sec\nFile size: ${voice.voice.file_size} b`,
    });
  } catch (error) {
    console.log(error);
  }
});

bot.on("contact", async (contact) => {
  try {
    await bot.sendMessage(
      contact.chat.id,
      `Conact number: ${contact.contact.phone_number}\nContact name: ${contact.contact.first_name}`
    );
  } catch (error) {
    console.log(error);
  }
});

bot.on("location", async (location) => {
  // console.log(location);
  try {
    await bot.sendMessage(
      location.chat.id,
      `Latitude: ${location.location.latitude}\nLongitude: ${location.location.longitude}`
    );
  } catch (error) {
    console.log(error);
  }
});

bot.on("callback_query", async (kkk) => {
  //the argument (kkk) can be anything
  try {
    console.log(kkk);
  } catch (error) {
    console.log(error);
  }
});

bot.setMyCommands(commands);
