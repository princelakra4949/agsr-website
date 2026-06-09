import { RscEntryLexicalCell as RscEntryLexicalCell_lexical } from '@payloadcms/richtext-lexical/rsc'
import { RscEntryLexicalField as RscEntryLexicalField_lexical } from '@payloadcms/richtext-lexical/rsc'
import { LexicalDiffComponent as LexicalDiffComponent_lexical } from '@payloadcms/richtext-lexical/rsc'
import { InlineToolbarFeatureClient as InlineToolbarFeatureClient_lexical } from '@payloadcms/richtext-lexical/client'
import { FixedToolbarFeatureClient as FixedToolbarFeatureClient_lexical } from '@payloadcms/richtext-lexical/client'
import { HeadingFeatureClient as HeadingFeatureClient_lexical } from '@payloadcms/richtext-lexical/client'
import { LinkFeatureClient as LinkFeatureClient_lexical } from '@payloadcms/richtext-lexical/client'
import { BoldFeatureClient as BoldFeatureClient_lexical } from '@payloadcms/richtext-lexical/client'
import { ItalicFeatureClient as ItalicFeatureClient_lexical } from '@payloadcms/richtext-lexical/client'
import { UnderlineFeatureClient as UnderlineFeatureClient_lexical } from '@payloadcms/richtext-lexical/client'
import { ParagraphFeatureClient as ParagraphFeatureClient_lexical } from '@payloadcms/richtext-lexical/client'
import { CollectionCards as CollectionCards_next } from '@payloadcms/next/rsc'

/** @type {import('payload').ImportMap} */
export const importMap = {
  '@payloadcms/richtext-lexical/rsc#RscEntryLexicalCell': RscEntryLexicalCell_lexical,
  '@payloadcms/richtext-lexical/rsc#RscEntryLexicalField': RscEntryLexicalField_lexical,
  '@payloadcms/richtext-lexical/rsc#LexicalDiffComponent': LexicalDiffComponent_lexical,
  '@payloadcms/richtext-lexical/client#InlineToolbarFeatureClient': InlineToolbarFeatureClient_lexical,
  '@payloadcms/richtext-lexical/client#FixedToolbarFeatureClient': FixedToolbarFeatureClient_lexical,
  '@payloadcms/richtext-lexical/client#HeadingFeatureClient': HeadingFeatureClient_lexical,
  '@payloadcms/richtext-lexical/client#LinkFeatureClient': LinkFeatureClient_lexical,
  '@payloadcms/richtext-lexical/client#BoldFeatureClient': BoldFeatureClient_lexical,
  '@payloadcms/richtext-lexical/client#ItalicFeatureClient': ItalicFeatureClient_lexical,
  '@payloadcms/richtext-lexical/client#UnderlineFeatureClient': UnderlineFeatureClient_lexical,
  '@payloadcms/richtext-lexical/client#ParagraphFeatureClient': ParagraphFeatureClient_lexical,
  '@payloadcms/next/rsc#CollectionCards': CollectionCards_next,
}
