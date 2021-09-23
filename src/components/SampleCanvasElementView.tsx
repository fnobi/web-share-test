import { useRef } from "react";
import { css } from "@emotion/react";
import { em, percent } from "~/lib/cssUtil";
import useCanvasAgent from "~/lib/useCanvasAgent";
import SampleCanvasElementPlayer from "~/local/SampleCanvasElementPlayer";
import { basePath } from "~/local/constants";

declare global {
  interface ShareData {
    files?: File[];
    text?: string;
    title?: string;
    url?: string;
  }
}

const wrapperStyle = css({
  position: "fixed",
  top: percent(0),
  left: percent(0),
  width: percent(100),
  height: percent(100)
});

const canvasStyle = css({
  canvas: {
    position: "absolute",
    top: percent(0),
    left: percent(0),
    width: percent(100),
    height: percent(100)
  }
});

const footerStyle = css({
  position: "absolute",
  bottom: percent(0),
  right: percent(0),
  margin: em(1)
});

const canvasToBlob = (
  canvas: HTMLCanvasElement,
  type: string = "image/png"
) => {
  const dataUrl = canvas.toDataURL(type);
  const decodedData = window.atob(dataUrl.replace(/^.*,/, ""));
  const buffers = new Uint8Array(decodedData.length);
  for (let i = 0; i < decodedData.length; i += 1) {
    buffers[i] = decodedData.charCodeAt(i);
  }
  try {
    const blob = new Blob([buffers.buffer], {
      type
    });
    return blob;
  } catch {
    return null;
  }
};

const canvasToFile = (
  canvas: HTMLCanvasElement,
  name: string,
  type: string = "image/png"
) => {
  const blob = canvasToBlob(canvas, type);
  if (!blob) {
    return null;
  }
  return new File([blob], name, { type });
};

const SampleCanvasElementView = () => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const { playerRef } = useCanvasAgent({
    initializer: () => new SampleCanvasElementPlayer(),
    wrapperRef
  });
  const handleShare = () => {
    if (!window.navigator.share) {
      // eslint-disable-next-line no-alert
      window.alert("window.navigator.share is not supported.");
      return;
    }
    const { current: player } = playerRef;
    if (!player) {
      return;
    }
    const { canvas } = player;
    const imageFile = canvasToFile(canvas, "image.png", "image/png");
    window.navigator
      .share({
        text: "シェアするよ",
        url: process.env.SITE_ORIGIN + basePath,
        files: imageFile ? [imageFile] : undefined
      })
      .then(() => {
        // eslint-disable-next-line no-console
        console.log("done");
      });
  };
  return (
    <div css={wrapperStyle}>
      <div css={canvasStyle} ref={wrapperRef} />
      <div css={footerStyle}>
        <button type="button" onClick={handleShare}>
          Share
        </button>
      </div>
    </div>
  );
};

export default SampleCanvasElementView;
