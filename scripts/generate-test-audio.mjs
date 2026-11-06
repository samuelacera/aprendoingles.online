/**
 * Generates the listening clips of the level test (/test-nivel) with
 * ElevenLabs and saves them in public/audio/test-nivel/.
 *
 *   node --env-file=.env.local scripts/generate-test-audio.mjs        # only missing
 *   node --env-file=.env.local scripts/generate-test-audio.mjs --force
 *
 * The transcripts must match LISTENING in src/lib/level-test/bank.ts.
 */
import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";

const OUT = path.join(process.cwd(), "public/audio/test-nivel");
const force = process.argv.includes("--force");

const CLIPS = [
  {
    file: "l1.mp3",
    voice: "Xb7hH8MSUJpSbSDYk0k2", // Alice · British, clear
    speed: 0.88,
    text: "Hi, this is Emma from the London office. Just a quick message: the meeting on Thursday is moved to Friday at ten. Please bring the sales report. Thanks, bye!",
  },
  {
    file: "l2.mp3",
    voice: "cjVigY5qzO86Huf0OWal", // Eric · American
    speed: 1.0,
    text: "Quick update on the project. We're running about a week behind, because the supplier still hasn't delivered the parts. I've asked them for a firm date, and as soon as I hear back, I'll let you know. In the meantime, let's focus on testing.",
  },
  {
    file: "l3.mp3",
    voice: "IKne3meq5aSn9XLyUdCD", // Charlie · Australian, casual
    speed: 1.08,
    text: "Look, I'm not gonna sugarcoat it. The numbers this quarter are a bit of a mixed bag. Sales are up, but our margins took a hit, mostly because we've been throwing discounts around like confetti. So, going forward, no more discounts without my sign-off. Fair enough?",
  },
  {
    file: "l4.mp3",
    voice: "ecp3DWciuUyW7BYM7II1", // Anika · Indian English
    speed: 1.12,
    text: "To be honest, I'd hold off on signing anything just yet. The proposal looks solid on paper, but the liability clause is pretty vague, and if things go south, we'd be the ones footing the bill. Let's loop in legal before we commit.",
  },
];

if (!process.env.ELEVENLABS_API_KEY) {
  console.error("Falta ELEVENLABS_API_KEY en .env.local");
  process.exit(1);
}

await mkdir(OUT, { recursive: true });

for (const clip of CLIPS) {
  const target = path.join(OUT, clip.file);
  if (!force) {
    try {
      await access(target);
      console.log(`= ${clip.file} ya existe`);
      continue;
    } catch {}
  }
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${clip.voice}?output_format=mp3_44100_64`,
    {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: clip.text,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.5, similarity_boost: 0.75, speed: clip.speed },
      }),
    },
  );
  if (!res.ok) {
    console.error(`✗ ${clip.file}: ${res.status} ${(await res.text()).slice(0, 200)}`);
    process.exitCode = 1;
    continue;
  }
  await writeFile(target, Buffer.from(await res.arrayBuffer()));
  console.log(`✓ ${clip.file}`);
}
