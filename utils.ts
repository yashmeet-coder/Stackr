import type { ElementConfig, ElementType } from '@/types'
import { initialRanks } from '@/lib/order'

let idCounter = 1000

function uid(): string {
  return `elem-${Date.now()}-${++idCounter}`
}

function cardId(): string {
  return `card-${Date.now()}-${++idCounter}`
}

function itemId(): string {
  return `item-${Date.now()}-${++idCounter}`
}

function linkId(): string {
  return `link-${Date.now()}-${++idCounter}`
}

// Element-level `order` is assigned by the editor canvas at insert time
// (it knows the existing list). createDefaultElement returns a placeholder
// empty string; the caller must overwrite it before adding to state.
export function createDefaultElement(type: ElementType): ElementConfig {
  const base = { id: uid(), visible: true, order: '' }

  switch (type) {
    case 'banner':
      return {
        ...base,
        type: 'banner',
        data: {
          title: 'New Banner',
          subtitle: 'Add your subtitle here',
          imageUrl: 'https://picsum.photos/seed/newbanner/800/300',
          ctaText: 'Click here',
          ctaUrl: '#',
          backgroundColor: '#4f46e5',
          textColor: '#ffffff',
        },
      }

    case 'carousel': {
      const ranks = initialRanks(2)
      return {
        ...base,
        type: 'carousel',
        data: {
          items: [
            {
              id: itemId(),
              order: ranks[0],
              imageUrl: 'https://picsum.photos/seed/newslide1/800/400',
              title: 'Slide 1',
              caption: 'Add a caption here',
            },
            {
              id: itemId(),
              order: ranks[1],
              imageUrl: 'https://picsum.photos/seed/newslide2/800/400',
              title: 'Slide 2',
              caption: 'Add a caption here',
            },
          ],
          autoPlay: false,
          showDots: true,
        },
      }
    }

    case 'card_grid': {
      const ranks = initialRanks(2)
      return {
        ...base,
        type: 'card_grid',
        data: {
          heading: 'My Work',
          columns: 2,
          cards: [
            {
              id: cardId(),
              order: ranks[0],
              title: 'Project 1',
              description: 'Short description of what this project is about.',
              imageUrl: 'https://picsum.photos/seed/nc1/600/300',
              link: '#',
              linkText: 'View project',
            },
            {
              id: cardId(),
              order: ranks[1],
              title: 'Project 2',
              description: 'Short description of what this project is about.',
              imageUrl: 'https://picsum.photos/seed/nc2/600/300',
              link: '#',
              linkText: 'View project',
            },
          ],
        },
      }
    }

    case 'text_block':
      return {
        ...base,
        type: 'text_block',
        data: {
          content: 'Add your text here. This is a text block you can use for paragraphs, headings, or any copy.',
          align: 'left',
          variant: 'body',
        },
      }

    case 'button_link':
      return {
        ...base,
        type: 'button_link',
        data: {
          text: 'Click me',
          url: '#',
          style: 'primary',
          align: 'center',
          fullWidth: false,
        },
      }

    case 'social_links': {
      const ranks = initialRanks(2)
      return {
        ...base,
        type: 'social_links',
        data: {
          heading: 'Find me online',
          links: [
            { id: linkId(), order: ranks[0], platform: 'twitter', url: 'https://twitter.com', label: 'Twitter' },
            { id: linkId(), order: ranks[1], platform: 'github', url: 'https://github.com', label: 'GitHub' },
          ],
          style: 'buttons',
          align: 'center',
        },
      }
    }
  }
}
