import { skeleton } from "./Skeleton.css"

export const Skeleton = ({ className}: {className: string}) => {
  return <div className={`${skeleton} ${className}`} />
}