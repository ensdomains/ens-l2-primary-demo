import { queryOptions } from "@tanstack/react-query"
import {
  beautify,
  parseInput,
  ParsedInputResult,
} from "@ensdomains/ensjs/utils"

export const getValidationQueryKey = (name?: string) => ["getValidation", name]

export type GetValidationReturnType = Omit<
  ParsedInputResult,
  "normalised" | 'type' | 'isValid' | 'isShort' | 'is2LD' | 'isETH'
> & {
  name: string
  type?: 'name' | 'label'
  isValid?: boolean
  isShort?: boolean
  is2LD?: boolean
  isETH?: boolean
  beautifiedName: string
  isNonASCII: boolean | undefined
  labelCount: number
  labelDataArray: ParsedInputResult["labelDataArray"]
}

const tryDecodeURIComponent = (input: string) => {
  try {
    return decodeURIComponent(input)
  } catch {
    return input
  }
}

const tryBeautify = (input: string) => {
  try {
    return beautify(input)
  } catch {
    return input
  }
}

export const validate = (input: string) => {
  const decodedInput = tryDecodeURIComponent(input)
  const { normalised: name, ...parsedInput } = parseInput(decodedInput)
  const isNonASCII = parsedInput.labelDataArray.some(
    (dataItem) => dataItem.type !== "ASCII",
  )
  const outputName = name || input

  return {
    ...parsedInput,
    name: outputName,
    beautifiedName: tryBeautify(outputName),
    isNonASCII,
    labelCount: parsedInput.labelDataArray.length,
  }
}

const defaultData = Object.freeze({
  name: "",
  beautifiedName: "",
  isNonASCII: undefined,
  labelCount: 0,
  type: undefined,
  isValid: undefined,
  isShort: undefined,
  is2LD: undefined,
  isETH: undefined,
  labelDataArray: [],
})

export const getValidationQuery = ({
  name,
  enabled = true,
}: {
  name?: string
  enabled?: boolean
}) => {
  return queryOptions({
    queryKey: getValidationQueryKey(name),
    queryFn: ({ queryKey: [, _name] }) => {
      try {
        if (!_name) return defaultData
        return validate(_name)
      } catch {
        return defaultData
      }
    },
    enabled: !!name && enabled,
  })
}
