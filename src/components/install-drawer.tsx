'use client'

import { DownloadIcon, ShareIcon } from 'lucide-react'
import { motion } from 'motion/react'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'

const EASE = [0.25, 0.1, 0.25, 1] as const

type PlatformType = 'ios' | 'android' | 'desktop' | 'unknown'

interface InstallDrawerProps {
  isOpen: boolean
  onClose: () => void
  platformType: PlatformType
}

const getInstructions = (platform: PlatformType) => {
  switch (platform) {
    case 'ios': {
      return {
        description:
          'Seguí estos pasos para instalar la app en tu dispositivo:',
        steps: [
          {
            icon: <ShareIcon className="size-5 shrink-0" />,
            text: 'Tocá el botón de compartir en la barra de Safari',
          },
          {
            text: 'Desplazate y seleccioná "Agregar a pantalla de inicio"',
          },
          {
            text: 'Confirmá tocando "Agregar" en la esquina superior derecha',
          },
        ],
        title: 'Instalar en iOS',
      }
    }
    case 'android': {
      return {
        description: 'Seguí estos pasos para instalar la app:',
        steps: [
          {
            text: 'Abrí el menú de tu navegador (toca los tres puntos ⋮)',
          },
          {
            text: 'Seleccioná "Agregar a pantalla de inicio" o "Instalar app"',
          },
          {
            text: 'Confirmá la instalación en el mensaje que aparece',
          },
        ],
        title: 'Instalar en Android',
      }
    }
    case 'desktop': {
      return {
        description: 'Instalá la app desde tu navegador:',
        steps: [
          {
            text: 'Buscá el ícono de instalación (+) en la barra de direcciones',
          },
          {
            text: 'Hacé clic en "Instalar" en el mensaje que aparece',
          },
          {
            text: 'La app se abrirá en una ventana independiente',
          },
        ],
        title: 'Instalar en tu computadora',
      }
    }
    default: {
      return {
        description: 'Esta app se puede instalar en tu dispositivo:',
        steps: [
          {
            text: 'Buscá la opción de instalación en el menú de tu navegador',
          },
          {
            text: 'Puede aparecer como "Agregar a pantalla de inicio" o "Instalar app"',
          },
          {
            text: 'Seguí las instrucciones de tu navegador para completar la instalación',
          },
        ],
        title: 'Instalar aplicación',
      }
    }
  }
}

export const InstallDrawer = ({
  isOpen,
  onClose,
  platformType,
}: InstallDrawerProps) => {
  const instructions = getInstructions(platformType)

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="mx-auto max-w-lg">
        <DrawerHeader className="items-center gap-3 pt-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="bg-primary/10 flex size-12 items-center justify-center rounded-full"
          >
            <DownloadIcon className="text-primary size-6" />
          </motion.div>
          <DrawerTitle className="text-lg font-bold">
            {instructions.title}
          </DrawerTitle>
          <DrawerDescription className="text-sm leading-relaxed">
            {instructions.description}
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-3 px-6 py-2">
          {instructions.steps.map((step, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded-lg bg-zinc-100 p-3"
            >
              {step.icon && <div className="mt-0.5">{step.icon}</div>}
              <div className="flex items-start gap-2">
                <span className="text-primary shrink-0 font-semibold">
                  {index + 1}.
                </span>
                <p className="text-foreground text-sm leading-relaxed">
                  {step.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        <DrawerFooter>
          <Button onClick={onClose} className="w-full">
            Entendido
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
