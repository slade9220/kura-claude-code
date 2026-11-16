// What Kura says, in the six languages of the KuraNote app.

export type Lang = 'en' | 'it' | 'fr' | 'es' | 'pt' | 'de'

export type Words = {
  hello: string
  looksLike: (ask: string) => string
  thinking: readonly string[]
  talk: string
  read: (file: string) => string
  write: (file: string) => string
  run: string
  sniff: string
  web: string
  friends: string
  ask: (server: string) => string
  use: (tool: string) => string
  oops: string
  finished: readonly string[]
  sleepy: readonly string[]
  command: string
  hidden: string
  shown: string
}

export const WORDS: Record<Lang, Words> = {
  en: {
    hello: "Hi! I'm Kura. I watch, you ask.",
    looksLike: ask => `It looks like you want “${ask}”. Leave it to me!`,
    thinking: ['Hmm… let me think', 'Mulling it over', 'Connecting the dots', 'Thinking like a fox'],
    talk: 'Writing you the answer',
    read: file => `Reading ${file}`,
    write: file => `Writing in ${file}`,
    run: 'Running a command',
    sniff: 'Sniffing around the code',
    web: 'Off to snoop on the web',
    friends: 'Calling another fox to help',
    ask: server => `Asking ${server}`,
    use: tool => `Using ${tool}`,
    oops: "Ouch, that didn't work. Trying again.",
    finished: ['Done! Anything else?', 'Here you go.', 'Mission accomplished.', 'All yours.'],
    sleepy: ['Dreaming of cows… zzz'],
    command: 'Show or hide Kura above the prompt',
    hidden: 'Kura went to sleep in his den.',
    shown: 'Kura is back!',
  },
  it: {
    hello: 'Ciao! Sono Kura. Io guardo, tu chiedi.',
    looksLike: ask => `Sembra che tu voglia «${ask}». Ci penso io!`,
    thinking: ['Hmm… fammi pensare', 'Ci rifletto un attimo', 'Sto collegando i puntini', 'Ragiono come una volpe'],
    talk: 'Ti scrivo la risposta',
    read: file => `Leggo ${file}`,
    write: file => `Scrivo in ${file}`,
    run: 'Lancio un comando',
    sniff: 'Annuso in giro per il codice',
    web: 'Esco a curiosare sul web',
    friends: "Chiamo un'altra volpe ad aiutarmi",
    ask: server => `Chiedo a ${server}`,
    use: tool => `Uso ${tool}`,
    oops: 'Ahia, non è andata. Riprovo.',
    finished: ['Fatto! Serve altro?', 'Ecco qua.', 'Missione compiuta.', 'Tutto tuo.'],
    sleepy: ['Sogno mucche… zzz'],
    command: 'Mostra o nasconde Kura sopra il prompt',
    hidden: 'Kura va a dormire nella tana.',
    shown: 'Kura è tornato!',
  },
  fr: {
    hello: 'Salut ! Je suis Kura. Je regarde, tu demandes.',
    looksLike: ask => `On dirait que tu veux « ${ask} ». Je m'en occupe !`,
    thinking: ['Hmm… laisse-moi réfléchir', "J'y réfléchis un instant", 'Je relie les points', 'Je réfléchis comme un renard'],
    talk: "Je t'écris la réponse",
    read: file => `Je lis ${file}`,
    write: file => `J'écris dans ${file}`,
    run: 'Je lance une commande',
    sniff: 'Je renifle dans le code',
    web: 'Je vais fouiner sur le web',
    friends: "J'appelle un autre renard à l'aide",
    ask: server => `Je demande à ${server}`,
    use: tool => `J'utilise ${tool}`,
    oops: "Aïe, ça n'a pas marché. Je réessaie.",
    finished: ["C'est fait ! Autre chose ?", 'Et voilà.', 'Mission accomplie.', 'À toi.'],
    sleepy: ['Je rêve de vaches… zzz'],
    command: 'Affiche ou masque Kura au-dessus du prompt',
    hidden: 'Kura part dormir dans son terrier.',
    shown: 'Kura est de retour !',
  },
  es: {
    hello: '¡Hola! Soy Kura. Yo miro, tú preguntas.',
    looksLike: ask => `Parece que quieres «${ask}». ¡Déjamelo a mí!`,
    thinking: ['Mmm… déjame pensar', 'Lo pienso un momento', 'Uniendo los puntos', 'Pensando como un zorro'],
    talk: 'Te escribo la respuesta',
    read: file => `Leo ${file}`,
    write: file => `Escribo en ${file}`,
    run: 'Lanzo un comando',
    sniff: 'Olfateo por el código',
    web: 'Salgo a curiosear por la web',
    friends: 'Llamo a otro zorro para que me ayude',
    ask: server => `Le pregunto a ${server}`,
    use: tool => `Uso ${tool}`,
    oops: 'Ay, no ha salido. Lo intento otra vez.',
    finished: ['¡Hecho! ¿Algo más?', 'Aquí tienes.', 'Misión cumplida.', 'Todo tuyo.'],
    sleepy: ['Sueño con vacas… zzz'],
    command: 'Muestra u oculta a Kura sobre el prompt',
    hidden: 'Kura se va a dormir a su madriguera.',
    shown: '¡Kura ha vuelto!',
  },
  pt: {
    hello: 'Oi! Eu sou o Kura. Eu observo, você pergunta.',
    looksLike: ask => `Parece que você quer “${ask}”. Deixa comigo!`,
    thinking: ['Hmm… deixa eu pensar', 'Pensando um pouco', 'Ligando os pontos', 'Pensando como uma raposa'],
    talk: 'Escrevendo a resposta',
    read: file => `Lendo ${file}`,
    write: file => `Escrevendo em ${file}`,
    run: 'Rodando um comando',
    sniff: 'Farejando pelo código',
    web: 'Bisbilhotando na web',
    friends: 'Chamando outra raposa para ajudar',
    ask: server => `Perguntando ao ${server}`,
    use: tool => `Usando ${tool}`,
    oops: 'Ai, não deu certo. Tentando de novo.',
    finished: ['Pronto! Mais alguma coisa?', 'Aqui está.', 'Missão cumprida.', 'É todo seu.'],
    sleepy: ['Sonhando com vacas… zzz'],
    command: 'Mostra ou esconde o Kura acima do prompt',
    hidden: 'O Kura foi dormir na toca.',
    shown: 'O Kura voltou!',
  },
  de: {
    hello: 'Hallo! Ich bin Kura. Ich schaue zu, du fragst.',
    looksLike: ask => `Sieht aus, als wolltest du „${ask}“. Überlass das mir!`,
    thinking: ['Hmm… lass mich nachdenken', 'Ich denke kurz nach', 'Ich verbinde die Punkte', 'Ich denke wie ein Fuchs'],
    talk: 'Ich schreibe dir die Antwort',
    read: file => `Ich lese ${file}`,
    write: file => `Ich schreibe in ${file}`,
    run: 'Ich starte einen Befehl',
    sniff: 'Ich schnüffle im Code herum',
    web: 'Ich stöbere im Web',
    friends: 'Ich rufe einen anderen Fuchs zu Hilfe',
    ask: server => `Ich frage ${server}`,
    use: tool => `Ich benutze ${tool}`,
    oops: 'Autsch, das hat nicht geklappt. Nochmal.',
    finished: ['Fertig! Noch etwas?', 'Bitte schön.', 'Mission erfüllt.', 'Gehört dir.'],
    sleepy: ['Ich träume von Kühen… zzz'],
    command: 'Zeigt oder versteckt Kura über dem Prompt',
    hidden: 'Kura schläft jetzt in seinem Bau.',
    shown: 'Kura ist zurück!',
  },
}

/** The first of these that names one of the six: `en_US.UTF-8`, `pt-BR`, `it`. */
export function langOf(candidates: readonly (string | undefined)[]): Lang {
  for (const value of candidates) {
    const code = value?.trim().slice(0, 2).toLowerCase()
    if (code && code in WORDS) return code as Lang
  }
  return 'en'
}
