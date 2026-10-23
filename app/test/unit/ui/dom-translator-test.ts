import { afterEach, beforeEach, describe, it } from 'node:test'
import assert from 'node:assert'
import { DOMTranslator } from '../../../src/ui/lib/dom-translator'

/** Wait for the mutation observer to process changes. */
const settle = () => new Promise(resolve => setTimeout(resolve, 0))

describe('DOMTranslator', () => {
  let root: HTMLDivElement
  let translator: DOMTranslator

  beforeEach(() => {
    root = document.createElement('div')
    document.body.appendChild(root)
  })

  afterEach(() => {
    translator?.stop()
    root.remove()
  })

  const start = () => {
    translator = new DOMTranslator(root, 'ja')
    translator.start()
  }

  it('translates text and attributes which are already rendered', () => {
    root.innerHTML =
      '<button title="Fetch origin">Fetch origin</button>' +
      '<input placeholder="Summary (required)">'
    start()

    assert.equal(root.querySelector('button')!.textContent, 'origin をフェッチ')
    assert.equal(
      root.querySelector('button')!.getAttribute('title'),
      'origin をフェッチ'
    )
    assert.equal(
      root.querySelector('input')!.getAttribute('placeholder'),
      '概要 (必須)'
    )
  })

  it('translates text rendered later', async () => {
    start()
    const heading = document.createElement('h2')
    heading.textContent = 'Changes'
    root.appendChild(heading)
    await settle()
    assert.equal(heading.textContent, '変更')

    heading.firstChild!.nodeValue = 'History'
    await settle()
    assert.equal(heading.textContent, '履歴')
  })

  it('translates sentences split up by elements', () => {
    root.innerHTML =
      '<p>A branch named <em class="ref-component">main</em> already exists.</p>'
    start()

    assert.equal(
      root.querySelector('p')!.textContent,
      'main という名前のブランチは既に存在します。'
    )
  })

  it('translates sentences with variables in separate text nodes', async () => {
    start()
    const button = document.createElement('button')
    button.append('Commit ', '2', ' files to ')
    const strong = document.createElement('strong')
    strong.textContent = 'main'
    button.append(strong)
    root.appendChild(button)
    await settle()

    assert.equal(button.textContent, 'main に 2 個のファイルをコミット')

    // React updates the count in place
    button.childNodes[1].nodeValue = '3'
    await settle()
    assert.equal(button.textContent, 'main に 3 個のファイルをコミット')
  })

  it('ignores icons when matching sentences', () => {
    root.innerHTML = '<button><svg><path d="M0"></path></svg> Accounts</button>'
    start()
    assert.equal(root.querySelector('button')!.textContent, ' アカウント')
  })

  it('does not translate user content', () => {
    root.innerHTML =
      '<div class="commit"><div class="summary">Fix</div></div>' +
      '<textarea>Commit</textarea>' +
      '<span translate="no">History</span>'
    start()

    assert.equal(root.querySelector('.summary')!.textContent, 'Fix')
    assert.equal(root.querySelector('textarea')!.value, 'Commit')
    assert.equal(root.querySelector('span')!.textContent, 'History')
  })

  it('restores and translates everything when the language changes', () => {
    root.innerHTML =
      '<p>A branch named <em class="ref-component">main</em> already exists.</p>' +
      '<button aria-label="Fetch origin">ターミナル</button>'
    start()

    translator.setLanguage('en')
    assert.equal(
      root.querySelector('p')!.textContent,
      'A branch named main already exists.'
    )
    assert.equal(root.querySelector('button')!.textContent, 'Terminal')
    assert.equal(
      root.querySelector('button')!.getAttribute('aria-label'),
      'Fetch origin'
    )

    translator.setLanguage('ja')
    assert.equal(root.querySelector('button')!.textContent, 'ターミナル')
    assert.equal(
      root.querySelector('button')!.getAttribute('aria-label'),
      'origin をフェッチ'
    )
  })
})
