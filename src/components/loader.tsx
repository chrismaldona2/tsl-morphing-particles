import { useProgress } from "@react-three/drei";

export default function Loader() {
  const { active, progress } = useProgress();

  if (!active) return null;

  return (
    <div className="absolute top-0 left-0 z-50 flex h-full w-full flex-col items-center justify-center gap-3 text-white">
      <div className="text-xl">{progress.toFixed(0)}%</div>

      <div className="h-1 w-50 overflow-hidden rounded-sm bg-[#333]">
        <div
          className="h-full bg-white transition-all duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
