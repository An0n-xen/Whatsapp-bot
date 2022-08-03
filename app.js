const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fs = require("fs");
const { PassThrough } = require("stream");

const client = new Client({
  authStrategy: new LocalAuth(),
});

let Strikes = {
  offender: [],
  strikes: [],
};
var n = 0;

// Strike checker
let StrickCheck = (msg, _offender) => {
  if (Strikes["offender"].includes(_offender)) {
    let Ofindex = Strikes["offender"].indexOf(_offender);
    Strikes["strikes"][Ofindex] += 1;
  } else {
    Strikes["offender"].push(_offender);
    Strikes["strikes"].push(1);
  }

  // Ejecting user at third strike
  Strikes["strikes"].forEach((strike) => {
    if (strike == 3) {
      msg.reply("Be Gone");

      // removing user
      //groupMon.removeParticipants([]);
    }
  });

  console.log(groupMon);
};

// Setting helper functions
let Msgtype = (msgData, _ingrp) => {
  if (_ingrp) {
    // Checking message type
    if (msgData.type == "image") {
      n += 1;
      msgData.reply("Dont Spam Group Please \n" + n + " strikes");

      // Checking offender and number of strikes
      StrickCheck(msgData, msgData.author);
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
        client.sendMessage(
          msgData.author,
          "Fiifi Amoah is my Creator \n\n" +
            "Below are his contact info \n" +
            " * Whatsapp - 233209377749 \n" +
            " * Github - https://github.com/An0n-xen \n" +
            " * Linkedin - linkedin.com/in/fiifi-amoah-a60bb51b3 \n" +
            " * Twitter comming soon"
        );
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
      client.sendMessage(
        msgData.from,
        "Fiifi Amoah is my Creator \n\n" +
          "Below are his contact info \n" +
          " * Whatsapp - 233209377749 \n" +
          " * Github - https://github.com/An0n-xen \n" +
          " * Linkedin - linkedin.com/in/fiifi-amoah-a60bb51b3 \n" +
          " * Twitter comming soon"
      );
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
