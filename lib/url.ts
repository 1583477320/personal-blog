/**
 * 把包含 `/` 的 slug 转成安全的 URL 路径。
 * 逐段编码，保留分隔斜杠，这样 /blog/Blog/文章名 能正确命中 catch-all 路由。
 */
export function slugToHref(prefix: string, slug: string): string {
  const clean = slug.replace(/^\/+|\/+$/g, '')
  if (!clean) return prefix
  return `${prefix}/${clean.split('/').map(encodeURIComponent).join('/')}`
}
