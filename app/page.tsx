import GameConsole from "@/components/GameConsole";

export default function Home() {
  return (
    <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-8 sm:px-6 sm:py-10 lg:max-w-4xl">
      <GameConsole />
      <footer className="mt-10 border-t border-blue-faint/50 pt-5 text-center font-pixel text-[7px] leading-relaxed tracking-[0.15em] text-blue-dim/70">
        OPERATION AEGIS RETROGRADE // TERMINAL BUILD v1.0 // ADVAYA DRAFT — BY
        MANAS
      </footer>
    </main>
  );
}
