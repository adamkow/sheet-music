import Image from "next/image";
import Sheet from "./components/Sheet";
import Piano from "./components/Piano";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-white font-sans">
      <main className="min-h-screen w-full bg-white">
        <section className="w-full h-[50vh] overflow-hidden">
          <div className="mx-auto h-full w-full max-w-5xl px-4">
            <Sheet />
          </div>
        </section>
        <section className="w-full h-[50vh] flex justify-center items-center">
          <Piano />
        </section>
      </main>
    </div>
  );
}
