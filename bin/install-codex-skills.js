#!/usr/bin/env node

"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const sourceDir = path.join(repoRoot, "skills");
const defaultDest = path.join(os.homedir(), ".codex", "skills");

function usage() {
  console.log(`AI Berkshire Codex Skills installer

Usage:
  npx ai-berkshire
  node bin/install-codex-skills.js

Options:
  --dest <path>   Install to a custom Codex skills directory
  --dry-run       Validate and print planned copies without writing files
  --list          List bundled skills
  -h, --help      Show this help
`);
}

function parseArgs(argv) {
  const options = {
    dest: process.env.CODEX_SKILLS_DIR || defaultDest,
    dryRun: false,
    list: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--dest") {
      const value = argv[i + 1];
      if (!value) {
        throw new Error("--dest requires a path");
      }
      options.dest = path.resolve(value.replace(/^~/, os.homedir()));
      i += 1;
    } else if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--list") {
      options.list = true;
    } else if (arg === "-h" || arg === "--help") {
      options.help = true;
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  return options;
}

function readSkills() {
  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Bundled skills directory not found: ${sourceDir}`);
  }

  return fs
    .readdirSync(sourceDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function validateSkill(skillName) {
  const skillFile = path.join(sourceDir, skillName, "SKILL.md");
  if (!fs.existsSync(skillFile)) {
    throw new Error(`Missing SKILL.md for skill: ${skillName}`);
  }

  const text = fs.readFileSync(skillFile, "utf8");
  if (!/^---\n[\s\S]*?\n---\n/.test(text)) {
    throw new Error(`Missing YAML frontmatter: ${skillFile}`);
  }
  if (!/^name:\s*.+$/m.test(text)) {
    throw new Error(`Missing frontmatter name: ${skillFile}`);
  }
  if (!/^description:\s*.+$/m.test(text)) {
    throw new Error(`Missing frontmatter description: ${skillFile}`);
  }
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(from, to);
    } else if (entry.isFile()) {
      fs.copyFileSync(from, to);
    }
  }
}

function main() {
  let options;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(`Error: ${error.message}`);
    usage();
    process.exit(2);
  }

  if (options.help) {
    usage();
    return;
  }

  const skills = readSkills();
  for (const skill of skills) {
    validateSkill(skill);
  }

  if (options.list) {
    for (const skill of skills) {
      console.log(skill);
    }
    return;
  }

  console.log(`Found ${skills.length} Codex skills.`);
  console.log(`Install destination: ${options.dest}`);

  if (options.dryRun) {
    for (const skill of skills) {
      console.log(`[dry-run] ${skill} -> ${path.join(options.dest, skill)}`);
    }
    console.log("Dry run complete. No files were written.");
    return;
  }

  fs.mkdirSync(options.dest, { recursive: true });
  for (const skill of skills) {
    copyDir(path.join(sourceDir, skill), path.join(options.dest, skill));
    console.log(`Installed ${skill}`);
  }

  console.log("\nDone. Restart Codex or reload skills if your client requires it.");
}

main();
