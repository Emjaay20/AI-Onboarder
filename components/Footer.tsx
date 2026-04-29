export function Footer() {
  return (
    <footer className="border-t border-white/[0.1] bg-[#0a0a0c]">
      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
        <p className="text-[10px] tracking-[0.12em] text-white/50 uppercase">
          © 2026 ARCHETYPE BY Yusuf
        </p>
        <div className="flex items-center gap-7">
          {[
            { name: "Website", url: "https://yusuf-saka-portfolio.vercel.app/" },
            { name: "LinkedIn", url: "https://www.linkedin.com/in/yusuf-saka/" },
            { name: "Github", url: "https://github.com/Emjaay20" },
          ].map((link) => (
            <a 
              key={link.name} 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[10px] tracking-[0.15em] text-white/60 hover:text-white transition-colors uppercase"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
