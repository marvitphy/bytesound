"use client";
import { Play, Pause, RefreshCw } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { lofiIds } from "@/lib/constants/lofiVideoIds";
import { useIsFirstRender } from "@uidotdev/usehooks";
import { sounds } from "@/lib/constants/sounds";

export default function Home() {
  const [audioElements, setAudioElements] = useState<{
    [key: string]: HTMLAudioElement | null;
  }>({});
  const [playing, setPlaying] = useState<{ [key: string]: boolean }>({});
  const [volume, setVolume] = useState<{ [key: string]: number }>({});
  const isFirstRender = useIsFirstRender();
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

    console.log(video);

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
        },
      });
    };
  }, []);

  useEffect(() => {
    if (!playing["Lofi"] && !playing["Classical"]) return;
    const video =
      videosByGenre[Math.floor(Math.random() * videosByGenre.length)];
    const start = Math.floor(Math.random() * video.duration);

    if (genreSelected === "classical") {
      setPlaying((prev) => ({ ...prev, Lofi: false }));
      setPlaying((prev) => ({ ...prev, Classical: true }));
    } else {
      setPlaying((prev) => ({ ...prev, Lofi: true }));
      setPlaying((prev) => ({ ...prev, Classical: false }));
    }

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

  const handleRandomizeYoutube = () => {
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
  };

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
  const [previouslyPlaying, setPreviouslyPlaying] = useState<{
    [key: string]: boolean;
  }>({});
  const handleToggleAllSounds = () => {
    if (anySoundPlaying) {
      // Salva os sons que estão tocando atualmente antes de pausar tudo
      setPreviouslyPlaying(playing);
      Object.keys(playing).forEach((key) => {
        if (playing[key]) {
          togglePlay(sounds.find((sound) => sound.name === key) || sounds[0]);
        }
      });
    } else {
      // Retoma os sons que estavam tocando antes da pausa
      Object.keys(previouslyPlaying).forEach((key) => {
        if (previouslyPlaying[key]) {
          togglePlay(sounds.find((sound) => sound.name === key) || sounds[0]);
        }
      });
      setPreviouslyPlaying({}); // Limpa o estado após retomar os sons
    }
  };

  const anySoundPlaying = Object.values(playing).some((value) => value);

  return (
    <div className="flex relative overflow-y-hidden bg-neutral-950 text-white justify-center items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <video
        autoPlay
        loop
        muted
        src="/bg-video.mp4"
        className="absolute opacity-20 w-[calc(100%+250px)] object-cover h-full"
      />
      <div id="youtube-player" className="hidden"></div>

      <div className="relative">
        <div className="h-full flex flex-col z-50 min-h-[650px] bg-white/10 border border-white/25 backdrop-blur-md w-[700px] rounded-2xl">
          <div className="flex-1 w-full h-full grid grid-rows-4 grid-cols-4 p-10 gap-3 ">
            {sounds.map((sound, index) => (
              <motion.button
                onClick={() => togglePlay(sound)}
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 1.1 }}
                transition={{
                  duration: 0.2,
                  delay: isFirstRender ? 0.2 * index : 0,
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ opacity: 0 }}
                data-playing={playing[sound.name] ? "true" : "false"}
                className="w-full relative group h-full data-[playing=false]:opacity-50 opacity-100 flex flex-col justify-between items-center transition-all place-self-center bg-white/10 border border-white/20 backdrop-blur-sm rounded-lg py-4 px-2"
              >
                <div className="flex my-auto flex-col gap-2 items-center">
                  <sound.icon size={32} />
                  <span>{sound.name}</span>
                </div>

                {sound.youtube && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRandomizeYoutube();
                    }}
                    className="absolute active:bg-white/10 bg-white/20 p-2 rounded-xl top-1 right-1 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <RefreshCw size={18} />
                  </div>
                )}
                <Slider
                  className="self-end opacity-0 group-hover:opacity-100 transition-all"
                  defaultValue={[20]}
                  max={100}
                  disabled={!playing[sound.name]}
                  step={1}
                  onClick={(e) => e.stopPropagation()}
                  value={[volume[sound.name] || 20]}
                  onValueChange={(value) => changeVolume(sound, value)}
                />
              </motion.button>
            ))}
          </div>
        </div>

        <button
          onClick={handleToggleAllSounds}
          className="w-[250px] transition-all hover:scale-105 hover:bg-white/20 bottom-0 h-fit inset-x-0 mx-auto translate-y-1/2 bg-white/10 border border-white/20 backdrop-blur-sm rounded-full  flex items-center justify-center absolute py-2 gap-2"
        >
          <div className="border border-white/40 rounded-full p-2 text-white">
            {anySoundPlaying ? <Pause size={16} /> : <Play size={16} />}
          </div>
          <span>Ambient Sounds</span>
        </button>
      </div>
    </div>
  );
}
