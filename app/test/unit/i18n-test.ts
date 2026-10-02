import { describe, it } from 'node:test'
import assert from 'node:assert'
import {
  getRoleLabel,
  translate,
  translateMenuLabel,
  translateMenuTemplate,
} from '../../src/lib/i18n/translate'
import { japanese } from '../../src/lib/i18n/ja'
import { english } from '../../src/lib/i18n/en'

describe('i18n', () => {
  describe('translate', () => {
    it('translates phrases ignoring case and repeated whitespace', () => {
      assert.equal(translate('New branch', 'ja'), '新しいブランチ')
      assert.equal(translate('New Branch', 'ja'), '新しいブランチ')
      assert.equal(translate('New   branch', 'ja'), '新しいブランチ')
    })

    it('keeps leading and trailing whitespace', () => {
      assert.equal(translate(' Fetch ', 'ja'), ' フェッチ ')
    })

    it('carries over a trailing ellipsis', () => {
      assert.equal(translate('Delete…', 'ja'), '削除…')
      assert.equal(translate('Delete...', 'ja'), '削除…')
    })

    it('translates texts with variable parts', () => {
      assert.equal(translate('Fetch origin', 'ja'), 'origin をフェッチ')
      assert.equal(translate('Push upstream', 'ja'), 'upstream にプッシュ')
      assert.equal(
        translate('3 changed files', 'ja'),
        '3 個の変更されたファイル'
      )
      assert.equal(
        translate('1 changed file', 'ja'),
        '1 個の変更されたファイル'
      )
      assert.equal(translate('Commit to main', 'ja'), 'main にコミット')
      assert.equal(translate('View on Gitea', 'ja'), 'Gitea で表示')
      assert.equal(translate('Abort rebase', 'ja'), 'リベースを中止')
    })

    it('translates texts split up by elements', () => {
      assert.equal(
        translate('A branch named {0} already exists.', 'ja'),
        '{0} という名前のブランチは既に存在します。'
      )
      assert.equal(
        translate('Delete branch{0}?', 'ja'),
        'ブランチ {0} を削除しますか?'
      )
      assert.equal(
        translate('Commit 2 files to {0}', 'ja'),
        '{0} に 2 個のファイルをコミット'
      )
    })

    it('returns null when there is no translation', () => {
      assert.equal(translate('my-feature-branch', 'ja'), null)
      assert.equal(translate('   ', 'ja'), null)
      assert.equal(translate('42', 'ja'), null)
      assert.equal(translate('New branch', 'en'), null)
    })

    it('translates the Japanese parts of the interface into English', () => {
      assert.equal(translate('ターミナル', 'en'), 'Terminal')
      assert.equal(translate('おはようございます', 'en'), 'Good morning')
      assert.equal(
        translate('プルリクエスト #12 を確認する', 'en'),
        'Review pull request #12'
      )
      assert.equal(
        translate('マージ後にブランチ {0} を削除する', 'en'),
        'Delete branch {0} after merging'
      )
    })
  })

  describe('translations', () => {
    const placeholders = (text: string) => text.match(/\{\d+\}/g) ?? []

    for (const [name, translations] of [
      ['Japanese', japanese],
      ['English', english],
    ] as const) {
      it(`keeps the elements in order in ${name} phrases`, () => {
        for (const [source, translation] of Object.entries(
          translations.phrases
        )) {
          const expected = placeholders(source).map((_, i) => `{${i}}`)
          assert.deepEqual(placeholders(source), expected, source)
          assert.deepEqual(placeholders(translation), expected, source)
        }
      })

      it(`keeps the elements in order in ${name} patterns`, () => {
        for (const [pattern, replacement] of translations.patterns) {
          if (typeof replacement === 'string') {
            const found = placeholders(replacement)
            const expected = found.map((_, i) => `{${i}}`)
            assert.deepEqual(found, expected, pattern.source)
          }
        }
      })
    }
  })

  describe('translateMenuLabel', () => {
    it('keeps access keys on Windows', () => {
      assert.equal(translateMenuLabel('&File', 'ja', false), 'ファイル(&F)')
      assert.equal(
        translateMenuLabel('New &branch…', 'ja', false),
        '新しいブランチ(&B)…'
      )
    })

    it('has no access keys on macOS', () => {
      assert.equal(translateMenuLabel('File', 'ja', true), 'ファイル')
      assert.equal(
        translateMenuLabel('New Branch…', 'ja', true),
        '新しいブランチ…'
      )
    })

    it('leaves labels without a translation alone', () => {
      assert.equal(
        translateMenuLabel('&Weird thing', 'ja', false),
        '&Weird thing'
      )
      assert.equal(translateMenuLabel('&File', 'en', false), '&File')
    })
  })

  describe('translateMenuTemplate', () => {
    it('translates labels and roles in submenus', () => {
      const [menu] = translateMenuTemplate(
        [
          {
            label: 'Edit',
            submenu: [
              { role: 'copy' },
              { role: 'hide' },
              { type: 'separator' },
            ],
          },
        ],
        'ja',
        'MS2026 Desktop'
      )

      assert.equal(menu.label, '編集')
      assert.deepEqual(menu.submenu, [
        { role: 'copy', label: 'コピー' },
        { role: 'hide', label: 'MS2026 Desktop を非表示' },
        { type: 'separator' },
      ])
    })

    it('keeps Electron labels for roles in English', () => {
      assert.equal(getRoleLabel('copy', 'en', 'MS2026 Desktop'), undefined)
    })
  })
})
