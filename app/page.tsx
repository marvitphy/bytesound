"use client";
import { Play, Pause, RefreshCw } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";

import { useIsFirstRender } from "@uidotdev/usehooks";
import { sounds } from "@/lib/constants/sounds";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSoundsPlayer } from "@/lib/hooks/useSoundsPlayer";
import { soundsPresets, presetIcons } from "@/lib/constants/presets";

export default function Home() {
  const {
    anySoundPlaying,
    changeVolume,
    handleRandomizeYoutube,
    handleToggleAllSounds,
    playing,
    togglePlay,
    volume,
    handleSelectPreset,
    selectedPreset,
  } = useSoundsPlayer();

  const isFirstRender = useIsFirstRender();
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

      <div className="relative w-full md:w-fit flex items-center flex-col gap-4 justify-center">
        <div className="md:w-[100px] w-full transition-all  hover:bg-white/20 bottom-0 h-full right-0 md:translate-x-[120px] bg-white/10 border border-white/20 backdrop-blur-sm z-50 rounded-2xl  flex flex-col items-center justify-start text-neutral-200 md:absolute py-4 gap-2">
          <span>Presets</span>
          <div className="md:flex grid grid-cols-3 md:flex-col py-2 px-5 md:p-2 gap-2 w-full">
            {Object.entries(soundsPresets).map(([presetName, presets]) => (
              <div key={presetName}>
                {presets.map((preset, index) => {
                  const Icon = presetIcons[presetName];
                  return (
                    <motion.button
                      key={index}
                      onClick={() => handleSelectPreset(presetName)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 1.1 }}
                      transition={{
                        duration: 0.2,
                        delay: isFirstRender ? 0.2 * index : 0,
                      }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      data-selected={
                        presetName === selectedPreset ? "true" : "false"
                      }
                      className="flex hover:bg-black/20 data-[selected=true]:bg-white/30 transition-all flex-col gap-2 w-full py-3 md:px-0 rounded-lg items-center justify-center border border-neutral-500"
                      exit={{ opacity: 0 }}
                      data-playing={playing[presetName] ? "true" : "false"}
                    >
                      {Icon && <Icon size={24} />}
                      <span>{presetName}</span>
                    </motion.button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="h-full flex flex-col z-50 min-h-[650px] bg-white/10 border border-white/25 backdrop-blur-md w-full  md:w-[700px] rounded-2xl">
          <div
            className="flex-1 w-full h-full grid grid-cols-2 md:grid-cols-4
           px-6 py-10 md:px-10 md:py-10 gap-3 "
          >
            {sounds.map((sound, index) => (
              <motion.button
                onClick={() => (!selectedPreset ? togglePlay(sound) : () => {})}
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
                // disabled all less the with preset
                disabled={selectedPreset && !playing[sound.name] ? true : false}
                data-playing={playing[sound.name] ? "true" : "false"}
                className="w-full relative group disabled:opacity-60 h-full data-[playing=false]:opacity-50 opacity-100 flex flex-col justify-between items-center transition-all place-self-center bg-white/10 border border-white/20 backdrop-blur-sm rounded-lg py-4 px-2"
              >
                <div className="flex my-auto flex-col gap-2 items-center">
                  <sound.icon size={32} />
                  <span>{sound.name}</span>
                </div>

                {sound.youtube && (
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger disabled asChild>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRandomizeYoutube();
                          }}
                          data-disabled={!playing[sound.name]}
                          className="absolute data-[disabled=true]:pointer-events-none active:bg-white/10 bg-white/20 p-2 rounded-xl top-1 right-1 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <RefreshCw size={18} />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Randomize Music</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
          disabled={selectedPreset ? true : false}
          className="w-[250px] disabled:opacity-60 transition-all hover:scale-105 hover:bg-white/20 bottom-0 h-fit inset-x-0 mx-auto translate-y-1/2 bg-white/10 border border-white/20 backdrop-blur-sm z-50 rounded-full  flex items-center justify-center absolute py-2 gap-2"
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
