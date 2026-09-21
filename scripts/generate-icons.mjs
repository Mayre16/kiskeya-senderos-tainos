import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "icons");

function crc32(buf) {
  let c = ~0;
  for (const byte of buf) {
    c ^= byte;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const tag = Buffer.from(type);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([tag, data])));
  return Buffer.concat([len, tag, data, crc]);
}

function paint(size) {
  const raw = Buffer.alloc((size * 4 + 1) * size);
  const mid = size / 2;
  for (let y = 0; y < size; y += 1) {
    raw[y * (size * 4 + 1)] = 0;
    for (let x = 0; x < size; x += 1) {
      const i = y * (size * 4 + 1) + 1 + x * 4;
      const dx = x - mid;
      const dy = y - mid;
      const dist = Math.hypot(dx, dy);
      const ring = Math.abs(dist - size * 0.28) < size * 0.035;
      const core = dist < size * 0.08;
      const cross =
        (Math.abs(dx) < size * 0.04 && Math.abs(dy) < size * 0.32) ||
        (Math.abs(dy) < size * 0.04 && Math.abs(dx) < size * 0.32);
      let r = 0x4a;
      let g = 0x2c;
      let b = 0x1a;
      if (ring || core) {
        r = 0xfd;
        g = 0xfb;
        b = 0xf7;
      } else if (cross && dist < size * 0.34) {
        r = 0xc4;
        g = 0x5c;
        b = 0x26;
      }
      raw[i] = r;
      raw[i + 1] = g;
      raw[i + 2] = b;
      raw[i + 3] = 255;
    }
  }
  return raw;
}

function writePng(size, name) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const png = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(paint(size))),
    chunk("IEND", Buffer.alloc(0)),
  ]);
  writeFileSync(join(dir, name), png);
}

writePng(192, "icon-192.png");
writePng(512, "icon-512.png");
console.log("icons written");
