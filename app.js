const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fs = require("fs");

const client = new Client({
  authStrategy: new LocalAuth(),
});

// Setting helper functions
let Msgtype = (msgData) => {
  // Checking message type
  if (msgData.type == "image") {
    msgData.reply("Dont Spam group");
  } else {
    if (msgData.body == "/help") {
      client.sendMessage(
        msgData.author,
        "Hello Do u need help \n\n" +
          "Here are a list of commands \n" +
          "/help \t - \t 'Display commands' \n" +
          "/author \t - \t 'Displays my creator \n" +
          "/info \t - \t 'Displays need to know information about group'"
      );
    }
  }
};

// Reply chats privately
let participantsCheck = (groupPart, _msg) => {
  groupPart.forEach((individuals) => {
    if (individuals.id._serialized == _msg.from) {
      client.sendMessage(_msg.from, "You send a message");
    }
  });
};

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
  client.getChats().then((chat) => {
    // Setting group to monitor
    chat.forEach((chatObj) => {
      if (chatObj.name === "Test") {
        groupMon = chatObj;
        // getting group participants
        GroupPart = groupMon.participants;
      }
    });
  });
});

client.on("message", async (msg) => {
  // Getting message sender
  msg.getChat().then((MsgFrom) => {
    if (MsgFrom.name === groupMon.name) {
      // Checking message type
      Msgtype(msg);
    } else {
      participantsCheck(GroupPart, msg);
    }
  });
});

client.initialize();
