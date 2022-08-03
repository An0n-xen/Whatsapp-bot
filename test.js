const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fs = require("fs");

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("client is ready");
});

client.on("message", async (msg) => {
  if (msg.hasMedia) {
    console.log("downloading media");
    const media = await msg.downloadMedia();
    let ext = media.mimetype.split("/")[1];

    fs.writeFile("./image2." + ext, media.data, "base64", (err) => {
      if (err) throw err;
      console.log("Saved!");
    });
    console.log(ext);

    console.log(groupMon);
  }
});

client.initialize();
