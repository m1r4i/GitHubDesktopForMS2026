import { Language, translate } from '../../lib/i18n/translate'

/** Attributes shown to the user which are translated along with the text. */
const translatedAttributes = [
  'title',
  'aria-label',
  'aria-description',
  'placeholder',
  'alt',
]

/**
 * Elements whose contents are never translated: user content like commit
 * messages, branch names, file paths and diffs, and the terminal.
 */
const skippedSelector = [
  'script',
  'style',
  'code',
  'pre',
  'kbd',
  '[translate="no"]',
  '[contenteditable="true"]',
  '.xterm',
  '.CodeMirror',
  '.content-wrapper',
  '.path-label-component',
  '.commit .summary',
  '.ecs-title',
  '.ecs-description-text',
  '.ref-component',
  '.branches-list-item .name',
  '.repository-list-item .name',
  '.pull-request-item .title',
].join(', ')

/** Elements whose text content is their value rather than a label. */
const valueElements = new Set(['TEXTAREA', 'INPUT', 'SELECT'])

interface ITranslated {
  /** The text before it was translated */
  readonly source: string
  /** The translated text shown in its place */
  readonly shown: string
}

const textRecords = new WeakMap<Text, ITranslated>()

/**
 * Text nodes added by the translator where a translation needs text in a
 * place the original had none, e.g. after the branch name in `Commit to
 * <strong>main</strong>` (`<strong>main</strong> にコミット`).
 */
const addedNodes = new WeakSet<Text>()
const attributeRecords = new WeakMap<Element, Map<string, ITranslated>>()

/**
 * The text a node had before we translated it. When React (or anything else)
 * has changed the node since, its current text is the source.
 */
function getSource(node: Text) {
  if (addedNodes.has(node)) {
    return ''
  }
  const value = node.nodeValue ?? ''
  const record = textRecords.get(node)
  return record !== undefined && record.shown === value ? record.source : value
}

function show(node: Text, source: string, value: string) {
  if (value === source) {
    textRecords.delete(node)
  } else {
    textRecords.set(node, { source, shown: value })
  }
  if (node.nodeValue !== value) {
    node.nodeValue = value
  }
}

const isTextBearing = (node: ChildNode): node is Element =>
  node.nodeType === Node.ELEMENT_NODE &&
  !(node instanceof SVGElement) &&
  (node.textContent ?? '').trim().length > 0

/**
 * Translates the user interface by replacing texts in the DOM as they're
 * rendered, keeping the originals so that the language can be changed at any
 * time. See app/src/lib/i18n.
 */
export class DOMTranslator {
  private language: Language
  private readonly observer: MutationObserver

  public constructor(private readonly root: Element, language: Language) {
    this.language = language
    this.observer = new MutationObserver(this.onMutations)
  }

