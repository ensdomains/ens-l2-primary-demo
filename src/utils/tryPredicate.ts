export const tryPredicate = async (
  predicate: () => Promise<boolean>,
  { attempts = 3, delay = 300 }: { attempts?: number; delay?: number } = {},
): Promise<boolean> => {
  try {
    const result = await predicate()
    if (result) return true
  } catch (e) {
    console.warn(`Attempt failed, retrying...`, e)
  }
  console.log("predicate failed, retrying...")
  await new Promise((resolve) => setTimeout(resolve, delay))
  return attempts > 1 ? tryPredicate(predicate, { attempts: attempts - 1, delay }) : false
}
