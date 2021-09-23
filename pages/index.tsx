import dynamic from "next/dynamic";

const SampleCanvasElementView = dynamic(
  () => import("~/components/SampleCanvasElementView"),
  {
    ssr: false
  }
);

const PageIndex = () => <SampleCanvasElementView />;

export default PageIndex;
