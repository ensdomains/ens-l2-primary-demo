import { primaryNameOptions } from "@/constants/primaryNameOptions";
import { ViewBase } from "@/stores/transactionStore";
import {  P } from "ts-pattern";


export const isValidPrimaryNameOptionId = P.when(
  (id): id is number => primaryNameOptions.findIndex((option) => option.id === id) !== -1
)

export const isValidNameData = P.intersection(P.not(P.nullish), {
  name: P.string.minLength(5),
})

export const isValidAddress = P.intersection(
  P.string,
  P.string.length(42),
  P.string.startsWith("0x")
)

export const isViewBase = (view: unknown): view is ViewBase => typeof view === 'object' && view !== null && 'name' in view

export const isDefined = <T>(value: T | undefined): value is T => value !== undefined