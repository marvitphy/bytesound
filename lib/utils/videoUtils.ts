export const getRandomVideo = (videos: { id: string; duration: number }[]) => {
    const video = videos[Math.floor(Math.random() * videos.length)];
    const start = Math.floor(Math.random() * video.duration);
    return { ...video, start };
  };
  