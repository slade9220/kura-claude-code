import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, Timer } from 'claude-code'

import type { Kura, Mood } from '../types'
import { COLUMNS, FRAMES, ROWS } from './frames'
import { langOf, WORDS } from './words'
import type { Words } from './words'

// Kura, the corgi-fox from KuraNote, sits above the prompt like an old office
// paperclip: his face and speech bubble follow what Claude is doing.

const kura = atom({ plugin: 'kura', key: 'kura' } as const, {
  mood: 'hello',
  line: WORDS.en.hello,
} as Kura)
const frame = atom({ plugin: 'kura', key: 'frame' } as const, 0)
const isHidden = atom({ plugin: 'kura', key: 'isHidden' } as const, false)
// The terminal shows real images (Ghostty, kitty): Kura as PNG, not as colored cells.
const hasPixels = atom({ plugin: 'kura', key: 'hasPixels' } as const, false)

const pick = <T,>(list: readonly T[]): T => list[Math.floor(Math.random() * list.length)] as T

// Which of the app's drawings (KuraMood) for each mood here.
const drawing: Record<Mood, keyof typeof FRAMES> = {
  sleep: 'idle',
  hello: 'answering',
  think: 'thinking',
  talk: 'answering',
  read: 'listening',
  write: 'recording',
  run: 'recording',
  sniff: 'listening',
  web: 'listening',
  friends: 'answering',
  oops: 'sorry',
  done: 'answering',
}

const base = (path: unknown) =>
  typeof path === 'string' ? path.split('/').filter(Boolean).pop() ?? path : ''

const short = (text: string, max = 48) =>
  text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text

// What Kura says while Claude uses a tool.
const forTool = (w: Words, tool: string, input: Record<string, unknown>): Kura => {
  switch (tool) {
    case 'Read':
      return { mood: 'read', line: w.read(base(input.file_path)) }
    case 'Edit':
    case 'Write':
    case 'NotebookEdit':
      return { mood: 'write', line: w.write(base(input.file_path ?? input.notebook_path)) }
    case 'Bash':
      return {
        mood: 'run',
        line: typeof input.description === 'string' ? short(input.description) : w.run,
      }
    case 'Grep':
    case 'Glob':
      return { mood: 'sniff', line: w.sniff }
    case 'WebFetch':
    case 'WebSearch':
      return { mood: 'web', line: w.web }
    case 'Agent':
      return { mood: 'friends', line: w.friends }
    default:
      return tool.startsWith('mcp__')
        ? { mood: 'friends', line: w.ask(tool.split('__')[1] ?? tool) }
        : { mood: 'run', line: w.use(tool) }
  }
}

let w: Words = WORDS.en
let ticker: Timer | undefined
let nap: Timer | undefined
let lastKind = ''

function say($: EngineInterface, next: Kura) {
  return update($, kura, () => next).catch(() => {})
}

function startTicking($: EngineInterface) {
  nap?.cancel()
  if (ticker) return
  ticker = $.clock.every(500, () => {
    void update($, frame, f => (f + 1) % FRAMES.idle.length)
  })
}

function stopTicking() {
  ticker?.cancel()
  ticker = undefined
}

function scheduleNap($: EngineInterface) {
  nap?.cancel()
  nap = $.clock.after(90_000, () => {
    void say($, { mood: 'sleep', line: pick(w.sleepy) })
  })
}

// KURA_LANG first, then the Mac's own language (a shell often says en_US on an
// Italian Mac), then the locale variables; English otherwise.
async function language($: EngineInterface) {
  const mac = await $.process
    .run(['defaults', 'read', '-g', 'AppleLanguages'], { timeoutMs: 3000 })
    .then(r => (r.exitCode === 0 ? /"?([A-Za-z]{2})[-_A-Za-z]*"?/.exec(r.stdout.replace(/[()\s,]/g, ' ').trim())?.[1] : undefined))
    .catch(() => undefined)
  return langOf([
    await $.env.get('KURA_LANG'),
    mac,
    await $.env.get('LC_ALL'),
    await $.env.get('LC_MESSAGES'),
    await $.env.get('LANG'),
  ])
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    w = WORDS[await language($).catch(() => 'en' as const)]
    $.command.register({ name: 'kura', description: w.command })
    await say($, { mood: 'hello', line: w.hello })
    const program = (await $.env.get('TERM_PROGRAM')) ?? ''
    const term = (await $.env.get('TERM')) ?? ''
    const inTmux = Boolean(await $.env.get('TMUX'))
    await update($, hasPixels, () => !inTmux && (/ghostty/i.test(program) || /kitty/i.test(term)))
    return next(e)
  })

  on('prompt.submit', async ($, e, next) => {
    if (!e.command && e.text.trim()) {
      // The paperclip moment.
      await say($, { mood: 'hello', line: w.looksLike(short(e.text.trim().replace(/\s+/g, ' '), 30)) })
    }
    return next(e)
  })

  on('turn.start', async ($, e, next) => {
    if (!e.agentId) {
      lastKind = ''
      startTicking($)
    }
    return next(e)
  })

  // The response streams in pieces: thinking first, then text.
  on('turn.step', async function* ($, e, next) {
    const stream = next(e)
    if (e.agentId) return yield* stream
    while (true) {
      const item = await stream.next()
      if (item.done) return item.value
      const chunk = item.value
      if (chunk.kind !== lastKind && (chunk.kind === 'thinking' || chunk.kind === 'text')) {
        lastKind = chunk.kind
        await say($, chunk.kind === 'thinking'
          ? { mood: 'think', line: pick(w.thinking) }
          : { mood: 'talk', line: w.talk })
      }
      if (chunk.kind === 'tool') lastKind = 'tool'
      yield chunk
    }
  })

  on('tool.call', async ($, e, next) => {
    if (e.agentId) return next(e)
    await say($, forTool(w, e.tool, e as unknown as Record<string, unknown>))
    const result = await next(e)
    if ('isError' in result && result.isError) {
      await say($, { mood: 'oops', line: w.oops })
    }
    return result
  })

  on('turn.complete', async ($, e, next) => {
    if (e.agentId) return next(e)
    stopTicking()
    await say($, { mood: 'done', line: pick(w.finished) })
    scheduleNap($)
    return next(e)
  })

  on('command.run', { command: 'kura' }, async $ => {
    const hidden = !(await read($, isHidden))
    await update($, isHidden, () => hidden)
    return { text: hidden ? w.hidden : w.shown }
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey || (await read($, isHidden))) return next(e)

    const { mood, line } = await read($, kura)
    const f = e.props.isWorking ? await read($, frame) : 0
    const ui = $.ui.resolve(e)
    const { Box, Text } = ui
    const fox = '#FF8C28'
    const dots = e.props.isWorking && mood !== 'oops' ? ['', '.', '..', '...', '..', '.'][f] ?? '' : ''
    const cells = FRAMES[drawing[mood]][f] ?? FRAMES[drawing[mood]][0] ?? ''
    const png = `${$.plugin.root}/assets/${drawing[mood]}-${f}.png`
    const pixels = await read($, hasPixels)

    return (
      <Box flexDirection="row" alignItems="center">
        {'Image' in ui && pixels
          ? <ui.Image key="kura" source={{ file: png, format: 'png' }} columns={12} rows={6} alt="Kura" />
          : 'Raster' in ui
            ? <ui.Raster key="kura" columns={COLUMNS} rows={ROWS} cells={cells} />
            : null}
        <Box borderStyle="round" borderColor={fox} paddingX={1} marginLeft={1}>
          <Text>
            {line}
            {dots}
          </Text>
        </Box>
      </Box>
    )
  })
}
