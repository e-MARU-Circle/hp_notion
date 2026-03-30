import Image from 'next/image';
import type { BlockType, RichTextType } from '@/lib/types';

// リッチテキスト（太字やリンクなど）を処理する関数
function renderRichText(richText: RichTextType[]) {
  return richText.map((text, index) => {
    const { annotations, plain_text, href } = text;
    let element: React.ReactNode = plain_text;

    if (annotations.bold) element = <strong key={index}>{element}</strong>;
    if (annotations.italic) element = <em key={index}>{element}</em>;
    if (annotations.underline) element = <u key={index}>{element}</u>;
    if (annotations.code) element = <code key={index} className="bg-gray-200 px-1 rounded-sm">{element}</code>;
    if (href) element = <a href={href} key={index} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{element}</a>;

    return element;
  });
}

// Notionブロックをレンダリングするコンポーネント
export function Block({ block }: { block: BlockType }) {
  const { type } = block;

  const calloutColorMap: Record<string, string> = {
    default: 'bg-gray-100 border-gray-200',
    gray: 'bg-gray-100 border-gray-200',
    brown: 'bg-yellow-100 border-yellow-200',
    orange: 'bg-orange-100 border-orange-200',
    yellow: 'bg-yellow-100 border-yellow-200',
    green: 'bg-green-100 border-green-200',
    blue: 'bg-blue-100 border-blue-200',
    purple: 'bg-purple-100 border-purple-200',
    pink: 'bg-pink-100 border-pink-200',
    red: 'bg-red-100 border-red-200',
    gray_background: 'bg-gray-100',
    brown_background: 'bg-yellow-100',
    orange_background: 'bg-orange-100',
    yellow_background: 'bg-yellow-100',
    green_background: 'bg-green-100',
    blue_background: 'bg-blue-100',
    purple_background: 'bg-purple-100',
    pink_background: 'bg-pink-100',
    red_background: 'bg-red-100',
  };

  switch (type) {
    case 'heading_1':
      return <h1 className="text-3xl font-bold my-4">{block.heading_1 && renderRichText(block.heading_1.rich_text)}</h1>;
    case 'heading_2':
      return <h2 className="text-2xl font-bold my-3">{block.heading_2 && renderRichText(block.heading_2.rich_text)}</h2>;
    case 'heading_3':
      return <h3 className="text-xl font-bold my-2">{block.heading_3 && renderRichText(block.heading_3.rich_text)}</h3>;
    case 'paragraph':
      return <p className="my-2 leading-relaxed">{block.paragraph && renderRichText(block.paragraph.rich_text)}</p>;
    case 'bulleted_list_item':
      return <li className="ml-6 list-disc">{block.bulleted_list_item && renderRichText(block.bulleted_list_item.rich_text)}</li>;
    case 'numbered_list_item':
      return <li className="ml-6 list-decimal">{block.numbered_list_item && renderRichText(block.numbered_list_item.rich_text)}</li>;
    case 'callout': {
      const value = block.callout;
      if (!value) return null;
      const colorClass = calloutColorMap[value.color] || calloutColorMap.default;
      return (
        <div className={`my-4 p-4 rounded-md border ${colorClass} flex items-start gap-3`}>
          {value.icon && (
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
              {value.icon.type === 'emoji' && value.icon.emoji && <span>{value.icon.emoji}</span>}
              {value.icon.type === 'external' && value.icon.external && <Image src={value.icon.external.url} alt="callout icon" width={24} height={24} />}
            </div>
          )}
          <div className="flex-grow">{renderRichText(value.rich_text)}</div>
        </div>
      );
    }
    case 'image': {
      const value = block.image;
      if (!value) return null;
      const src = value.type === 'external' ? value.external.url : value.file.url;
      const caption = value.caption.length > 0 ? value.caption[0].plain_text : '';
      return (
        <figure className="my-4">
          <div className="relative w-full h-auto aspect-video">
            <Image
              src={src}
              alt={caption || 'content image'}
              fill
              unoptimized
              className="object-contain rounded-md"
            />
          </div>
          {caption && <figcaption className="text-center text-sm text-gray-500 mt-2">{caption}</figcaption>}
        </figure>
      );
    }
    case 'divider':
      return <hr className="my-6" />;
    case 'list_item_group': {
      const value = block.list_item_group;
      if (!value) return null;
      const ListWrapper = value.type === 'numbered_list_item' ? 'ol' : 'ul';
      return (
        <ListWrapper className="my-2 space-y-1">
          {value.items.map(item => <Block key={item.id} block={item} />)}
        </ListWrapper>
      );
    }
    default:
      return <p className="text-xs text-gray-400">Unsupported block: {type}</p>;
  }
}

// ブロックをグループ化するヘルパー関数
export function groupListItems(blocks: BlockType[]): BlockType[] {
  const groupedBlocks: BlockType[] = [];
  let tempList: BlockType[] = [];

  type ListItemType = 'bulleted_list_item' | 'numbered_list_item';
  const isListItemType = (type: string | null): type is ListItemType => {
    return type === 'bulleted_list_item' || type === 'numbered_list_item';
  };

  blocks.forEach((block, index) => {
    const isListItem = isListItemType(block.type);
    const prevBlockType = index > 0 ? blocks[index - 1].type : null;

    if (isListItem) {
      if (block.type === prevBlockType) {
        tempList.push(block);
      } else {
        if (tempList.length > 0 && isListItemType(prevBlockType)) {
          groupedBlocks.push({
            id: `group-${index - tempList.length}`,
            type: 'list_item_group',
            list_item_group: { type: prevBlockType, items: tempList },
          });
        }
        tempList = [block];
      }
    } else {
      if (tempList.length > 0 && isListItemType(prevBlockType)) {
        groupedBlocks.push({
          id: `group-${index - tempList.length}`,
          type: 'list_item_group',
          list_item_group: { type: prevBlockType, items: tempList },
        });
        tempList = [];
      }
      groupedBlocks.push(block);
    }
  });

  if (tempList.length > 0) {
    const lastBlockType = blocks[blocks.length - 1].type;
    if (isListItemType(lastBlockType)) {
      groupedBlocks.push({
        id: `group-${blocks.length - tempList.length}`,
        type: 'list_item_group',
        list_item_group: { type: lastBlockType, items: tempList },
      });
    }
  }

  return groupedBlocks;
}

// Notionブロック一覧をレンダリング
export function NotionContent({ blocks }: { blocks: BlockType[] }) {
  const grouped = groupListItems(blocks);
  return (
    <div className="prose max-w-none">
      {grouped.map((block) => (
        <Block key={block.id} block={block} />
      ))}
    </div>
  );
}
