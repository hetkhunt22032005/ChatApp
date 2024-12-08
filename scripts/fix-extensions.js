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

  const updatedLines = lines.map((line) => {
    const commentIndex = line.indexOf("// .js");
    if(commentIndex !== -1) {
      const importPath = line.substring(0, commentIndex-3).trim();
      if(!importPath.endsWith(".js")) {
        const updatedPath = importPath + '.js"';
        return updatedPath;
      }
    }

    return line;
  });

  const updatedContent = updatedLines.join("\n");
  fs.writeFileSync(filepath, updatedContent, 'utf-8');
}

processDirectory('./dist');
