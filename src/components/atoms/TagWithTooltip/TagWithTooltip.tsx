import { Typography } from "@ensdomains/thorin"
import { TagWithIcon, TagWithIconProps } from "../TagWithIcon/TagWithIcon"
import { Tooltip } from "../Tooltip/Tooltip"

type TagWithTooltipProps = TagWithIconProps & {
  content: string
}

export const TagWithTooltip = ({ content, ...props }: TagWithTooltipProps) => {
  return (
    <Tooltip
      content={
        <Typography fontVariant='small' color='textPrimary'>
          {content}
        </Typography>
      }
    >
      <div>
        <TagWithIcon {...props}/>
      </div>
    </Tooltip>
  )
}
