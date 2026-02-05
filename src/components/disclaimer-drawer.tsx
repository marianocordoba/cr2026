'use client'

import { useLiveQuery } from 'dexie-react-hooks'
import { InfoIcon, TriangleAlertIcon } from 'lucide-react'
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
import { db } from '@/lib/db'

const EASE = [0.25, 0.1, 0.25, 1] as const

export const DisclaimerDrawer = () => {
  const result = useLiveQuery(async () => {
    const record = await db.meta.get('disclaimerAcknowledged')
    return record ?? null
  }, [])

  // Still loading from IndexedDB — render nothing to avoid flash
  if (result === undefined) {
    return null
  }

  const isOpen = result === null

  const handleAcknowledge = async () => {
    await db.meta.put({
      key: 'disclaimerAcknowledged',
      value: new Date().toISOString(),
    })
  }

  return (
    <Drawer open={isOpen} dismissible={false}>
      <DrawerContent className="mx-auto max-w-lg">
        <DrawerHeader className="items-center gap-3 pt-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="flex size-12 items-center justify-center rounded-full bg-[#DD5227]/10"
          >
            <InfoIcon className="size-6 text-[#DD5227]" />
          </motion.div>
          <DrawerTitle className="text-lg font-bold">
            Aviso importante
          </DrawerTitle>
          <DrawerDescription className="text-sm leading-relaxed">
            Antes de continuar, tené en cuenta lo siguiente:
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-3 px-6 py-2">
          <div className="flex items-start gap-3 rounded-lg bg-zinc-100 p-3">
            <p className="text-foreground text-sm leading-relaxed">
              Esta <strong>no es una app oficial</strong> del Cosquín Rock. Es
              un proyecto independiente creado por fans.
            </p>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-zinc-100 p-3">
            <p className="text-foreground text-sm leading-relaxed">
              El logo y la marca Cosquín Rock son{' '}
              <strong>propiedad de sus respectivos titulares</strong>.
            </p>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-zinc-100 p-3">
            <p className="text-foreground text-sm leading-relaxed">
              Los horarios fueron tomados de publicaciones oficiales y{' '}
              <strong>podrían no ser exactos</strong>. Verificá siempre con las
              fuentes oficiales.
            </p>
          </div>
        </div>

        <DrawerFooter>
          <Button onClick={handleAcknowledge} className="w-full">
            Entendido
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
