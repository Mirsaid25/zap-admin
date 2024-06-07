import React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'

const FormPanel = ({ nal, role, setDays, setMKub, config, settings, settingsPennding, changeKubFn, errors, register, isPending, changeKub, changePrice, bonus, setPayWithBonus }: any) => {
    return (
        <div className="h-full flex flex-col overflow-auto">
            <div className="h-full p-5 rounded-lg bg-[#121212]">
                <div className="flex flex-col gap-2">
                    <Input
                        type="number"
                        onKeyUpCapture={(e: any) => changeKubFn(+e.target.value)}
                        {...register("volume", { required: true, })}
                        className={`w-full h-full text-2xl px-5 bg-[#242424] text-white ${errors.price && "border-[red] outline-[red]"}`}
                        placeholder="Kub"
                        disabled={isPending}
                        defaultValue={changeKub}
                    />

                    <Input
                        className="w-full h-full text-2xl px-5 bg-[#242424] text-white"
                        type="text"
                        value={config.price}
                        placeholder="Sum"
                    />

                    <Input
                        className="w-full h-full text-2xl px-5 bg-[#242424] text-white"
                        type="number"
                        disabled={isPending}
                        {...register("price", {
                            required: true,
                        })}
                        placeholder="Sum"
                        value={Math.ceil(changePrice)}
                    />
                </div>
                <div className="h-fit w-full mt-3">
                    <p>bonus: {Math.ceil(bonus).toLocaleString('uz')}</p>
                    <div className="grid grid-cols-1 gap-3 h-fit items-center justify-between mt-2">
                        <Button
                            disabled={isPending}
                            onClick={() =>
                                setPayWithBonus(false)
                            }
                            type="submit"
                            className="bg-green-700 hover:bg-green-600 w-full text-lg h-full py-2"
                        >
                            {Math.ceil(changePrice).toLocaleString("uz")} cум
                        </Button>
                        <Button
                            disabled={isPending || bonus == 0}
                            onClick={() =>
                                setPayWithBonus(true)
                            }
                            type="submit"
                            className="bg-green-700 hover:bg-green-600 w-full text-lg h-full py-2 flex items-center justify-around"
                        >
                            <p className="block">Оплатить используя бонуса</p>
                            <p className="block">{Math.ceil(nal).toLocaleString("uz")} сум</p>
                        </Button>
                    </div>
                </div>
            </div>

            {
                role === "admin" && (
                    <div className="h-full mt-5 p-5 rounded-lg bg-[#121212]">
                        <div className="flex flex-col gap-4">
                            <h2 className="text-2xl font-medium">Настройки</h2>
                            <label>
                                <p className="text-lg mb-1">День</p>
                                <Input
                                    type="number"
                                    onChange={(e) => setDays(+e.target.value)}
                                    defaultValue={config.days}
                                    className="w-full h-full text-2xl px-5 bg-[#242424] text-white"
                                />
                            </label>
                            <label className="">
                                <p className="text-lg mb-1">М Куб</p>
                                <Input
                                    type="number"
                                    onChange={(e) => setMKub(+e.target.value)}
                                    defaultValue={config.price}
                                    className="w-full h-full text-2xl px-5 bg-[#242424] text-white"
                                />
                            </label>
                            <Button type="button" onClick={settings} className="bg-green-700 hover:bg-green-600 w-full text-lg h-full py-2">
                                {
                                    settingsPennding ? <div className="w-7 h-7 rounded-full border-t-2 border-b-2 animate-spin"></div> : "Сохранить"
                                }
                            </Button>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default FormPanel
