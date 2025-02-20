"use client";
import { Play, Pause, RefreshCw, Plus, Trash } from "lucide-react";
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
    handleCreateCustomPreset,
    handleDeleteCustomPreset,
  } = useSoundsPlayer();

  const isFirstRender = useIsFirstRender();
  return (
    <div className="flex relative overflow-y-hidden bg-neutral-950 text-white justify-center items-center min-h-screen max-h-screen font-[family-name:var(--font-geist-sans)] ">
      <video
        autoPlay
        loop
        muted
        src="/bg-video.mp4"
        className="absolute opacity-20 w-[calc(100%+250px)] object-cover h-full"
      />
      <div id="youtube-player" className="hidden"></div>

      <div className="relative  z-0 w-full sm:w-fit flex items-center flex-col gap-4 justify-center ">
        <div className="sm:w-[100px] w-full transition-all  sm:hover:bg-white/20 bottom-0 sm:h-full right-0 sm:translate-x-[120px] bg-white/10 border-b sm:border border-white/20 backdrop-blur-xl sm:backdrop-blur-sm z-50 fixed h-fit rounded-none sm:rounded-2xl top-0  flex flex-col items-center justify-start text-neutral-200 sm:absolute py-4 gap-2">
          <span className="hidden sm:block">Presets</span>
          <div className="sm:flex overflow-x-auto flex sm:flex-col py-2 px-5 sm:p-2 gap-2 w-full">
            {Object.entries(soundsPresets).map(([presetName, presets]) => (
              <div key={presetName} className="grow">
                {presets.map((preset, index) => {
                  const Icon = presetIcons[presetName];
                  return (
                    <>
                      <motion.button
                        key={index}
                        onClick={() => handleSelectPreset(presetName)}
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
                        className="flex relative hover:bg-black/20 data-[selected=true]:bg-white/30 transition-all flex-col gap-2 w-full
                         py-3 md:px-0 rounded-lg items-center justify-center border border-neutral-500 text-sm"
                        exit={{ opacity: 0 }}
                        data-playing={playing[presetName] ? "true" : "false"}
                      >
                        {presetName === "Custom" && (
                          <button
                            onClick={handleDeleteCustomPreset}
                            className="w-6 h-6 rounded-full bg-white/20 absolute top-[-5px] right-[-5px] flex items-center justify-center"
                          >
                            <Trash size={14} />
                          </button>
                        )}
                        {Icon && <Icon size={24} />}

                        <span>{presetName}</span>
                      </motion.button>
                    </>
                  );
                })}
              </div>
            ))}

            {anySoundPlaying && !selectedPreset && (
              <div className="grow">
                <motion.button
                  onClick={() => handleCreateCustomPreset()}
                  whileTap={{ scale: 1.1 }}
                  transition={{
                    duration: 0.2,
                    delay: isFirstRender ? 0.2 * 4 : 0,
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex relative hover:bg-black/20 data-[selected=true]:bg-white/30 transition-all flex-col gap-2 w-full
                         py-3 md:px-0 rounded-lg items-center justify-center border border-neutral-500 text-sm"
                  exit={{ opacity: 0 }}
                >
                  <Plus size={24} />
                  <span>Custom Preset</span>
                </motion.button>
              </div>
            )}
          </div>
        </div>
        <div className="h-screen md:h-full pt-[9rem] md:pt-0 md:pb-0 md:px-0 pb-20 px-4 scrollbar-hide overflow-y-auto w-full">
          <div
            className="h-screen md:h-[650px] overflow-y-auto dmt-32 md:mt-0  flex-col z-20  bg-white/10 border border-white/25 backdrop-blur-md w-full  md:w-[700px] rounded-2xl grid grid-cols-2 md:grid-cols-4
           px-6 pt-6 pb-10 md:px-10 md:py-10 gap-3 "
          >
            {sounds.map((sound, index) => (
              <motion.button
                onClick={() => togglePlay(sound)}
                key={index}
                // whileHover={{ scale: 1.05 }}
                // whileTap={{ scale: 1.1 }}
                transition={{
                  duration: 0.2,
                  delay: isFirstRender ? 0.2 * index : 0,
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ opacity: 0 }}
                // disabled all less the with preset
                // disabled={selectedPreset && !playing[sound.name] ? true : false}
                data-playing={playing[sound.name] ? "true" : "false"}
                className="w-full min-h-32 md:min-h-0 l relative group disabled:opacity-60 h-full data-[playing=false]:opacity-50 opacity-100 flex flex-col justify-between items-center transition-all place-self-center bg-white/10 border border-white/20 backdrop-blur-sm rounded-lg py-4 px-2"
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
                        <p>Shuffle</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                <motion.div
                  whileTap={{ scale: 1.2 }}
                  whileHover={{ scale: 1.1 }}
                  className="w-[calc(100%-20px)]"
                  transition={{
                    duration: 0.2,
                    delay: isFirstRender ? 0.2 * index : 0,
                  }}
                >
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
                </motion.div>
              </motion.button>
            ))}
          </div>
        </div>

        <button
          onClick={handleToggleAllSounds}
          // disabled={true}
          className="w-[250px] disabled:opacity-60 transition-all hover:scale-105 hover:bg-white/20 bottom-4 md:bottom-0 h-fit inset-x-0 b mx-auto md:translate-y-1/2 bg-white/10 border border-white/20 active:bg-white/40 backdrop-blur-sm z-50 rounded-full  flex items-center justify-center fixed md:absolute py-2 gap-2"
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
