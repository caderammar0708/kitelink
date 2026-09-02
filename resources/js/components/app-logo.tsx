export default function AppLogo() {
    return (
        <div className="group flex items-center gap-2.5 px-1 py-0.5">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg border border-[#5bb4ff]/30 bg-gradient-to-br from-[#1f6eff]/30 to-[#5bb4ff]/10 shadow-[0_0_12px_rgba(91,180,255,0.25)]">
                <i className="fas fa-wind text-base text-[#5bb4ff] drop-shadow-[0_0_8px_rgba(91,180,255,0.6)] transition-transform group-hover:rotate-6" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-none">
                <span className="bg-gradient-to-r from-[#b8e6ff] via-[#8acbff] to-[#4da6ff] bg-clip-text text-base font-extrabold tracking-tight text-transparent">
                    KiteLink
                </span>
                <span className="mt-0.5 text-[10px] font-medium tracking-wider text-slate-400 uppercase">Platform</span>
            </div>
        </div>
    );
}
