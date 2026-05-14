// ─── Element Types ────────────────────────────────────────────────────────────

export type ElementType =
  | 'banner'
  | 'carousel'
  | 'card_grid'
  | 'text_block'
  | 'button_link'
  | 'social_links'

// ─── Base ─────────────────────────────────────────────────────────────────────

export interface BaseElementConfig {
  id: string
  type: ElementType
  visible: boolean
  order: string
}

// ─── Banner ───────────────────────────────────────────────────────────────────

export interface BannerConfig extends BaseElementConfig {
  type: 'banner'
  data: {
    title: string
    subtitle: string
    imageUrl: string
    ctaText: string
    ctaUrl: string
    backgroundColor: string
    textColor: string
  }
}

// ─── Carousel ─────────────────────────────────────────────────────────────────

export interface CarouselItem {
  id: string
  order: string
  imageUrl: string
  title: string
  caption: string
}

export interface CarouselConfig extends BaseElementConfig {
  type: 'carousel'
  data: {
    items: CarouselItem[]
    autoPlay: boolean
    showDots: boolean
  }
}

// ─── Card Grid ────────────────────────────────────────────────────────────────

export interface Card {
  id: string
  order: string
  title: string
  description: string
  imageUrl: string
  link: string
  linkText: string
}

export interface CardGridConfig extends BaseElementConfig {
  type: 'card_grid'
  data: {
    heading: string
    columns: 2 | 3
    cards: Card[]
  }
}

// ─── Text Block ───────────────────────────────────────────────────────────────

export interface TextBlockConfig extends BaseElementConfig {
  type: 'text_block'
  data: {
    content: string
    align: 'left' | 'center' | 'right'
    variant: 'body' | 'heading' | 'subheading'
  }
}

// ─── Button Link ──────────────────────────────────────────────────────────────

export interface ButtonLinkConfig extends BaseElementConfig {
  type: 'button_link'
  data: {
    text: string
    url: string
    style: 'primary' | 'secondary' | 'outline'
    align: 'left' | 'center' | 'right'
    fullWidth: boolean
  }
}

// ─── Social Links ─────────────────────────────────────────────────────────────

export type SocialPlatform =
  | 'twitter'
  | 'instagram'
  | 'linkedin'
  | 'github'
  | 'youtube'
  | 'tiktok'

export interface SocialLink {
  id: string
  order: string
  platform: SocialPlatform
  url: string
  label: string
}

export interface SocialLinksConfig extends BaseElementConfig {
  type: 'social_links'
  data: {
    heading: string
    links: SocialLink[]
    style: 'icons' | 'buttons'
    align: 'left' | 'center' | 'right'
  }
}

// ─── Union ────────────────────────────────────────────────────────────────────

export type ElementConfig =
  | BannerConfig
  | CarouselConfig
  | CardGridConfig
  | TextBlockConfig
  | ButtonLinkConfig
  | SocialLinksConfig

// ─── Page ─────────────────────────────────────────────────────────────────────

// ─── Page background ──────────────────────────────────────────────────────────

export interface ColorBackground {
  type: 'color'
  color: string
}

export interface MediaBackground {
  type: 'image' | 'video'
  url: string
  overlayOpacity: number   // 0..1, darkens media so foreground stays legible
  blur: number             // 0..24 px
  fallbackColor: string    // shown while media loads, behind any transparency
}

export type PageBackground = ColorBackground | MediaBackground

export interface PageTheme {
  background: PageBackground
  fontFamily: string
  primaryColor: string
  maxWidth: string
  fontColor: string
}

export interface PageConfig {
  id: string
  title: string
  slug: string
  description: string
  theme: PageTheme
  elements: ElementConfig[]
}
