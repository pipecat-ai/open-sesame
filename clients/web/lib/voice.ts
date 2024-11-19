export type InteractionMode = "conversational" | "informational";

export type TTSService = "cartesia" | "elevenlabs";

interface LanguageOption {
  label: string;
  cartesia?: string;
  elevenlabs?: string;
  openai?: string;
  playht?: string;
}

interface VoiceOption {
  value: string;
  label: string;
  ttsProvider: string;
  languages: string[];
  voiceId: string;
  ttsModel?: string;
  sttModel: string;
}

export const languageOptions: LanguageOption[] = [
  {
    label: "Bulgarian",
    elevenlabs: "bg",
  },
  {
    label: "Chinese",
    elevenlabs: "zh",
  },
  {
    label: "Czech",
    elevenlabs: "cs",
  },
  {
    label: "Danish",
    elevenlabs: "da",
  },
  {
    label: "Dutch",
    elevenlabs: "nl",
  },
  {
    label: "English",
    cartesia: "en",
    elevenlabs: "en",
    openai: "en",
    playht: "en",
  },
  {
    label: "Finnish",
    elevenlabs: "fi",
  },
  {
    label: "French",
    cartesia: "fr",
    elevenlabs: "fr",
  },
  {
    label: "German",
    cartesia: "de",
    elevenlabs: "de",
  },
  {
    label: "Greek",
    elevenlabs: "el",
  },
  {
    label: "Hindi",
    elevenlabs: "hi",
  },
  {
    label: "Hungarian",
    elevenlabs: "hu",
  },
  {
    label: "Indonesian",
    elevenlabs: "id",
  },
  {
    label: "Italian",
    elevenlabs: "it",
  },
  {
    label: "Japanese",
    elevenlabs: "ja",
  },
  {
    label: "Korean",
    elevenlabs: "ko",
  },
  {
    label: "Malay",
    elevenlabs: "ms",
  },
  {
    label: "Norwegian",
    elevenlabs: "no",
  },
  {
    label: "Polish",
    elevenlabs: "pl",
  },
  {
    label: "Portuguese (Brazil)",
    elevenlabs: "pt-BR",
  },
  {
    label: "Portuguese (Portugal)",
    elevenlabs: "pt-PT",
  },
  {
    label: "Romanian",
    elevenlabs: "ro",
  },
  {
    label: "Russian",
    elevenlabs: "ru",
  },
  {
    label: "Slovak",
    elevenlabs: "sk",
  },
  {
    label: "Spanish",
    cartesia: "es",
    elevenlabs: "es",
  },
  {
    label: "Swedish",
    elevenlabs: "sv",
  },
  {
    label: "Turkish",
    elevenlabs: "tr",
  },
  {
    label: "Ukrainian",
    elevenlabs: "uk",
  },
  {
    label: "Vietnamese",
    elevenlabs: "vi",
  },
];

