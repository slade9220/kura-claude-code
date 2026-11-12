export type Mood =
  | 'sleep' | 'hello' | 'think' | 'talk' | 'read' | 'write'
  | 'run' | 'sniff' | 'web' | 'friends' | 'oops' | 'done'

export type Kura = { mood: Mood; line: string }

declare module 'claude-code' {
  interface PluginState {
    kura: { kura: Kura; frame: number; isHidden: boolean; hasPixels: boolean }
  }
}
