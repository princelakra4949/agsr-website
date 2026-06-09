import { RscEntryLexicalCell } from '@payloadcms/richtext-lexical/rsc'
import { RscEntryLexicalField } from '@payloadcms/richtext-lexical/rsc'
import { LexicalDiffComponent } from '@payloadcms/richtext-lexical/rsc'
import { InlineToolbarFeatureClient } from '@payloadcms/richtext-lexical/client'
import { FixedToolbarFeatureClient } from '@payloadcms/richtext-lexical/client'
import { HeadingFeatureClient } from '@payloadcms/richtext-lexical/client'
import { LinkFeatureClient } from '@payloadcms/richtext-lexical/client'
import { BoldFeatureClient } from '@payloadcms/richtext-lexical/client'
import { ItalicFeatureClient } from '@payloadcms/richtext-lexical/client'
import { UnderlineFeatureClient } from '@payloadcms/richtext-lexical/client'
import { ParagraphFeatureClient } from '@payloadcms/richtext-lexical/client'
import { CollectionCards } from '@payloadcms/next/rsc'
import type { ImportMap } from 'payload'

export const importMap: ImportMap = {
  '@payloadcms/richtext-lexical/rsc#RscEntryLexicalCell': RscEntryLexicalCell,
  '@payloadcms/richtext-lexical/rsc#RscEntryLexicalField': RscEntryLexicalField,
  '@payloadcms/richtext-lexical/rsc#LexicalDiffComponent': LexicalDiffComponent,
  '@payloadcms/richtext-lexical/client#InlineToolbarFeatureClient': InlineToolbarFeatureClient,
  '@payloadcms/richtext-lexical/client#FixedToolbarFeatureClient': FixedToolbarFeatureClient,
  '@payloadcms/richtext-lexical/client#HeadingFeatureClient': HeadingFeatureClient,
  '@payloadcms/richtext-lexical/client#LinkFeatureClient': LinkFeatureClient,
  '@payloadcms/richtext-lexical/client#BoldFeatureClient': BoldFeatureClient,
  '@payloadcms/richtext-lexical/client#ItalicFeatureClient': ItalicFeatureClient,
  '@payloadcms/richtext-lexical/client#UnderlineFeatureClient': UnderlineFeatureClient,
  '@payloadcms/richtext-lexical/client#ParagraphFeatureClient': ParagraphFeatureClient,
  '@payloadcms/next/rsc#CollectionCards': CollectionCards,
}
