import { Tooltip, Typography } from "@ensdomains/thorin"
import { TagWithIcon, TagWithIconProps } from "../TagWithIcon/TagWithIcon"

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
      mobilePlacement='top'
      placement='top'
      width={200}
      mobileWidth={200}
    >
      <div>
        <TagWithIcon {...props}/>
      </div>
    </Tooltip>
  )
}
