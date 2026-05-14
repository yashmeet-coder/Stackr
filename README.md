# AllMyLinks

A completely customisable asset listing website

## Overview

AllMyLinks is a drag-and-drop page builder for businesses. It lets you compose a public-facing landing page from predefined elements — banners, carousels, card grids, buttons, and more. Changes made in the visual editor are reflected instantly on the public page.

## Features

- Drag-and-drop editor
- Add, remove, and reorder elements
- Edit element properties in real-time
- Toggle element visibility
- Page-level theme settings (background, font color, layout)
- 6 built-in element types: banner, carousel, card grid, text block, button, social links

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- @dnd-kit (drag and drop)

### Installation

\`\`\`bash
npm install
npm run dev
\`\`\`

## Routes

| Route   | Description |
| ------- | ----------- |
| `/`     | Public page |
| `/edit` | Page editor |

## Element Types

Banner - Renders a customisable banner section that can include a title, subtitle, CTA button, and background colour/image.
Carousel - Displays a slideshow of items with navigation (autoplay, dots) and customisable slides including image, title, and caption.
Card Grid - Renders a responsive grid of cards, each featuring a title, description, image, and link. Users can choose between 2 column and 3 column grid layout.
Text Block - Allows you to add text content with options for alignment and variant (heading/subheading/body).
Button Link - A simple, customisable call-to-action button that links to a URL.
Social Links - Displays social media links with customisable icons or buttons.

## Project Structure

```txt
airlink/
├── app/
│ ├── edit/
│ │ └── page.tsx # Editor route
│ ├── globals.css # Tailwind directives
│ ├── layout.tsx # Root layout (Inter font)
│ └── page.tsx # Public page (ideally server side rendered)
│
├── components/
│ ├── ElementRenderer.tsx # Renders the correct component based on element type
│ ├── PageBackground.tsx # Renders the page background (color/image/video)
│ │
│ ├── editor/
│ │ ├── EditorCanvas.tsx # Main editor client component
│ │ ├── SortableElement.tsx# Drag-and-drop wrapper + hover controls
│ │ ├── EditDrawer.tsx # Per-element edit sidebar
│ │ ├── PageSettingsDrawer.tsx # Page-level theme settings (background, text color)
│ │ ├── AddElementModal.tsx# Modal to pick a new element type
│ │ └── formPrimitives.tsx # Shared form inputs (Input, ColorRow, Slider, etc.)
│ │
│ └── elements/
│ ├── Banner.tsx # Banner component
│ ├── Carousel.tsx # Carousel component
│ ├── CardGrid.tsx # Card Grid component
│ ├── TextBlock.tsx # Text Block component
│ ├── ButtonLink.tsx # Button Link component
│ └── SocialLinks.tsx # Social Links component
│
├── lib/
│ └── order.ts # Fractional indexing for drag-and-drop ordering
│
├── types.ts # All TypeScript types (discriminated union for elements)
├── utils.ts # createDefaultElement factory
├── mockData.ts # Seed page config (Voyage Co.)
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── package.json
```

## Data Structure

There are a total of 6 types of elements. The PageConfig object represents the entire page configuration.
PageConfig has en elements array which contains all the types of elements in the page in order. PageConfig itself has a theme object
which contains theme settings for the entire page.

Each element in the elements array has a unique id, a type (which is one of the 6 types of elements), a visible property (which is a boolean),
and an order property (which is a string).

```txt
Banner Element Data Object:
├── title
├── subtitle
├── imageUrl
├── ctaText
├── ctaUrl
└── colors: {
text: string,
ctaBackground: string,
ctaText: string
}
```
```txt
Carousel Element Data Object:
├── items: CarouselItem[] # also has its own `order`
└── settings: {
autoplay: boolean,
showDots: boolean
}
CarouselItem Data Object:
├── id: string
├── order: string
├── title: string
├── caption: string
└── imageUrl: string
```
```txt
CardGrid Element Data Object:
├── cards: Card[] # also has its own `order`
└── columns: 2 | 3

Card Data Object:
├── id: string
├── title: string
├── description: string
├── imageUrl: string
├── linkUrl: string
└── layout: "compact" | "minimal" | "default"

TextBlock Element Data Object:
├── text: string
└── variant: "heading" | "subheading" | "body"

ButtonLink Element Data Object:
├── text: string
├── url: string
└── alignment: "left" | "center" | "right"

SocialLinks Element Data Object:
├── links: SocialLink[]

SocialLink Data Object:
├── platform: SocialPlatform
├── url: string

Final Page Level data structure

PageConfig
├── id, title, slug, description
├── theme:
│ ├── background:  
│ │ ├── { type: 'color', color }
│ │ └── { type: 'image'|'video', url, overlayOpacity, blur, fallbackColor }
│ ├── fontColor
│ ├── fontFamily
│ ├── primaryColor
│ └── maxWidth
│
└── elements:
├── { id, type, visible, order, data: BannerData }
├── { id, type, visible, order, data: SocialLinksData }
│ └── links: SocialLink[]  
 ├── { id, type, visible, order, data: TextBlockData }
├── { id, type, visible, order, data: CardGridData }
│ └── cards: Card[] ← also has its own `order`
├── { id, type, visible, order, data: ButtonLinkData }
└── { id, type, visible, order, data: CarouselData }
└── items: CarouselItem[] ← also has its own `order`
```

## Architecture Decisions

**Discriminated union for elements**
`ElementConfig` is a union where `type` is the discriminant. TypeScript automatically narrows the `data` shape to the correct type in every switch/case. Adding a new element type is a compile-time-safe operation.

**Next.js & TypeScript for the whole project**
As this would be a client facing website the loading times are important. Next.js with app router and server side rendering/incremental static regeneration is a good choice for this project. TypeScript for type safety and better developer experience and less runtime errors.

**Fractional indexing for order**
Elements are ordered by a string `order` field, not array position. Reordering inserts a new string lexicographically between two existing ones (e.g. between `'c'` and `'f'` → `'d'`). This means a drag-and-drop operation only mutates the moved element — the rest of the array is untouched.

**`visible` vs deletion**
Hidden elements remain in state with `visible: false`. The public page filters them out; the editor shows a placeholder. This preserves the config and no data is lost

**Two-route separation**
`/` is the public-facing page. `/edit` is the editor. The editor holds all mutable state. The public page reads from `localStorage` on mount, falling back to the seed config.

**Factory pattern for defaults**
`createDefaultElement(type)` in `utils.ts` is the single source of truth for what a newly added element looks like. Its like a factory function that returns a new element config object with the given type and default values.
