import fs from "fs";
import path from "path";

function processDirectory(directory) {
  const files = fs.readdirSync(directory);

  files.forEach((file) => {
    const filepath = path.join(directory, file);
    const stats = fs.statSync(filepath);
    if (stats.isDirectory()) {
      processDirectory(filepath);
    } else if (filepath.endsWith(".js")) {
      replaceImportExtensions(filepath);
    }
  });
}

function replaceImportExtensions(filepath) {
  let fileContent = fs.readFileSync(filepath, "utf8");

  const lines = fileContent.split("\n");

  // Optimization - 1: Checking the "USE SCRIPT" flag for whether to process or not
  if (lines.length && lines[0].trim() === '"USE SCRIPT";') {
    let breakIndex = -1;
    const part1Array = [];
    for (let i = 1; i < lines.length; i++) {
      // Optimization - 2: Checking the "END" flag for skipping further processing
      let line = lines[i];
      if (line.trim() === '("END");') {
        part1Array.push("");
        breakIndex = i + 1;
        console.log(`Break at ${i} in ${filepath}.`);
        break;
      }
      const commentIndex = line.indexOf("// .js");
      if (commentIndex !== -1) {
        const importPath = line.substring(0, commentIndex - 3).trim();
        if (!importPath.endsWith(".js")) {
          const updatedPath = importPath + '.js"';
          line = updatedPath;
        }
      }
      part1Array.push(line);
    }
    let finalArray = [];
    let part2Array = [];
    if (breakIndex !== -1) {
      part2Array = lines.slice(breakIndex);
    }
    finalArray = [...part1Array, ...part2Array];
    const updatedContent = finalArray.join("\n");
    fs.writeFileSync(filepath, updatedContent, "utf8");
    console.log("File Processed: ", filepath);
  } else {
    return;
  }
}

processDirectory("./dist");
