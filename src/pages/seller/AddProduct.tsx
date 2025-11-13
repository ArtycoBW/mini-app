/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/pages/shared/Textarea"

export default function AddProduct() {
  const [instr, setInstr] = useState<"ours" | "own">("ours")
  const [ret, setRet] = useState<"returnable" | "nonreturnable">("nonreturnable")
  return (
    <Card className="mx-auto w-full max-w-2xl shadow-xl">
      <CardHeader>
        <CardTitle>Добавить карточку</CardTitle>
        <CardDescription>Заполните данные товара</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Маркетплейс</Label>
          <RadioGroup defaultValue="ozon" className="grid grid-cols-3 gap-2">
            <div className="flex items-center gap-2 rounded-xl border p-3">
              <RadioGroupItem value="ozon" id="ozon" />
              <Label htmlFor="ozon">Ozon</Label>
            </div>
            <div className="flex items-center gap-2 rounded-xl border p-3">
              <RadioGroupItem value="ym" id="ym" />
              <Label htmlFor="ym">Я.Маркет</Label>
            </div>
            <div className="flex items-center gap-2 rounded-xl border p-3">
              <RadioGroupItem value="wb" id="wb" />
              <Label htmlFor="wb">WB</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Название маркетплейса</Label>
            <Input placeholder="Ozon" />
          </div>
          <div className="space-y-2">
            <Label>Артикул товара</Label>
            <Input placeholder="123456" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Наименование товара</Label>
            <Input placeholder="Толстовка" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Короткое описание</Label>
            <Textarea placeholder="Хлопок, базовая, oversize" />
          </div>
          <div className="space-y-2">
            <Label>Фото 1</Label>
            <Input type="file" accept="image/*" />
          </div>
          <div className="space-y-2">
            <Label>Фото 2</Label>
            <Input type="file" accept="image/*" />
          </div>
          <div className="space-y-2">
            <Label>Фото 3</Label>
            <Input type="file" accept="image/*" />
          </div>
          <div className="space-y-2">
            <Label>Кол-во</Label>
            <Input type="number" min={1} placeholder="10" />
          </div>
          <div className="space-y-2">
            <Label>Цена на маркетплейсе</Label>
            <Input type="number" placeholder="1990" />
          </div>
          <div className="space-y-2">
            <Label>За отзыв вы получите</Label>
            <Input type="number" placeholder="300" />
          </div>
          <div className="space-y-2">
            <Label>Стоимость для вас</Label>
            <Input type="number" placeholder="1200" />
          </div>
        </div>

        <div className="space-y-3">
          <Label>Инструкция по выкупу</Label>
          <RadioGroup value={instr} onValueChange={(v) => setInstr(v as any)} className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 rounded-xl border p-3">
              <RadioGroupItem value="ours" id="ours" />
              <Label htmlFor="ours">Наша инструкция</Label>
            </div>
            <div className="flex items-center gap-2 rounded-xl border p-3">
              <RadioGroupItem value="own" id="own" />
              <Label htmlFor="own">Своя инструкция</Label>
            </div>
          </RadioGroup>
          {instr === "own" && <Textarea placeholder="Опишите шаги для покупателя" />}
        </div>

        <div className="space-y-3">
          <Label>Возвратность товара</Label>
          <RadioGroup value={ret} onValueChange={(v) => setRet(v as any)} className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 rounded-xl border p-3">
              <RadioGroupItem value="nonreturnable" id="nr" />
              <Label htmlFor="nr">Не возвратный</Label>
            </div>
            <div className="flex items-center gap-2 rounded-xl border p-3">
              <RadioGroupItem value="returnable" id="r" />
              <Label htmlFor="r">Возвратный</Label>
            </div>
          </RadioGroup>
          {ret === "returnable" && (
            <div className="space-y-2">
              <Label>Срок возврата, дней</Label>
              <Input type="number" placeholder="14" />
            </div>
          )}
        </div>

        <Button className="h-11 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-violet-500 text-white">
          Опубликовать
        </Button>
      </CardContent>
    </Card>
  )
}
