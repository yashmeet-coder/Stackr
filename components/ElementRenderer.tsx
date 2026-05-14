import type { ElementConfig } from '@/types'
import Banner from './elements/Banner'
import Carousel from './elements/Carousel'
import CardGrid from './elements/CardGrid'
import TextBlock from './elements/TextBlock'
import ButtonLink from './elements/ButtonLink'
import SocialLinks from './elements/SocialLinks'

export default function ElementRenderer({ config, fontColor }: { config: ElementConfig; fontColor?: string }) {
  switch (config.type) {
    case 'banner':       return <Banner config={config} />
    case 'carousel':     return <Carousel config={config} />
    case 'card_grid':    return <CardGrid config={config} />
    case 'text_block':   return <TextBlock config={config} fontColor={fontColor} />
    case 'button_link':  return <ButtonLink config={config} />
    case 'social_links': return <SocialLinks config={config} />
  }
}
