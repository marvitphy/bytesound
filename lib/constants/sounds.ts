import {
  Cloud,
  Waves,
  Wind,
  Bird,
  CloudLightning,
  HeartPulse,
  Music,
  AudioWaveform,
  Clock,
  Music2Icon,
  Disc3,
  DiscAlbum,
} from "lucide-react";

export const sounds = [
  {
    name: "Rain",
    url: "https://pqbnoyezospypjajwdzi.supabase.co/storage/v1/object/public/thinktalk/uploads/9550971f-b3c2-4876-a962-2e265d903e41",
    icon: Cloud,
  },
  {
    name: "Waves",
    url: "https://pqbnoyezospypjajwdzi.supabase.co/storage/v1/object/public/thinktalk/uploads/db01d241-ac5f-4cd0-8004-b8b1902cbc03",
    icon: Waves,
  },
  {
    name: "Wind",
    url: "https://pqbnoyezospypjajwdzi.supabase.co/storage/v1/object/public/thinktalk/uploads/5984a1d2-a384-455f-a397-131b8ee12516",
    icon: Wind,
  },
  {
    name: "Birds",
    url: "https://pqbnoyezospypjajwdzi.supabase.co/storage/v1/object/public/thinktalk/uploads/847eb388-2984-443d-b7d8-5a2b813e00a7",
    icon: Bird,
  },
  {
    name: "Thunder",
    url: "https://pqbnoyezospypjajwdzi.supabase.co/storage/v1/object/public/thinktalk/uploads/b535fa87-b6c7-4489-96f6-fd4d378bb662",
    icon: CloudLightning,
  },
  {
    name: "Weightless",
    url: "https://pqbnoyezospypjajwdzi.supabase.co/storage/v1/object/public/thinktalk/uploads/b8426ce8-0da9-4dc6-9fd7-956587874b15",
    icon: HeartPulse,
  },

  {
    name: "Lofi",
    url: "M7lc1UVf-VE",
    icon: Music,
    youtube: true,
    genre: "lofi", // Adicionado
  },
  {
    name: "Classical",
    url: "mdJU5ogrPMY",
    icon: Music2Icon,
    youtube: true,
    genre: "classical",
  },
  {
    name: "Downtempo",
    url: "mdJU5ogrPMY",
    icon: Disc3,
    youtube: true,
    genre: "downtempo",
  },
  {
    name: "Brown Noise",
    url: "https://pqbnoyezospypjajwdzi.supabase.co/storage/v1/object/public/thinktalk/uploads/f668a1a3-c2eb-404f-bcff-916ae4d2bbfe",
    icon: AudioWaveform,
  },
  {
    name: "Clock",
    url: "https://pqbnoyezospypjajwdzi.supabase.co/storage/v1/object/public/thinktalk/uploads/ad71eba0-a654-4517-95cc-68bd0f75e320",
    icon: Clock,
  },
  {
    name: "Groove",
    url: "mdJU5ogrPMY",
    icon: DiscAlbum,
    youtube: true,
    genre: "groove",
  },
];
