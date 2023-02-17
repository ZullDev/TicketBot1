const client = require('../../index');
const { ActivityType } = require("discord.js");

client.on("ready", () => {
  console.log(`💻 [App] Iniciado.`);
  console.log(`💻 [App] Conectado em ${client.guilds.cache.size} servidores.`);
  console.log(`💻 [App] ${client.user.tag} está online.`);
    
    client.user.setActivity("Speex Store: https://discord.gg/dhrmCGbsPj", {
    type: ActivityType.Gaming,
  });
});