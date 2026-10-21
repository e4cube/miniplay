import type { EditorialInput } from './validation';

const importMarker = '// END EDITORIAL IMPORTS';
const sourceMarker = '  // END EDITORIAL SOURCES';

export function articlePath(article: EditorialInput): string {
  return `content/posts/${article.slug}.${article.locale}.json`;
}

export function addToManifest(manifest: string, article: EditorialInput): string {
  if (manifest.split(importMarker).length !== 2 || manifest.split(sourceMarker).length !== 2)
    throw new Error('MANIFEST_FORMAT');
  const filename = `${article.slug}.${article.locale}.json`;
  if (manifest.includes(`'./${filename}'`)) throw new Error('ALREADY_EXISTS');
  const identifier = `article_${article.slug.replace(/-/g, '_')}_${article.locale.replace('-', '_')}`;
  return manifest.replace(importMarker, `import ${identifier} from './${filename}';\n${importMarker}`)
    .replace(sourceMarker, `  ${identifier},\n${sourceMarker}`);
}
