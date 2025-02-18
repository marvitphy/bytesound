// hooks/useSoundsPlayer.ts
import { useCallback, useEffect, useRef, useState } from "react";
import { lofiIds } from "@/lib/constants/lofiVideoIds";
import { sounds } from "@/lib/constants/sounds";
import { soundsPresets } from "../constants/presets";

//type SoundsPresetsType = keyof typeof soundsPresets;

export function useSoundsPlayer() {
  const [audioElements, setAudioElements] = useState<{
    [key: string]: HTMLAudioElement | null;
  }>({});
  const [playing, setPlaying] = useState<{ [key: string]: boolean }>({});
  const [volume, setVolume] = useState<{ [key: string]: number }>({});
  const [anySoundPlaying, setAnySoundPlaying] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedPreset, setSelectedPreset] = useState<any>("");
  const [previouslyPlaying, setPreviouslyPlaying] = useState<{
    [key: string]: boolean;
  }>({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  const [genreSelected, setGenreSelected] = useState("lofi");
  const videosByGenre = lofiIds.filter(
    (video) => video.genre === genreSelected
  );

  useEffect(() => {
    // Carregar API do YouTube
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    const video =
      videosByGenre[Math.floor(Math.random() * videosByGenre.length)];

    const start = Math.floor(Math.random() * video.duration);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).onYouTubeIframeAPIReady = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      playerRef.current = new (window as any).YT.Player("youtube-player", {
        height: "0",
        width: "0",
        videoId: video.id,

        playerVars: {
          autoplay: 0,
          controls: 1,
          start: start,
        },
        events: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onReady: (event: any) => {
            event.target.setVolume(volume["Lofi"] || 22);
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onStateChange: (event: any) => {
            if (event.data === 0) {
              handleRandomizeYoutube();
            }
          },
        },
      });
    };

    return () => {
      Object.values(audioElements).forEach((audio) => audio?.pause());
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    // Se nenhum gênero estiver tocando, não é necessário alterar nada.
    const isAnyPlaying = Object.values(playing).some((status) => status);
    if (!isAnyPlaying) return;

    const video =
      videosByGenre[Math.floor(Math.random() * videosByGenre.length)];
    const start = Math.floor(Math.random() * video.duration);

    // Atualiza o estado para que somente o gênero selecionado fique ativo
    setPlaying((prev) => {
      const updated = Object.fromEntries(
        Object.keys(prev).map((key) => [
          key,
          key.toLowerCase() === genreSelected,
        ])
      );
      return updated;
    });

    if (playerRef.current) {
      playerRef.current.loadVideoById(
        {
          videoId: video.id,
          startSeconds: start,
        },
        start
      );
    }
  }, [genreSelected]);

  const handleRandomizeYoutube = useCallback(() => {
    const video =
      videosByGenre[Math.floor(Math.random() * videosByGenre.length)];
    const start = Math.floor(Math.random() * video.duration);

    if (playerRef.current) {
      playerRef.current.loadVideoById(
        {
          videoId: video.id,
          startSeconds: start,
        },
        start
      );
    }
  }, [videosByGenre]);

  const togglePlay = (sound: (typeof sounds)[number]) => {
    if (sound.youtube) {
      setGenreSelected(sound.genre);

      if (playerRef.current) {
        if (playing[sound.name]) {
          playerRef.current.pauseVideo();
        } else {
          playerRef.current.playVideo();
        }
      }
    } else {
      let audio = audioElements[sound.name];

      if (!audio) {
        audio = new Audio(sound.url);
        audio.loop = true;
        audio.volume = (volume[sound.name] || 20) / 100;
        setAudioElements((prev) => ({ ...prev, [sound.name]: audio }));
      }

      if (playing[sound.name]) {
        audio.pause();
      } else {
        audio.play();
      }
    }

    setPlaying((prev) => ({ ...prev, [sound.name]: !prev[sound.name] }));
  };

  const handleSelectPreset = useCallback(
    (preset) => {
      const presetSounds = soundsPresets[preset][0];
      if (preset === selectedPreset) {
        // Pausar todos os sons ao selecionar o preset atual
        Object.entries(presetSounds).forEach(([soundName]) => {
          const sound = sounds.find((s) => s.name === soundName);
          if (sound) togglePlay(sound);
        });
        setSelectedPreset("");
        setPlaying({});
        return;
      }

      const isPresetActive = Object.entries(presetSounds).every(
        ([soundName, shouldPlay]) => playing[soundName] === shouldPlay
      );

      // Pausar todos os sons antes de selecionar o novo preset
      Object.entries(playing).forEach(([soundName]) => {
        const sound = sounds.find((s) => s.name === soundName);
        if (sound) togglePlay(sound);
      });

      setSelectedPreset(isPresetActive ? "" : preset);
      setPlaying(isPresetActive ? {} : soundsPresets[preset]);

      // Tocar os sons do novo preset
      Object.entries(presetSounds).forEach(([soundName, shouldPlay]) => {
        const sound = sounds.find((s) => s.name === soundName);
        if (sound && (shouldPlay || playing[soundName])) {
          togglePlay(sound);
        }
      });
    },
    [playing, selectedPreset, soundsPresets, sounds, togglePlay]
  );

  const changeVolume = (sound: (typeof sounds)[number], value: number[]) => {
    if (sound.youtube) {
      if (playerRef.current) {
        playerRef.current.setVolume(value[0]);
      }
    } else {
      const audio = audioElements[sound.name];
      if (audio) {
        audio.volume = value[0] / 100;
      }
    }

    setVolume((prev) => ({ ...prev, [sound.name]: value[0] }));
  };

  const handleToggleAllSounds = () => {
    const isAnySoundPlaying = Object.values(playing).some((value) => value);

    if (isAnySoundPlaying) {
      setPreviouslyPlaying(playing);

      Object.keys(playing).forEach((key) => {
        const sound = sounds.find((sound) => sound.name === key);
        if (sound) {
          togglePlay(sound);
        }
      });

      setAnySoundPlaying(false);
    } else {
      Object.keys(previouslyPlaying).forEach((key) => {
        if (previouslyPlaying[key]) {
          const sound = sounds.find((sound) => sound.name === key);
          if (sound) {
            togglePlay(sound);
          }
        }
      });
      setPreviouslyPlaying({});
    }
  };
  
  useEffect(() => {
    const isAnySoundPlaying =
      Object.values(playing).some((value) => value) ||
      Object.values(audioElements).some(
        (audio) => audio && audio.readyState > 2 && !audio.paused
      );
    setAnySoundPlaying(isAnySoundPlaying);
  }, [playing, audioElements]); // Dependendo do `playing` e `audioElements`

  return {
    togglePlay,
    changeVolume,
    handleToggleAllSounds,
    handleRandomizeYoutube,
    playing,
    volume,
    anySoundPlaying,
    selectedPreset,
    handleSelectPreset,
  };
}
