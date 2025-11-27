import { Info } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export default function InfoIcon({ content }: { content: string }) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Info className="size-4" />
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs font-normal">{content}</p>
      </TooltipContent>
    </Tooltip>
  )
}
