import { zorbImageDataURI } from "./gradient"
import { useQuery } from "@tanstack/react-query"

import { useQueryOptions } from "@/hooks/useQueryOptions"

export const useZorb = (input: string) => {
  const { queryKey } = useQueryOptions({
    params: { input },
    functionName: "zorb",
    queryDependencyType: "independent",
    keyOnly: true,
  })
  const { data: zorb } = useQuery({
    queryKey,
    queryFn: ({ queryKey: [params] }) =>
      zorbImageDataURI(params.input, "address", {
        bg: "background",
        fg: "text",
        accent: "accentLight",
      }),
  })
  return zorb
}
