const fs = require("fs");

fs.watch("dev/elder", { recursive: true }, (eventType, filename) => {
  if (eventType === "change") console.log(filename, "changed.");
});
