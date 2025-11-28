import backupNow from "./backupNow.js";

// Run backup immediately on server start
backupNow();

// Run backup every hour
setInterval(() => {
  backupNow();
}, 3600000);
