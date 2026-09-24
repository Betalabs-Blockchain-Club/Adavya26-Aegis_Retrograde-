import GameConsole from "@/components/GameConsole";

export default function Home() {
  return (
    <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col px-3 py-6 sm:py-10">
      <GameConsole />
      <footer className="mt-6 text-center font-pixel text-[7px] leading-relaxed text-phos-dim/60">
        OPERATION AEGIS RETROGRADE // TERMINAL BUILD v1.0 // ADVAYA DRAFT — BY
        MANAS
      </footer>
    </main>
  );
}
