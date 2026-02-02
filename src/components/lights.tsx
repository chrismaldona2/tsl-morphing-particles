export default function Lights() {
  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight intensity={1.5} position={[0, 2, 1]} />
    </>
  );
}
