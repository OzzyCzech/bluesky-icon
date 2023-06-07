#!/usr/bin/env node

import {optimize} from "svgo";
import {readFile as readFileAsync, writeFile as writeFileAsync} from 'node:fs/promises';
import {Buffer} from 'node:buffer';
import sharp from "sharp";

/**
 * Write content to the file and create directory if not exists
 *
 * @param {string} file
 * @param {string} content
 * @returns {Promise<*>}
 */
export async function writeFile(file, content) {
    if (!existsSync(dirname(file))) {
        await mkdir(dirname(file), {recursive: true});
    }

    return;
}

// read data and optimize SVG
const src = await readFileAsync("src/bluesky-icon.svg", "utf8");
const svg = optimize(src, {
    path: "src/bluesky-icon.svg",
    multipass: true,
});

const bluesky = {
    current: svg.data,
    white: svg.data.replace('fill="currentColor"', 'fill="#fff"'),
    black: svg.data.replace('fill="currentColor"', 'fill="#000"'),
}

const blackIcon = await sharp(Buffer.from(bluesky.black));
const whiteIcon = await sharp(Buffer.from(bluesky.white));

// save black variants
await writeFileAsync("dist/bluesky-icon.svg", bluesky.current)
await blackIcon.toFile("dist/bluesky-icon.png");
await blackIcon.toFile("dist/bluesky-icon.webp");

// save white variants
await writeFileAsync("dist/bluesky-icon.white.svg", bluesky.white)
await whiteIcon.toFile("dist/bluesky-icon.white.png");
await whiteIcon.toFile("dist/bluesky-icon.white.webp");

console.log("Done!");