  /** Translate what's already rendered and everything rendered from now on. */
  public start() {
    this.translateTree(this.root)
    this.observer.observe(this.root, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: translatedAttributes,
    })
  }

  public stop() {
    this.observer.disconnect()
  }

  /** Show the user interface in another language. */
  public setLanguage(language: Language) {
    if (language !== this.language) {
      this.language = language
      this.translateTree(this.root)
    }
  }

  private onMutations = (mutations: ReadonlyArray<MutationRecord>) => {
    const elements = new Set<Element>()
    const trees = new Set<Node>()

    for (const mutation of mutations) {
      const { target } = mutation
      if (mutation.type === 'characterData') {
        if (target.parentElement !== null) {
          elements.add(target.parentElement)
        }
      } else if (mutation.type === 'attributes') {
        if (target instanceof Element) {
          elements.add(target)
        }
      } else {
        if (target instanceof Element) {
          elements.add(target)
        }
        mutation.addedNodes.forEach(node => trees.add(node))
      }
    }

    for (const tree of trees) {
      if (tree.isConnected) {
        this.translateTree(tree)
      }
    }

    for (const element of elements) {
      if (element.isConnected && element.closest(skippedSelector) === null) {
        this.translateElement(element)
      }
    }
  }

  /** Translate a node and all its descendants. */
  private translateTree(node: Node) {
    const start = node instanceof Element ? node : node.parentElement
    if (start === null || start.closest(skippedSelector) !== null) {
      return
    }

    if (!(node instanceof Element)) {
      this.translateElement(start)
      return
    }

    const walker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (element: Element) =>
        element.matches(skippedSelector)
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT,
    })

    this.translateElement(node)
    for (let e = walker.nextNode(); e !== null; e = walker.nextNode()) {
      this.translateElement(e as Element)
    }
  }

  private translateElement(element: Element) {
    this.translateAttributes(element)
    if (!valueElements.has(element.tagName)) {
      this.translateText(element)
    }
  }

  private translateAttributes(element: Element) {
    for (const name of translatedAttributes) {
      const value = element.getAttribute(name)
      if (value === null) {
        continue
      }

      let records = attributeRecords.get(element)
      const record = records?.get(name)
      const source =
        record !== undefined && record.shown === value ? record.source : value
      const translated = translate(source, this.language) ?? source

      if (translated === source) {
        records?.delete(name)
      } else {
        if (records === undefined) {
          records = new Map()
          attributeRecords.set(element, records)
        }
        records.set(name, { source, shown: translated })
      }

      if (translated !== value) {
        element.setAttribute(name, translated)
      }
    }
  }

  /**
   * Translate the text directly inside an element. Texts which are split up
   * by other elements, like `A branch named <Ref>x</Ref> already exists.`,
   * are translated as a whole (`A branch named {0} already exists.`) and the
   * translation is distributed over the text nodes around the elements.
   */
  private translateText(element: Element) {
    // Most elements only contain other elements, e.g. lists with many rows
    const hasText = Array.from(element.childNodes).some(
      child =>
        child.nodeType === Node.TEXT_NODE &&
        getSource(child as Text).trim().length > 0
    )
    if (!hasText) {
      return
    }

    // The text nodes between the elements with text, which separate them
    const runs: Text[][] = [[]]
    const separators = new Array<Element>()

    element.childNodes.forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        runs[runs.length - 1].push(child as Text)
      } else if (isTextBearing(child)) {
        separators.push(child)
        runs.push([])
      }
    })

    if (runs.length === 1 && runs[0].length === 1) {
      this.translateNode(runs[0][0])
      return
    }

    const sources = runs.map(run => run.map(getSource))
    const key = sources
      .map((run, i) => (i === 0 ? '' : `{${i - 1}}`) + run.join(''))
      .join('')

    const translated = translate(key, this.language)
    if (
      translated !== null &&
      this.distribute(element, runs, separators, sources, translated)
    ) {
      return
    }

    runs.forEach((run, i) =>
      run.forEach((node, j) => this.translateNode(node, sources[i][j]))
    )
  }

  /**
   * Show a translation like `{0} という名前のブランチは既に存在します。` in
   * the text nodes around the elements. Returns false, leaving the nodes
   * alone, when the translation doesn't fit them.
   */
  private distribute(
    element: Element,
    runs: ReadonlyArray<ReadonlyArray<Text>>,
    separators: ReadonlyArray<Element>,
    sources: ReadonlyArray<ReadonlyArray<string>>,
    translation: string
  ) {
    const parts = translation.split(/\{(\d+)\}/)
    const segments = parts.filter((_, i) => i % 2 === 0)
    const placeholders = parts.filter((_, i) => i % 2 === 1).map(Number)

    if (
      segments.length !== runs.length ||
      placeholders.some((n, i) => n !== i)
    ) {
      return false
    }

    runs.forEach((run, i) => {
      if (run.length === 0) {
        if (segments[i].length > 0) {
          const node = document.createTextNode(segments[i])
          addedNodes.add(node)
          textRecords.set(node, { source: '', shown: segments[i] })
          const before =
            i < separators.length
              ? separators[i]
              : separators[i - 1].nextSibling
          element.insertBefore(node, before)
        }
        return
      }

      run.forEach((node, j) =>
        show(node, sources[i][j], j === 0 ? segments[i] : '')
      )
    })
    return true
  }

  /** Translate a single text node, or restore it when there's no translation */
  private translateNode(node: Text, source = getSource(node)) {
    show(node, source, translate(source, this.language) ?? source)
  }
}
