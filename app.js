const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fs = require("fs");

const client = new Client({
  authStrategy: new LocalAuth(),
});

// Setting helper functions
let Msgtype = (msgData, _ingrp) => {
  if (_ingrp) {
    // Checking message type
    if (msgData.type == "image") {
      msgData.reply("Dont Spam Group Please");
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
      } else if (msgData.body == "/author") {
        client.sendMessage(msgData.author, "Xen is my creator");
      }
    }
  } else {
    // DM chat
    if (msgData.body == "/help") {
      client.sendMessage(
        msgData.from,
        "Hello Do u need help \n\n" +
          "Here are a list of commands \n" +
          "/help \t - \t 'Display commands' \n" +
          "/author \t - \t 'Displays my creator \n" +
          "/info \t - \t 'Displays need to know information about group'"
      );
    } else if (msgData.body == "/author") {
      client.sendMessage(msgData.from, "Xen is my creator");
    }
  }
};

// Reply chats privately
let participantsCheck = (groupPart, _msg) => {
  groupPart.forEach((individuals) => {
    if (individuals.id._serialized == _msg.from) {
      Msgtype(_msg, 0);
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
      Msgtype(msg, 1);
    } else {
      participantsCheck(GroupPart, msg);
    }
  });
});

client.initialize();
