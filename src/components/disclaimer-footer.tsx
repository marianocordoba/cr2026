import { InfoIcon } from 'lucide-react'

export const DisclaimerFooter = () => (
  <footer className="flex flex-col items-center gap-2 px-6 py-4 text-center">
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-1.5 text-xs text-zinc-400">
        <InfoIcon className="size-3" />
        <span className="font-medium tracking-wider uppercase">Aviso</span>
      </div>
      <p className="max-w-sm text-xs leading-relaxed text-zinc-400">
        Esta no es una app oficial del Cosquín Rock. El logo es propiedad de sus
        respectivos titulares. Los horarios fueron tomados de publicaciones
        oficiales y podrían no ser exactos.
      </p>
    </div>
  </footer>
)
