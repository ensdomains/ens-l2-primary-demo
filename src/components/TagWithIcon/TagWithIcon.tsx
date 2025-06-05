import { Tag, TagProps } from "@ensdomains/thorin"
import { tagWithIcon, tagWithIconIcon } from "./TagWithIcon.css"

export type TagWithIconProps = TagProps & {
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
}

export const TagWithIcon = ({
  icon: Icon,
  children,
  ...props
}: TagWithIconProps) => {
  return (
    <Tag className={tagWithIcon} {...props}>
      {Icon && <Icon className={tagWithIconIcon} />}
      {children}
    </Tag>
  )
}
