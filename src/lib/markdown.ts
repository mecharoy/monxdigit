import { marked } from 'marked'
import katex from 'katex'

// Render markdown content that may contain LaTeX expressions.
// Supports: $$...$$ (block), $...$ (inline), and \begin{env}...\end{env} (display math)
export function renderMarkdownWithLatex(content: string): string {
  const mathBlocks: Array<{ placeholder: string; rendered: string }> = []
  let counter = 0

  let processed = content

  // Extract LaTeX environments (equation, align, gather, etc.) — display mode
  processed = processed.replace(
    /\\begin\{(equation\*?|align\*?|gather\*?|multline\*?|flalign\*?|alignat\*?)\}([\s\S]+?)\\end\{\1\}/g,
    (_, env, math) => {
      const placeholder = `%%MATH_ENV_${counter++}%%`
      mathBlocks.push({
        placeholder,
        rendered: katex.renderToString(math.trim(), {
          displayMode: true,
          throwOnError: false,
          output: 'html',
        }),
      })
      return placeholder
    }
  )

  // Extract block math ($$...$$)
  processed = processed.replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => {
    const placeholder = `%%MATH_BLOCK_${counter++}%%`
    mathBlocks.push({
      placeholder,
      rendered: katex.renderToString(math.trim(), {
        displayMode: true,
        throwOnError: false,
        output: 'html',
      }),
    })
    return placeholder
  })

  // Extract inline math ($...$)
  processed = processed.replace(/\$([^\$\n]+?)\$/g, (_, math) => {
    const placeholder = `%%MATH_INLINE_${counter++}%%`
    mathBlocks.push({
      placeholder,
      rendered: katex.renderToString(math.trim(), {
        displayMode: false,
        throwOnError: false,
        output: 'html',
      }),
    })
    return placeholder
  })

  // Parse the remaining markdown to HTML
  let html = marked(processed, { async: false, gfm: true, breaks: true }) as string

  // Restore math renderings
  for (const { placeholder, rendered } of mathBlocks) {
    html = html.replace(placeholder, rendered)
  }

  // Constrain image width to prevent oversized images
  html = html.replace(/<img([^>]*)/g, '<img style="max-width: 100%; height: auto; border-radius: 0.5rem;"$1')

  return html
}

// Generate a URL-friendly slug from a title
export function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) +
    '-' +
    Math.random().toString(36).slice(2, 7)
  )
}