export const voiceOptions: VoiceOption[] = [
  // Cartesia voices
  // ENGLISH
  {
    value: "british-lady",
    label: "British Lady",
    ttsProvider: "cartesia",
    languages: ["en"],
    voiceId: "79a125e8-cd45-4c13-8a67-188112f4dd22",
    ttsModel: "sonic-english",
    sttModel: "nova-2-conversationalai",
  },
  {
    value: "california-girl",
    label: "California Girl",
    ttsProvider: "cartesia",
    languages: ["en"],
    voiceId: "b7d50908-b17c-442d-ad8d-810c63997ed9",
    ttsModel: "sonic-english",
    sttModel: "nova-2-conversationalai",
  },
  {
    value: "child",
    label: "Child",
    ttsProvider: "cartesia",
    languages: ["en"],
    voiceId: "2ee87190-8f84-4925-97da-e52547f9462c",
    ttsModel: "sonic-english",
    sttModel: "nova-2-conversationalai",
  },
  {
    value: "classy-british-man",
    label: "Classy British Man",
    ttsProvider: "cartesia",
    languages: ["en"],
    voiceId: "95856005-0332-41b0-935f-352e296aa0df",
    ttsModel: "sonic-english",
    sttModel: "nova-2-conversationalai",
  },
  {
    value: "confident-british-man",
    label: "Confident British Man",
    ttsProvider: "cartesia",
    languages: ["en"],
    voiceId: "63ff761f-c1e8-414b-b969-d1833d1c870c",
    ttsModel: "sonic-english",
    sttModel: "nova-2-conversationalai",
  },
  {
    value: "doctor-mischief",
    label: "Doctor Mischief",
    ttsProvider: "cartesia",
    languages: ["en"],
    voiceId: "fb26447f-308b-471e-8b00-8e9f04284eb5",
    ttsModel: "sonic-english",
    sttModel: "nova-2-conversationalai",
  },
  {
    value: "female-nurse",
    label: "Female Nurse",
    ttsProvider: "cartesia",
    languages: ["en"],
    voiceId: "5c42302c-194b-4d0c-ba1a-8cb485c84ab9",
    ttsModel: "sonic-english",
    sttModel: "nova-2-conversationalai",
  },
  {
    value: "friendly-reading-man",
    label: "Friendly Reading Man",
    ttsProvider: "cartesia",
    languages: ["en"],
    voiceId: "69267136-1bdc-412f-ad78-0caad210fb40",
    ttsModel: "sonic-english",
    sttModel: "nova-2-conversationalai",
  },
  {
    value: "helpful-woman",
    label: "Helpful Woman",
    ttsProvider: "cartesia",
    languages: ["en"],
    voiceId: "156fb8d2-335b-4950-9cb3-a2d33befec77",
    ttsModel: "sonic-english",
    sttModel: "nova-2-conversationalai",
  },
  {
    value: "kentucky-man",
    label: "Kentucky Man",
    ttsProvider: "cartesia",
    languages: ["en"],
    voiceId: "726d5ae5-055f-4c3d-8355-d9677de68937",
    ttsModel: "sonic-english",
    sttModel: "nova-2-conversationalai",
  },
  {
    value: "madame-mischief",
    label: "Madame Mischief",
    ttsProvider: "cartesia",
    languages: ["en"],
    voiceId: "e13cae5c-ec59-4f71-b0a6-266df3c9bb8e",
    ttsModel: "sonic-english",
    sttModel: "nova-2-conversationalai",
  },
  {
    value: "movieman",
    label: "Movieman",
    ttsProvider: "cartesia",
    languages: ["en"],
    voiceId: "c45bc5ec-dc68-4feb-8829-6e6b2748095d",
    ttsModel: "sonic-english",
    sttModel: "nova-2-conversationalai",
  },
  {
    value: "newsman",
    label: "Newsman",
    ttsProvider: "cartesia",
    languages: ["en"],
    voiceId: "d46abd1d-2d02-43e8-819f-51fb652c1c61",
    ttsModel: "sonic-english",
    sttModel: "nova-2-conversationalai",
  },
  {
    value: "polite-man",
    label: "Polite Man",
    ttsProvider: "cartesia",
    languages: ["en"],
    voiceId: "ee7ea9f8-c0c1-498c-9279-764d6b56d189",
    ttsModel: "sonic-english",
    sttModel: "nova-2-conversationalai",
  },
  {
    value: "salesman",
    label: "Salesman",
    ttsProvider: "cartesia",
    languages: ["en"],
    voiceId: "820a3788-2b37-4d21-847a-b65d8a68c99a",
    ttsModel: "sonic-english",
    sttModel: "nova-2-conversationalai",
  },
  {
    value: "southern-woman",
    label: "Southern Woman",
    ttsProvider: "cartesia",
    languages: ["en"],
    voiceId: "f9836c6e-a0bd-460e-9d3c-f7299fa60f94",
    ttsModel: "sonic-english",
    sttModel: "nova-2-conversationalai",
  },
  {
    value: "storyteller-lady",
    label: "Storyteller Lady",
    ttsProvider: "cartesia",
    languages: ["en"],
    voiceId: "996a8b96-4804-46f0-8e05-3fd4ef1a87cd",
    ttsModel: "sonic-english",
    sttModel: "nova-2-conversationalai",
  },
  {
    value: "the-merchant",
    label: "The Merchant",
    ttsProvider: "cartesia",
    languages: ["en"],
    voiceId: "50d6beb4-80ea-4802-8387-6c948fe84208",
    ttsModel: "sonic-english",
    sttModel: "nova-2-conversationalai",
  },
  // GERMAN
  {
    value: "friendly-german-man",
    label: "Friendly German Man",
    ttsProvider: "cartesia",
    languages: ["de"],
    voiceId: "fb9fcab6-aba5-49ec-8d7e-3f1100296dde",
    ttsModel: "sonic-multilingual",
    sttModel: "nova-2-general",
  },
  {
    value: "german-conversation-man",
    label: "German Conversation Man",
    ttsProvider: "cartesia",
    languages: ["de"],
    voiceId: "384b625b-da5d-49e8-a76d-a2855d4f31eb",
    ttsModel: "sonic-multilingual",
    sttModel: "nova-2-general",
  },
  {
    value: "german-conversational-woman",
    label: "German Conversational Woman",
    ttsProvider: "cartesia",
    languages: ["de"],
    voiceId: "3f4ade23-6eb4-4279-ab05-6a144947c4d5",
    ttsModel: "sonic-multilingual",
    sttModel: "nova-2-general",
  },
  {
    value: "german-reporter-man",
    label: "German Reporter Man",
    ttsProvider: "cartesia",
    languages: ["de"],
    voiceId: "3f6e78a8-5283-42aa-b5e7-af82e8bb310c",
    ttsModel: "sonic-multilingual",
    sttModel: "nova-2-general",
  },
  {
    value: "german-reporter-woman",
    label: "German Reporter Woman",
    ttsProvider: "cartesia",
    languages: ["de"],
    voiceId: "119e03e4-0705-43c9-b3ac-a658ce2b6639",
    ttsModel: "sonic-multilingual",
    sttModel: "nova-2-general",
  },
  {
    value: "german-storyteller-man",
    label: "German Storyteller Man",
    ttsProvider: "cartesia",
    languages: ["de"],
    voiceId: "db229dfe-f5de-4be4-91fd-7b077c158578",
    ttsModel: "sonic-multilingual",
    sttModel: "nova-2-general",
  },
  {
    value: "german-woman",
    label: "German Woman",
    ttsProvider: "cartesia",
    languages: ["de"],
    voiceId: "b9de4a89-2257-424b-94c2-db18ba68c81a",
    ttsModel: "sonic-multilingual",
    sttModel: "nova-2-general",
  },
  // FRENCH
  {
    value: "calm-french-woman",
    label: "Calm French Woman",
    ttsProvider: "cartesia",
    languages: ["fr"],
    voiceId: "a8a1eb38-5f15-4c1d-8722-7ac0f329727d",
    ttsModel: "sonic-multilingual",
    sttModel: "nova-2-general",
  },
  {
    value: "french-conversational-lady",
    label: "French Conversational Lady",
    ttsProvider: "cartesia",
    languages: ["fr"],
    voiceId: "a249eaff-1e96-4d2c-b23b-12efa4f66f41",
    ttsModel: "sonic-multilingual",
    sttModel: "nova-2-general",
  },
  {
    value: "french-narrator-lady",
    label: "French Narrator Lady",
    ttsProvider: "cartesia",
    languages: ["fr"],
    voiceId: "8832a0b5-47b2-4751-bb22-6a8e2149303d",
    ttsModel: "sonic-multilingual",
    sttModel: "nova-2-general",
  },
  {
    value: "french-narrator-man",
    label: "French Narrator Man",
    ttsProvider: "cartesia",
    languages: ["fr"],
    voiceId: "5c3c89e5-535f-43ef-b14d-f8ffe148c1f0",
    ttsModel: "sonic-multilingual",
    sttModel: "nova-2-general",
  },
  {
    value: "friendly-french-man",
    label: "Friendly French Man",
    ttsProvider: "cartesia",
    languages: ["fr"],
    voiceId: "ab7c61f5-3daa-47dd-a23b-4ac0aac5f5c3",
    ttsModel: "sonic-multilingual",
    sttModel: "nova-2-general",
  },
  {
    value: "helpful-french-lady",
    label: "Helpful French Lady",
    ttsProvider: "cartesia",
    languages: ["fr"],
    voiceId: "65b25c5d-ff07-4687-a04c-da2f43ef6fa9",
    ttsModel: "sonic-multilingual",
    sttModel: "nova-2-general",
  },
  {
    value: "stern-french-man",
    label: "Stern French Man",
    ttsProvider: "cartesia",
    languages: ["fr"],
    voiceId: "0418348a-0ca2-4e90-9986-800fb8b3bbc0",
    ttsModel: "sonic-multilingual",
    sttModel: "nova-2-general",
  },
  // SPANISH
  {
    value: "mexican-man",
    label: "Mexican Man",
    ttsProvider: "cartesia",
    languages: ["es"],
    voiceId: "15d0c2e2-8d29-44c3-be23-d585d5f154a1",
    ttsModel: "sonic-multilingual",
    sttModel: "nova-2-general",
  },
  {
    value: "mexican-woman",
    label: "Mexican Woman",
    ttsProvider: "cartesia",
    languages: ["es"],
    voiceId: "5c5ad5e7-1020-476b-8b91-fdcbe9cc313c",
    ttsModel: "sonic-multilingual",
    sttModel: "nova-2-general",
  },
  {
    value: "spanish-narrator-lady",
    label: "Spanish Narrator Lady",
    ttsProvider: "cartesia",
    languages: ["es"],
    voiceId: "2deb3edf-b9d8-4d06-8db9-5742fb8a3cb2",
    ttsModel: "sonic-multilingual",
    sttModel: "nova-2-general",
  },
  {
    value: "spanish-narrator-man",
    label: "Spanish Narrator Man",
    ttsProvider: "cartesia",
    languages: ["es"],
    voiceId: "a67e0421-22e0-4d5b-b586-bd4a64aee41d",
    ttsModel: "sonic-multilingual",
    sttModel: "nova-2-general",
  },
  {
    value: "spanish-speaking-lady",
    label: "Spanish Speaking Lady",
    ttsProvider: "cartesia",
    languages: ["es"],
    voiceId: "846d6cb0-2301-48b6-9683-48f5618ea2f6",
    ttsModel: "sonic-multilingual",
    sttModel: "nova-2-general",
  },
  {
    value: "spanish-speaking-man",
    label: "Spanish Speaking Man",
    ttsProvider: "cartesia",
    languages: ["es"],
    voiceId: "34dbb662-8e98-413c-a1ef-1a3407675fe7",
    ttsModel: "sonic-multilingual",
    sttModel: "nova-2-general",
  },
  {
    value: "spanish-speaking-reporter-man",
    label: "Spanish Speaking Reporter Man",
    ttsProvider: "cartesia",
    languages: ["es"],
    voiceId: "2695b6b5-5543-4be1-96d9-3967fb5e7fec",
    ttsModel: "sonic-multilingual",
    sttModel: "nova-2-general",
  },
  {
    value: "young-spanish-speaking-woman",
    label: "Young Spanish Speaking Woman",
    ttsProvider: "cartesia",
    languages: ["es"],
    voiceId: "db832ebd-3cb6-42e7-9d47-912b425adbaa",
    ttsModel: "sonic-multilingual",
    sttModel: "nova-2-general",
  },
  {
    value: "spanish-speaking-storyteller-man",
    label: "Spanish Speaking Storyteller Man",
    ttsProvider: "cartesia",
    languages: ["es"],
    voiceId: "846fa30b-6e1a-49b9-b7df-6be47092a09a",
    ttsModel: "sonic-multilingual",
    sttModel: "nova-2-general",
  },
  // PORTUGUESE
  {
    value: "brazilian-young-man",
    label: "Brazilian Young Man",
    ttsProvider: "cartesia",
    languages: ["pt"],
    voiceId: "5063f45b-d9e0-4095-b056-8f3ee055d411",
    ttsModel: "sonic-multilingual",
    sttModel: "nova-2-general",
  },
  {
    value: "friendly-brazilian-man",
    label: "Friendly Brazilian Man",
    ttsProvider: "cartesia",
    languages: ["pt"],
    voiceId: "6a16c1f4-462b-44de-998d-ccdaa4125a0a",
    ttsModel: "sonic-multilingual",
    sttModel: "nova-2-general",
  },
  {
    value: "pleasant-brazilian-lady",
    label: "Pleasant Brazilian Lady",
    ttsProvider: "cartesia",
    languages: ["pt"],
    voiceId: "700d1ee3-a641-4018-ba6e-899dcadc9e2b",
    ttsModel: "sonic-multilingual",
    sttModel: "nova-2-general",
  },
  // CHINESE
  {
    value: "chinese-call-center-man",
    label: "Chinese Call Center Man",
    ttsProvider: "cartesia",
    languages: ["zh"],
    voiceId: "3a63e2d1-1c1e-425d-8e79-5100bc910e90",
    ttsModel: "sonic-multilingual",
    sttModel: "nova-2-general",
  },
  {
    value: "chinese-commercial-man",
    label: "Chinese Commercial Man",
    ttsProvider: "cartesia",
    languages: ["zh"],
    voiceId: "eda5bbff-1ff1-4886-8ef1-4e69a77640a0",
    ttsModel: "sonic-multilingual",
    sttModel: "nova-2-general",
  },
  {
    value: "chinese-commercial-woman",
    label: "Chinese Commercial Woman",
    ttsProvider: "cartesia",
    languages: ["zh"],
    voiceId: "0b904166-a29f-4d2e-bb20-41ca302f98e9",
    ttsModel: "sonic-multilingual",
    sttModel: "nova-2-general",
  },
  {
    value: "chinese-female-conversational",
    label: "Chinese Female Conversational",
    ttsProvider: "cartesia",
    languages: ["zh"],
    voiceId: "e90c6678-f0d3-4767-9883-5d0ecf5894a8",
    ttsModel: "sonic-multilingual",
    sttModel: "nova-2-general",
  },
  {
    value: "chinese-woman-narrator",
    label: "Chinese Woman Narrator",
    ttsProvider: "cartesia",
    languages: ["zh"],
    voiceId: "d4d4b115-57a0-48ea-9a1a-9898966c2966",
    ttsModel: "sonic-multilingual",
    sttModel: "nova-2-general",
  },
  // JAPANESE
  {
    value: "japanese-children-book",
    label: "Japanese Children Book",
    ttsProvider: "cartesia",
    languages: ["ja"],
    voiceId: "44863732-e415-4084-8ba1-deabe34ce3d2",
    ttsModel: "sonic-multilingual",
    sttModel: "nova-2-general",
  },
  {
    value: "japanese-male-conversational",
    label: "Japanese Male Conversational",
    ttsProvider: "cartesia",
    languages: ["ja"],
    voiceId: "e8a863c6-22c7-4671-86ca-91cacffc038d",
    ttsModel: "sonic-multilingual",
    sttModel: "nova-2-general",
  },
  {
    value: "japanese-man-book",
    label: "Japanese Man Book",
    ttsProvider: "cartesia",
    languages: ["ja"],
    voiceId: "97e7d7a9-dfaa-4758-a936-f5f844ac34cc",
    ttsModel: "sonic-multilingual",
    sttModel: "nova-2-general",
  },
  {
    value: "japanese-woman-conversational",
    label: "Japanese Woman Conversational",
    ttsProvider: "cartesia",
    languages: ["ja"],
    voiceId: "2b568345-1d48-4047-b25f-7baccf842eb0",
    ttsModel: "sonic-multilingual",
    sttModel: "nova-2-general",
  },
  // ElevenLabs voices
  // ENGLISH: Default voices only
  {
    value: "alice",
    label: "Alice",
    ttsProvider: "elevenlabs",
    languages: ["en"],
    voiceId: "Xb7hH8MSUJpSbSDYk0k2",
    ttsModel: "eleven_turbo_v2_5",
    sttModel: "nova-2-conversationalai",
  },
  {
    value: "bill",
    label: "Bill",
    ttsProvider: "elevenlabs",
    languages: ["en"],
    voiceId: "pqHfZKP75CvOlQylNhV4",
    ttsModel: "eleven_turbo_v2_5",
    sttModel: "nova-2-conversationalai",
  },
  {
    value: "brian",
    label: "Brian",
    ttsProvider: "elevenlabs",
    languages: ["en"],
    voiceId: "nPczCjzI2devNBz1zQrb",
    ttsModel: "eleven_turbo_v2_5",
    sttModel: "nova-2-conversationalai",
  },
  {
    value: "callum",
    label: "Callum",
    ttsProvider: "elevenlabs",
    languages: ["en"],
    voiceId: "N2lVS1w4EtoT3dr4eOWO",
    ttsModel: "eleven_turbo_v2_5",
    sttModel: "nova-2-conversationalai",
  },
  {
    value: "charlie",
    label: "Charlie",
    ttsProvider: "elevenlabs",
    languages: ["en"],
    voiceId: "IKne3meq5aSn9XLyUdCD",
    ttsModel: "eleven_turbo_v2_5",
    sttModel: "nova-2-conversationalai",
  },
  {
    value: "charlotte",
    label: "Charlotte",
    ttsProvider: "elevenlabs",
    languages: ["en"],
    voiceId: "XB0fDUnXU5powFXDhCwa",
    ttsModel: "eleven_turbo_v2_5",
    sttModel: "nova-2-conversationalai",
  },
  {
    value: "chris",
    label: "Chris",
    ttsProvider: "elevenlabs",
    languages: ["en"],
    voiceId: "iP95p4xoKVk53GoZ742B",
    ttsModel: "eleven_turbo_v2_5",
    sttModel: "nova-2-conversationalai",
  },
  {
    value: "daniel",
    label: "Daniel",
    ttsProvider: "elevenlabs",
    languages: ["en"],
    voiceId: "onwK4e9ZLuTAKqWW03F9",
    ttsModel: "eleven_turbo_v2_5",
    sttModel: "nova-2-conversationalai",
  },
  {
    value: "eric",
    label: "Eric",
    ttsProvider: "elevenlabs",
    languages: ["en"],
    voiceId: "cjVigY5qzO86Huf0OWal",
    ttsModel: "eleven_turbo_v2_5",
    sttModel: "nova-2-conversationalai",
  },
  {
    value: "george",
    label: "George",
    ttsProvider: "elevenlabs",
    languages: ["en"],
    voiceId: "JBFqnCBsd6RMkjVDRZzb",
    ttsModel: "eleven_turbo_v2_5",
    sttModel: "nova-2-conversationalai",
  },
  {
    value: "jessica",
    label: "Jessica",
    ttsProvider: "elevenlabs",
    languages: ["en"],
    voiceId: "cgSgspJ2msm6clMCkdW9",
    ttsModel: "eleven_turbo_v2_5",
    sttModel: "nova-2-conversationalai",
  },
  {
    value: "laura",
    label: "Laura",
    ttsProvider: "elevenlabs",
    languages: ["en"],
    voiceId: "FGY2WhTYpPnrIDTdsKH5",
    ttsModel: "eleven_turbo_v2_5",
    sttModel: "nova-2-conversationalai",
  },
  {
    value: "liam",
    label: "Liam",
    ttsProvider: "elevenlabs",
    languages: ["en"],
    voiceId: "TX3LPaxmHKxFdv7VOQHJ",
    ttsModel: "eleven_turbo_v2_5",
    sttModel: "nova-2-conversationalai",
  },
  {
    value: "lily",
    label: "Lily",
    ttsProvider: "elevenlabs",
    languages: ["en"],
    voiceId: "pFZP5JQG7iQjIQuC4Bku",
    ttsModel: "eleven_turbo_v2_5",
    sttModel: "nova-2-conversationalai",
  },
  {
    value: "matilda",
    label: "Matilda",
    ttsProvider: "elevenlabs",
    languages: ["en"],
    voiceId: "XrExE9yKIg1WjnnlVkGX",
    ttsModel: "eleven_turbo_v2_5",
    sttModel: "nova-2-conversationalai",
  },
  {
    value: "sarah",
    label: "Sarah",
    ttsProvider: "elevenlabs",
    languages: ["en"],
    voiceId: "EXAVITQu4vr4xnSDxMaL",
    ttsModel: "eleven_turbo_v2_5",
    sttModel: "nova-2-conversationalai",
  },
  {
    value: "will",
    label: "Will",
    ttsProvider: "elevenlabs",
    languages: ["en"],
    voiceId: "bIHbv24MWmeRgasZH58o",
    ttsModel: "eleven_turbo_v2_5",
    sttModel: "nova-2-conversationalai",
  },
  // OpenAI TTS voices
  {
    value: "alloy",
    label: "Alloy",
    ttsProvider: "openai",
    languages: ["en"],
    voiceId: "alloy",
    ttsModel: "tts-1",
    sttModel: "nova-2-general",
  },
  {
    value: "echo",
    label: "Echo",
    ttsProvider: "openai",
    languages: ["en"],
    voiceId: "echo",
    ttsModel: "tts-1",
    sttModel: "nova-2-general",
  },
  {
    value: "fable",
    label: "Fable",
    ttsProvider: "openai",
    languages: ["en"],
    voiceId: "fable",
    ttsModel: "tts-1",
    sttModel: "nova-2-general",
  },
  {
    value: "onyx",
    label: "Onyx",
    ttsProvider: "openai",
    languages: ["en"],
    voiceId: "onyx",
    ttsModel: "tts-1",
    sttModel: "nova-2-general",
  },
  {
    value: "nova",
    label: "Nova",
    ttsProvider: "openai",
    languages: ["en"],
    voiceId: "nova",
    ttsModel: "tts-1",
    sttModel: "nova-2-general",
  },
  {
    value: "shimmer",
    label: "Shimmer",
    ttsProvider: "openai",
    languages: ["en"],
    voiceId: "shimmer",
    ttsModel: "tts-1",
    sttModel: "nova-2-general",
  },
  // PlayHT voices
  {
    value: "adrian",
    label: "Adrian (US)",
    ttsProvider: "playht",
    languages: ["en"],
    voiceId:
      "s3://voice-cloning-zero-shot/d99d35e6-e625-4fa4-925a-d65172d358e1/adriansaad/manifest.json",
    sttModel: "nova-2-general",
  },
  {
    value: "benton",
    label: "Benton (US)",
    ttsProvider: "playht",
    languages: ["en"],
    voiceId:
      "s3://voice-cloning-zero-shot/b41d1a8c-2c99-4403-8262-5808bc67c3e0/bentonsaad/manifest.json",
    sttModel: "nova-2-general",
  },
  {
    value: "charles",
    label: "Charles (US)",
    ttsProvider: "playht",
    languages: ["en"],
    voiceId:
      "s3://voice-cloning-zero-shot/9f1ee23a-9108-4538-90be-8e62efc195b6/charlessaad/manifest.json",
    sttModel: "nova-2-general",
  },
  {
    value: "delilah",
    label: "Delilah (US)",
    ttsProvider: "playht",
    languages: ["en"],
    voiceId:
      "s3://voice-cloning-zero-shot/1afba232-fae0-4b69-9675-7f1aac69349f/delilahsaad/manifest.json",
    sttModel: "nova-2-general",
  },
  {
    value: "nova",
    label: "Nova (US)",
    ttsProvider: "playht",
    languages: ["en"],
    voiceId:
      "s3://voice-cloning-zero-shot/2a7ddfc5-d16a-423a-9441-5b13290998b8/novasaad/manifest.json",
    sttModel: "nova-2-general",
  },
  {
    value: "susan",
    label: "Susan (US)",
    ttsProvider: "playht",
    languages: ["en"],
    voiceId:
      "s3://voice-cloning-zero-shot/65e66dc8-9273-43c8-889a-83e858bf2bb8/susansaad/manifest.json",
    sttModel: "nova-2-general",
  },
  {
    value: "amelia",
    label: "Amelia (UK)",
    ttsProvider: "playht",
    languages: ["en"],
    voiceId:
      "s3://voice-cloning-zero-shot/34eaa933-62cb-4e32-adb8-c1723ef85097/original/manifest.json",
    sttModel: "nova-2-general",
  },
  {
    value: "frederick",
    label: "Frederick (UK)",
    ttsProvider: "playht",
    languages: ["en"],
    voiceId:
      "s3://voice-cloning-zero-shot/2879ab87-3775-4992-a228-7e4f551658c2/fredericksaad2/manifest.json",
    sttModel: "nova-2-general",
  },
  {
    value: "indigo",
    label: "Indigo (UK)",
    ttsProvider: "playht",
    languages: ["en"],
    voiceId:
      "s3://voice-cloning-zero-shot/97580643-b568-4198-aaa4-3e07e4a06c47/original/manifest.json",
    sttModel: "nova-2-general",
  },
  {
    value: "isabella",
    label: "Isabella (UK)",
    ttsProvider: "playht",
    languages: ["en"],
    voiceId:
      "s3://voice-cloning-zero-shot/a0fa25cc-5f42-4dd0-8a78-a950dd5297cd/original/manifest.json",
    sttModel: "nova-2-general",
  },
];

export const defaultVoice = voiceOptions[0];

export function getVoice(voiceId: string) {
  return voiceOptions.find((v) => v.voiceId === voiceId);
}

export function getVoicesByProvider(provider: string, language?: string) {
  return voiceOptions
    .filter((v) => v.ttsProvider === provider)
    .filter((v) => (language ? v.languages.includes(language) : true));
}
