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
  const [selectedPreset, setSelectedPreset] = useState<any>(soundsPresets);
  const [previouslyPlaying, setPreviouslyPlaying] = useState<{
    [key: string]: boolean;
  }>({});
  const [presets, setPresets] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);

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
            event.target.setVolume(
              volume["Lofi"] || volume["Downtempo"] || volume["Classical"] || 22
            );
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
  }, []);

  useEffect(() => {
    if (
      !playing["Lofi"] &&
      !playing["Classical"] &&
      !playing["Downtempo"] &&
      !playing["Groove"]
    )
      return;

    const video =
      videosByGenre[Math.floor(Math.random() * videosByGenre.length)];
    const start = Math.floor(Math.random() * video.duration);

    const genreState = {
      Lofi: genreSelected === "lofi",
      Classical: genreSelected === "classical",
      Downtempo: genreSelected === "downtempo",
      Groove: genreSelected === "groove",
    };

    setPlaying((prev) => ({
      ...prev,
      Lofi: genreState.Lofi,
      Classical: genreState.Classical,
      Downtempo: genreState.Downtempo,
      Groove: genreState.Groove,
    }));

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
    if (selectedPreset) setSelectedPreset("");
  };

  const handleCreateCustomPreset = useCallback(() => {
    const customPreset = Object.fromEntries(
      sounds.map((sound) => [sound.name, playing[sound.name]])
    );

    soundsPresets["Custom"] = [customPreset];
    setPresets([...presets, soundsPresets["Custom"]]);
  }, [playing, sounds]);

  const handleDeleteCustomPreset = useCallback(() => {
    setPresets(presets.filter((preset) => preset !== soundsPresets["Custom"]));
    delete soundsPresets["Custom"];
  }, []);

  const handleSelectPreset = useCallback(
    (preset: string) => {
      const presetSounds = soundsPresets[preset]?.[0] || {};

      if (preset === selectedPreset) {
        Object.entries({ ...presetSounds, ...previouslyPlaying }).forEach(
          ([soundName]) => {
            const sound = sounds.find((s) => s.name === soundName);
            if (sound) togglePlay(sound);
          }
        );

        if (playerRef.current) {
          playerRef.current.pauseVideo();
        }

        if (audioElements) {
          Object.keys(audioElements).forEach((key) => {
            const audio = audioElements[key];
            if (audio) audio.pause();
          });
        }

        setSelectedPreset("");
        setPlaying({});
        return;
      }

      Object.entries(playing).forEach(([soundName, isPlaying]) => {
        if (!presetSounds[soundName] && isPlaying) {
          const sound = sounds.find((s) => s.name === soundName);
          if (sound) togglePlay(sound);
        }
      });

      Object.entries(presetSounds).forEach(([soundName, shouldPlay]) => {
        if (shouldPlay && !playing[soundName]) {
          const sound = sounds.find((s) => s.name === soundName);
          if (sound) togglePlay(sound);
        }
      });

      setSelectedPreset(preset);
      setPlaying(presetSounds);
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
      const currentlyPlaying = Object.fromEntries(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Object.entries(playing).filter(([_, value]) => value)
      );
      setPreviouslyPlaying(currentlyPlaying);

      Object.keys(currentlyPlaying).forEach((key) => {
        const sound = sounds.find((sound) => sound.name === key);
        if (sound) {
          togglePlay(sound);
        }
      });

      setPlaying({});
      setAnySoundPlaying(false);
    } else {
      Object.keys(previouslyPlaying).forEach((key) => {
        const sound = sounds.find((sound) => sound.name === key);
        if (sound) {
          togglePlay(sound);
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
  }, [playing, audioElements]);

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
    handleCreateCustomPreset,
    handleDeleteCustomPreset,
  };
}
