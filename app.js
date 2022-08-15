const { Client, LocalAuth, Buttons, List, Order } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fs = require("fs");

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
      //groupMon.removeParticipants([msg.author]);
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
            "/info \t - \t 'Displays need to know information about group'" +
            "/buy \t - \t Buy from aaenics store"
        );
        console.log("help function called from group");
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

        // Logging calls
        console.log("author function called from group");
      } else if (msgData.body == "/buy") {
        const productsList = new List(
          "Buy affordable electronic components from the aaenics store",
          "View all products",
          [
            {
              title: "Products list",
              rows: [
                { id: "arduino", title: "Arduino ($25.23)" },
                { id: "raspberrypi", title: "Raspberry Pi 4 ($252.30)" },
                { id: "LED", title: "LED's ($2.44) per peices" },
              ],
            },
          ],
          "Please select a product"
        );
        console.log("buy function called from group");
        client.sendMessage(msgData.from, productsList);
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
          "/info \t - \t 'Displays need to know information about group'" +
          "/buy \t - \t Buy from aaenics store"
      );
      console.log("help function called from participant");
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
      console.log("author function called from participant");
    } else if (msgData.body == "/buy") {
      const productsList = new List(
        "Buy affordable electronic components from the aaenics store",
        "View all products",
        [
          {
            title: "Products list",
            rows: [
              { id: "arduino", title: "Arduino ($25.23)" },
              { id: "raspberrypi", title: "Raspberry Pi 4 ($252.30)" },
              { id: "LED", title: "LED's ($2.44) per peices" },
            ],
          },
        ],
        "Please select a product"
      );
      console.log("buy function called from group");
      client.sendMessage(msgData.from, productsList);
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
      // Enter group name here
      if (chatObj.name === "Test") {
        groupMon = chatObj;
        // getting group participants
        GroupPart = groupMon.participants;
      }
    });
  });
});

// Messages
client.on("message", async (msg) => {
  // Getting message sender
  msg.getChat().then((MsgFrom) => {
    if (MsgFrom.name === groupMon.name) {
      // Checking message type
      Msgtype(msg, 1);
      console.log(msg);
    } else {
      participantsCheck(GroupPart, msg);
    }
  });
});

// New member join
client.on("group_join", async (param) => {
  const chat = await param.getChat();

  await chat.sendMessage(
    `Welcome to Test +${param.id.participant.split("@")[0]}`
  );

  console.log("new member added");
  // client.sendMessage(groupMon.id._serialized, "Welcome to Test");
});

//  Member remove
client.on("group_leave", async (param) => {
  const chat = await param.getChat();

  await chat.sendMessage(
    `Goodbye +${param.id.participant.split("@")[0]} have a nice life`
  );

  console.log("member was removed");
});

client.initialize();
