import { mockPageConfig } from '@/mockData'
import EditorCanvas from '@/components/editor/EditorCanvas'

export default function EditPage() {
  return <EditorCanvas initialPage={mockPageConfig} />
}
