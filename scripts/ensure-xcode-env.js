#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const projectRoot = process.cwd();
const CANDIDATE_NATIVE_DIRS = ["macos", "ios"];

function isNativeAppleProject(dirPath) {
  if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
    return false;
  }

  const entries = fs.readdirSync(dirPath);
  if (entries.includes("Podfile")) {
    return true;
  }

  return entries.some(
    (entry) => entry.endsWith(".xcodeproj") || entry.endsWith(".xcworkspace")
  );
}

function shellEscape(value) {
  return `'${String(value).replace(/'/g, `'\\''`)}'`;
}

const nodeBinary = process.env.NODE_BINARY || process.execPath;
const nativeDirs = CANDIDATE_NATIVE_DIRS
  .map((dirName) => path.join(projectRoot, dirName))
  .filter(isNativeAppleProject);

if (nativeDirs.length === 0) {
  console.log(
    "[setup:xcode-env] Skipped: no macos/ or ios/ native Xcode project found."
  );
  process.exit(0);
}

for (const nativeDir of nativeDirs) {
  const baseEnvPath = path.join(nativeDir, ".xcode.env");
  const localEnvPath = `${baseEnvPath}.local`;

  if (!fs.existsSync(baseEnvPath)) {
    const baseContent = "export NODE_BINARY=$(command -v node)\n";
    try {
      fs.writeFileSync(baseEnvPath, baseContent, { flag: "wx" });
      console.log(
        `[setup:xcode-env] Created ${path.relative(projectRoot, baseEnvPath)}`
      );
    } catch (error) {
      if (!error || error.code !== "EEXIST") {
        console.warn(
          `[setup:xcode-env] Failed to create ${path.relative(projectRoot, baseEnvPath)}: ${error.message}`
        );
      }
    }
  }

  if (!fs.existsSync(localEnvPath) && nodeBinary) {
    const localContent = `export NODE_BINARY=${shellEscape(nodeBinary)}\n`;
    try {
      fs.writeFileSync(localEnvPath, localContent, { flag: "wx" });
      console.log(
        `[setup:xcode-env] Created ${path.relative(projectRoot, localEnvPath)}`
      );
    } catch (error) {
      if (!error || error.code !== "EEXIST") {
        console.warn(
          `[setup:xcode-env] Failed to create ${path.relative(projectRoot, localEnvPath)}: ${error.message}`
        );
      }
    }
  }
}
