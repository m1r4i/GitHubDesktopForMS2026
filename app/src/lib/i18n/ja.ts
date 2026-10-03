import { ITranslations, TranslationPattern } from './translate'

/**
 * Japanese translations of the (English) user interface.
 *
 * Phrases are matched ignoring case, so "New Branch" (macOS) and "New branch"
 * (Windows) share one entry, and a trailing ellipsis is carried over, so
 * "Delete…" uses the entry for "Delete". See ./translate.ts.
 */
const phrases: Record<string, string> = {
  // Common actions
  Abort: '中止',
  Add: '追加',
  Apply: '適用',
  Back: '戻る',
  Cancel: 'キャンセル',
  Change: '変更',
  Choose: '選択',
  Clear: 'クリア',
  Close: '閉じる',
  Configure: '設定',
  Continue: '続行',
  Copy: 'コピー',
  Create: '作成',
  Cut: '切り取り',
  Delete: '削除',
  Discard: '破棄',
  Dismiss: '閉じる',
  Done: '完了',
  Edit: '編集',
  Error: 'エラー',
  Expand: '展開',
  Collapse: '折りたたむ',
  Failed: '失敗',
  Filter: 'フィルター',
  Find: '検索',
  Finish: '完了',
  Hide: '隠す',
  Ignore: '無視',
  Install: 'インストール',
  'Learn more': '詳細',
  'Learn more.': '詳細はこちら。',
  Locate: '場所を指定',
  New: '新規',
  No: 'いいえ',
  None: 'なし',
  'Not now': '今はしない',
  Ok: 'OK',
  Open: '開く',
  Options: '設定',
  Other: 'その他',
  Overwrite: '上書き',
  Paste: '貼り付け',
  'Please wait': 'お待ちください',
  Redo: 'やり直す',
  Reload: '再読み込み',
  Remove: '削除',
  Rename: '名前を変更',
  Resolve: '解決',
  Restore: '復元',
  Retry: '再試行',
  Save: '保存',
  Select: '選択',
  'Select all': 'すべて選択',
  Settings: '設定',
  Show: '表示',
  Skip: 'スキップ',
  Start: '開始',
  Stop: '停止',
  Undo: '元に戻す',
  Update: '更新',
  Use: '使用',
  View: '表示',
  Warning: '警告',
  'Warning:': '警告:',
  Yes: 'はい',
  'I understand': '理解しました',
  "I'm sure": 'はい',

  // Menus
  File: 'ファイル',
  Repository: 'リポジトリ',
  Branch: 'ブランチ',
  Window: 'ウインドウ',
  Help: 'ヘルプ',
  Exit: '終了',
  'New repository': '新しいリポジトリ',
  'Add local repository': 'ローカルリポジトリを追加',
  'Clone repository': 'リポジトリをクローン',
  'Show changes': '変更を表示',
  'Show history': '履歴を表示',
  'Show repository list': 'リポジトリの一覧を表示',
  'Repository list': 'リポジトリの一覧',
  'Show branches list': 'ブランチの一覧を表示',
  'Branches list': 'ブランチの一覧',
  'Show worktrees list': 'ワークツリーの一覧を表示',
  'Worktrees list': 'ワークツリーの一覧',
  'Go to summary': '概要へ移動',
  'Show stashed changes': 'スタッシュした変更を表示',
  'Hide stashed changes': 'スタッシュした変更を隠す',
  'Show changes filter': '変更フィルターを表示',
  'Hide changes filter': '変更フィルターを隠す',
  'Toggle changes filter': '変更フィルターの切り替え',
  'Toggle full screen': 'フルスクリーンの切り替え',
  'Reset zoom': '実際のサイズ',
  'Zoom in': '拡大',
  'Zoom out': '縮小',
  'Toggle developer tools': '開発者ツールの切り替え',
  'Expand active resizable': 'アクティブなパネルを広げる',
  'Contract active resizable': 'アクティブなパネルを狭める',
  'Open in shell': 'シェルで開く',
  'Open in terminal': 'ターミナルで開く',
  'Open in command prompt': 'コマンドプロンプトで開く',
  'Open in PowerShell': 'PowerShell で開く',
  'Show in Finder': 'Finder で表示',
  'Show in Explorer': 'エクスプローラーで表示',
  'Show in your file manager': 'ファイルマネージャーで表示',
  'Reveal in Finder': 'Finder で表示',
  'Open in external editor': '外部エディターで開く',
  'Open with': 'アプリケーションで開く',
  'Open with default program': '既定のプログラムで開く',
  'Repository settings': 'リポジトリの設定',
  'New branch': '新しいブランチ',
  'New worktree': '新しいワークツリー',
  'Discard all changes': 'すべての変更を破棄',
  'Stash all changes': 'すべての変更をスタッシュ',
  'Undo commit': 'コミットを元に戻す',
  'Compare to branch': 'ブランチと比較',
  'Merge into current branch': '現在のブランチにマージ',
  'Squash and merge into current branch':
    'スカッシュして現在のブランチにマージ',
  'Rebase current branch': '現在のブランチをリベース',
  'Preview pull request': 'プルリクエストをプレビュー',
  'Create pull request': 'プルリクエストを作成',
  'View pull request': 'プルリクエストを表示',
  'Show all pull requests': 'すべてのプルリクエストを表示',
  'Report issue': '問題を報告',
  'Contact GitHub support': 'GitHub サポートに問い合わせる',
  'Show user guides': 'ユーザーガイドを表示',
  'Show keyboard shortcuts': 'キーボードショートカットを表示',
  'Show logs in Finder': 'ログを Finder で表示',
  'Show logs in Explorer': 'ログをエクスプローラーで表示',
  'Show logs in your file manager': 'ログをファイルマネージャーで表示',
  'Install command line tool': 'コマンドラインツールをインストール',
  'Check for updates': 'アップデートを確認',
  'Open in GitHub Copilot': 'GitHub Copilot で開く',
  'Application menu': 'アプリケーションメニュー',

  // Main areas
  Changes: '変更',
  History: '履歴',
  Branches: 'ブランチ',
  'Pull requests': 'プルリクエスト',
  'Pull request': 'プルリクエスト',
  Commits: 'コミット',
  Commit: 'コミット',
  Repositories: 'リポジトリ',
  'Current repository': '現在のリポジトリ',
  'Current branch': '現在のブランチ',
  'Current worktree': '現在のワークツリー',
  'Current branch dropdown button': '現在のブランチのドロップダウンボタン',
  'Current worktree dropdown button':
    '現在のワークツリーのドロップダウンボタン',
  'Repository sidebar': 'リポジトリのサイドバー',
  'Push pull button': 'プッシュ・プルボタン',
  'Resize handle': 'サイズ変更ハンドル',
  Fetch: 'フェッチ',
  Push: 'プッシュ',
  Pull: 'プル',
  Publish: '公開',
  'Force push': '強制プッシュ',
  'Force pushing': '強制プッシュしています',
  'Publish branch': 'ブランチを公開',
  'Publish branch?': 'ブランチを公開しますか?',
  'Publish repository': 'リポジトリを公開',
  'Never fetched': '未フェッチ',
  'Pull, push, or fetch': 'プル、プッシュ、フェッチ',
  'Push, pull, fetch options': 'プッシュ・プル・フェッチのオプション',
  'Publish this branch to GitHub': 'このブランチを GitHub に公開します',
  'Publish this branch to the remote': 'このブランチをリモートに公開します',
  'Publish this repository to GitHub': 'このリポジトリを GitHub に公開します',
  'Publish to GitHub': 'GitHub に公開',
  'Publish your branch': 'ブランチを公開する',
  'Publish your repository to GitHub': 'リポジトリを GitHub に公開する',
  'Publish your repository to GitHub. Need help? {0}':
    'リポジトリを GitHub に公開しましょう。お困りですか? {0}',
  'Cannot publish detached HEAD': 'デタッチされた HEAD は公開できません',
  'Detached HEAD': 'デタッチされた HEAD',
  'Currently on a detached HEAD': 'デタッチされた HEAD にいます',
  'Overwrite any changes on {0}': '{0} の変更を上書き',
  'Push commits': 'コミットをプッシュ',
  'Push local changes?': 'ローカルの変更をプッシュしますか?',
  'Push rejected': 'プッシュが拒否されました',
  'Failed to push': 'プッシュに失敗しました',
  'Newer commits on remote': 'リモートに新しいコミットがあります',
  'Last fetched {0}': '最終フェッチ {0}',
  '{0} A force push will rewrite history on the remote. Any collaborators working on this branch will need to reset their own local branch to match the history of the remote.':
    '{0} 強制プッシュするとリモートの履歴が書き換えられます。このブランチで共同作業している人は、ローカルのブランチをリモートの履歴に合わせてリセットする必要があります。',
  'A force push will rewrite history on the remote. Any collaborators working on this branch will need to reset their own local branch to match the history of the remote.':
    '強制プッシュするとリモートの履歴が書き換えられます。このブランチで共同作業している人は、ローカルのブランチをリモートの履歴に合わせてリセットする必要があります。',
  'A force push will rewrite history on {0}. Any collaborators working on this branch will need to reset their own local branch to match the history of the remote.':
    '強制プッシュすると {0} の履歴が書き換えられます。このブランチで共同作業している人は、ローカルのブランチをリモートの履歴に合わせてリセットする必要があります。',
  'Are you sure you want to force push?': '強制プッシュしてもよろしいですか?',

  // Toolbar foldouts and lists
  'Filter your repositories': 'リポジトリを絞り込む',
  'Refresh the list of repositories': 'リポジトリの一覧を更新',
  'Refresh the list of pull requests': 'プルリクエストの一覧を更新',
  'Refresh this list': 'この一覧を更新',
  Recent: '最近',
  'Recent branches': '最近のブランチ',
  'Default branch': '既定のブランチ',
  'Other branches': 'その他のブランチ',
  'Other repositories': 'その他のリポジトリ',
  'Your repositories': 'あなたのリポジトリ',
  Enterprise: 'Enterprise',
  'No results': '結果がありません',
  'No repositories': 'リポジトリがありません',
  'No repository selected': 'リポジトリが選択されていません',
  'No branches to compare': '比較するブランチがありません',
  "Sorry, I can't find that branch": 'ブランチが見つかりません',
  "Sorry, I can't find that pull request!": 'プルリクエストが見つかりません',
  "Sorry, I can't find that remote branch.":
    'リモートブランチが見つかりません。',
  "Sorry, I can't find that repository": 'リポジトリが見つかりません',
  "Sorry, I can't find any repository matching {0}":
    '{0} に一致するリポジトリが見つかりません',
  'Hang tight': 'しばらくお待ちください',
  'Hang on': 'お待ちください',
  'Stand by': 'しばらくお待ちください',
  'Loading pull requests as fast as I can!':
    'プルリクエストをできるだけ速く読み込んでいます',
  'Hang Tight. Loading pull requests as fast as I can!':
    'しばらくお待ちください。プルリクエストを読み込んでいます',
  'No open pull requests in {0}':
    '{0} にはオープンなプルリクエストがありません',
  'Would you like to {0} and get going on your next project?':
    '{0}して次のプロジェクトを始めませんか?',
  'create a new branch': '新しいブランチを作成',
  'Would you like to {0} from the current branch?':
    '現在のブランチから{0}しますか?',
  'create a pull request': 'プルリクエストを作成',
  'ProTip! Press {0} to quickly create a new branch from anywhere within the app':
    'ヒント: {0} を押すと、アプリのどこからでも新しいブランチをすばやく作成できます',
  'ProTip! Press {0} to quickly add a local repository, and {1} to clone from anywhere within the app':
    'ヒント: アプリのどこからでも、{0} でローカルリポジトリを追加、{1} でクローンできます',
  '{0} You can drag & drop an existing repository folder here to add it to Desktop':
    '{0} 既存のリポジトリのフォルダをここにドラッグ&ドロップして追加できます',
  'ProTip!': 'ヒント:',
  'Choose a branch to merge into {0}': '{0} にマージするブランチを選択',
  'Merge into {0}': '{0} にマージ',
  'Squash and merge into {0}': 'スカッシュして {0} にマージ',
  'Rebase {0}': '{0} をリベース',
  'Show worktrees': 'ワークツリーを表示',
  'Add worktree': 'ワークツリーを追加',
  'No worktrees found': 'ワークツリーが見つかりません',
  Worktree: 'ワークツリー',
  Worktrees: 'ワークツリー',
  'Worktree name': 'ワークツリー名',
  'Create worktree': 'ワークツリーを作成',
  'Delete worktree': 'ワークツリーを削除',
  'Delete worktree failed': 'ワークツリーを削除できませんでした',
  'Rename worktree': 'ワークツリー名を変更',
  'Copy worktree name': 'ワークツリー名をコピー',
  'Copy worktree path': 'ワークツリーのパスをコピー',
  'Checkout in new worktree': '新しいワークツリーでチェックアウト',
  'Always show worktree list': 'ワークツリーの一覧を常に表示',
  'Will check out remote branch {0}.':
    'リモートブランチ {0} をチェックアウトします。',
  'Will check out existing branch {0}.':
    '既存のブランチ {0} をチェックアウトします。',
  'Worktree will be created at {0}.': 'ワークツリーは {0} に作成されます。',
  'Are you sure you want to delete the worktree {0}?':
    'ワークツリー {0} を削除してもよろしいですか?',
  'Deleting the worktree {0} failed.':
    'ワークツリー {0} を削除できませんでした。',
  'Would you like to forcefully delete the worktree {0} ?':
    'ワークツリー {0} を強制的に削除しますか?',
  'Forcefully delete': '強制的に削除',

  // Changes
  'Summary (required)': '概要 (必須)',
  Summary: '概要',
  Description: '説明',
  'Commit summary': 'コミットの概要',
  'Commit description': 'コミットの説明',
  'Commit message': 'コミットメッセージ',
  'Create commit': 'コミットを作成',
  'Commit to {0}': '{0} にコミット',
  'Committing to {0}': '{0} にコミットしています',
  'Amend last commit': '最後のコミットを修正',
  'Amending last commit': '最後のコミットを修正しています',
  Amend: '修正',
  Amending: '修正中',
  'Amend commit': 'コミットを修正',
  Committing: 'コミット中',
  'Committing changes': '変更をコミットしています',
  'Committing changes hidden by filter':
    'フィルターで隠れた変更をコミットしています',
  'A commit summary is required to commit': 'コミットするには概要が必要です',
  'Select one or more files to commit':
    'コミットするファイルを 1 つ以上選択してください',
  'Great commit summaries contain fewer than 50 characters':
    '優れたコミットの概要は 50 文字未満です',
  'Great commit summaries contain fewer than 50 characters. Place extra information in the description field.':
    '優れたコミットの概要は 50 文字未満です。詳しい情報は説明欄に書きましょう。',
  'Place extra information in the description field.':
    '詳しい情報は説明欄に書きましょう。',
  'Open summary length info': '概要の長さについての情報を開く',
  'Commit length': 'コミットの長さ',
  'Show commit length warning': 'コミットの長さの警告を表示',
  'Committing as {0}': '{0} としてコミット',
  'Configure commit options': 'コミットのオプションを設定',
  'Add co-authors': '共同作成者を追加',
  'Remove co-authors': '共同作成者を削除',
  'Co-Authors': '共同作成者',
  'Add Signed-off-by trailer': 'Signed-off-by トレーラーを追加',
  'Bypass commit hooks': 'コミットフックを回避',
  'Allow empty commit': '空のコミットを許可',
  'Enable commit spellcheck': 'コミットのスペルチェックを有効化',
  'Disable commit spellcheck': 'コミットのスペルチェックを無効化',
  'Empty commit message': '空のコミットメッセージ',
  'Commit failed': 'コミットに失敗しました',
  'Commit anyway': 'そのままコミット',
  'Commit filtered changes?': 'フィルターされた変更をコミットしますか?',
  'Hidden changes will be committed.': '非表示の変更もコミットされます。',
  'You have a filter applied. There are {0} that will be committed. Are you sure you want to commit these changes?':
    'フィルターが適用されています。コミットされる{0}があります。これらの変更をコミットしてもよろしいですか?',
  'hidden changes': '非表示の変更',
  'Your changes will modify your {0}. {1} to make these changes as a new commit.':
    '変更は{0}を修正します。新しいコミットとして作成するには{1}してください。',
  'most recent commit': '最新のコミット',
  'Stop amending': '修正をやめる',
  "You don't have write access to {0}. Want to {1} ?":
    '{0} への書き込み権限がありません。{1}しますか?',
  'create a fork': 'フォークを作成',
  '{0} is a protected branch. Want to {1} ?':
    '{0} は保護されたブランチです。{1}しますか?',
  'switch branches': 'ブランチを切り替え',
  'Select all changes': 'すべての変更を選択',
  'No changes': '変更はありません',
  'There are no changes.': '変更はありません。',
  'Untracked files will be excluded': '追跡されていないファイルは除外されます',
  'Filter changed files': '変更されたファイルを絞り込む',
  'Filter options': 'フィルターのオプション',
  'Clear filters': 'フィルターをクリア',
  'Included in commit': 'コミットに含める',
  'Excluded from commit': 'コミットから除外',
  'New files': '新しいファイル',
  'Modified files': '変更されたファイル',
  'Deleted files': '削除されたファイル',
  'Conflicted files': 'コンフリクトのあるファイル',
  'No files match your current filters':
    '現在のフィルターに一致するファイルはありません',
  'Adjust the filters to see all': 'フィルターを調整してすべて表示',
  'Include selected files': '選択したファイルを含める',
  'Exclude selected files': '選択したファイルを除外',
  'Ignore file (add to .gitignore)': 'ファイルを無視 (.gitignore に追加)',
  'Ignore folder (add to .gitignore)': 'フォルダを無視 (.gitignore に追加)',
  'Copy file path': 'ファイルのパスをコピー',
  'Copy relative file path': 'ファイルの相対パスをコピー',
  'Copy paths': 'パスをコピー',
  'Copy relative paths': '相対パスをコピー',
  'Discard changes': '変更を破棄',
  'Confirm discard changes': '変更の破棄を確認',
  'Confirm discard all changes': 'すべての変更の破棄を確認',
  'Are you sure you want to discard all changes to:':
    '次のファイルの変更をすべて破棄してもよろしいですか?',
  'Are you sure you want to discard the selected changes to:':
    '次のファイルの選択した変更を破棄してもよろしいですか?',
  'Discarded changes will be unrecoverable': '破棄した変更は元に戻せません',
  'Discarding changes permanently': '変更を完全に破棄しています',
  'Permanently discard changes': '変更を完全に破棄',
  'This will discard changes and they will be unrecoverable.':
    '変更が破棄され、元に戻せなくなります。',
  'Do not show this message again': '今後このメッセージを表示しない',
  'Recycle Bin': 'ごみ箱',
  Trash: 'ゴミ箱',
  'Common reasons are:': '主な原因:',
  'Stash changes': '変更をスタッシュ',
  'Stashed changes': 'スタッシュした変更',
  'View stash': 'スタッシュを表示',
  'View your stashed changes': 'スタッシュした変更を表示',
  'Discard stash?': 'スタッシュを破棄しますか?',
  'Discarding stash': 'スタッシュを破棄しています',
  'Are you sure you want to discard these stashed changes?':
    'スタッシュした変更を破棄してもよろしいですか?',
  'Overwrite stash?': 'スタッシュを上書きしますか?',
  'Are you sure you want to proceed? This will overwrite your existing stash with your current changes.':
    '続行してもよろしいですか? 既存のスタッシュが現在の変更で上書きされます。',
  '{0} will move your stashed files to the Changes list.':
    '{0}すると、スタッシュしたファイルが変更の一覧に移動します。',
  'Stash file list': 'スタッシュのファイル一覧',
  'Switch branch': 'ブランチを切り替え',
  'Stash changes and continue': '変更をスタッシュして続行',
  'You have changes on this branch. What would you like to do with them?':
    'このブランチに変更があります。どうしますか?',
  'Leave my changes on {0}': '変更を {0} に残す',
  'Bring my changes to {0}': '変更を {0} に持っていく',
  'Your in-progress work will be stashed on this branch for you to return to later':
    '作業中の内容はこのブランチにスタッシュされ、後で戻ってこられます',
  'Your in-progress work will follow you to the new branch':
    '作業中の内容は新しいブランチに移動します',
  '{0} Your current stash will be overwritten by creating a new stash':
    '{0} 新しいスタッシュを作成すると、現在のスタッシュは上書きされます',
  'Your current stash will be overwritten by creating a new stash':
    '新しいスタッシュを作成すると、現在のスタッシュは上書きされます',
  'This will create a stash with your current changes. You can recover them by restoring the stash afterwards.':
    '現在の変更でスタッシュを作成します。後でスタッシュを復元すれば元に戻せます。',
  'You can stash your changes now and recover them afterwards.':
    '今変更をスタッシュして、後で復元できます。',
  'The following files would be overwritten:': '次のファイルが上書きされます:',
  'There are uncommitted changes in this repository':
    'このリポジトリにはコミットされていない変更があります',
  'There are uncommitted changes in this repository.':
    'このリポジトリにはコミットされていない変更があります。',
  'Files too large': 'ファイルが大きすぎます',
  'The following files are over 100MB. {0}':
    '次のファイルは 100MB を超えています。{0}',
  'If you commit these files, you will no longer be able to push this repository to GitHub.com.':
    'これらのファイルをコミットすると、このリポジトリを GitHub.com にプッシュできなくなります。',
  'We recommend you avoid committing these files or use {0} to store large files on GitHub.':
    'これらのファイルはコミットしないか、{0} を使って GitHub に大きなファイルを保存することをおすすめします。',
  'Undo is disabled while the repository is being updated':
    'リポジトリの更新中は元に戻せません',
  'Committed {0}': '{0}にコミット',
  'Committed Just now': 'たった今コミット',
  'Changes list': '変更の一覧',
  'Changes filter': '変更フィルター',
  'Selected file': '選択中のファイル',

  // Home (no changes)
  'No local changes': 'ローカルの変更はありません',
  'Open the repository in your external editor':
    'リポジトリを外部エディターで開く',
  'Select your editor in {0}': '{0}でエディターを選べます',
  'Always available in the toolbar for local repositories or {0}':
    'ローカルリポジトリでは常にツールバーから実行できます。または {0}',
  'Always available in the toolbar or {0}':
    '常にツールバーから実行できます。または {0}',
  'Always available in the toolbar when there are remote changes or {0}':
    'リモートに変更がある場合はツールバーから実行できます。または {0}',
  'Always available in the toolbar when there are local commits waiting to be pushed or {0}':
    'プッシュ待ちのローカルコミットがある場合はツールバーから実行できます。または {0}',
  'Pull {0}': '{0} からプル',
  'Push {0}': '{0} にプッシュ',
  'Fetch {0}': '{0} をフェッチ',
  'Create a pull request from your current branch':
    '現在のブランチからプルリクエストを作成',
  'Preview the pull request from your current branch':
    '現在のブランチのプルリクエストをプレビュー',
  'Open pull request': 'プルリクエストを開く',
  'Open a pull request': 'プルリクエストを開く',
  'View the files of your repository in Finder':
    'リポジトリのファイルを Finder で表示',
  'View the files of your repository in Explorer':
    'リポジトリのファイルをエクスプローラーで表示',
  'View the files of your repository in your File Manager':
    'リポジトリのファイルをファイルマネージャーで表示',
  'Suggested actions for this branch': 'このブランチでできること',

  // History
  'No commit selected': 'コミットが選択されていません',
  'No commits to list': '表示するコミットがありません',
  'No history': '履歴がありません',
  'Select branch to compare': '比較するブランチを選択',
  'Select a single commit or a range of consecutive commits to view a diff.':
    '差分を表示するには、1 つのコミットか連続した範囲のコミットを選択してください。',
  'Unable to display diff when multiple non-consecutive selected.':
    '連続していない複数のコミットを選択しているため差分を表示できません。',
  'Right click on multiple commits to see options.':
    '複数のコミットを右クリックするとオプションが表示されます。',
  'Drag the commits to squash or reorder them.':
    'コミットをドラッグしてスカッシュまたは並べ替えます。',
  'Drag the commits to the branch menu to cherry-pick them.':
    'コミットをブランチメニューにドラッグしてチェリーピックします。',
  'This commit has not been pushed to the remote repository':
    'このコミットはまだリモートリポジトリにプッシュされていません',
  'Copy SHA': 'SHA をコピー',
  'Copy the full SHA': '完全な SHA をコピー',
  'Copy tag': 'タグをコピー',
  'Copy tags': 'タグをコピー',
  'Create branch from commit': 'コミットからブランチを作成',
  'Create tag': 'タグを作成',
  'Delete tag': 'タグを削除',
  'Cherry-pick commit': 'コミットをチェリーピック',
  'Reset to commit': 'このコミットにリセット',
  'Revert changes in commit': 'このコミットの変更を元に戻す',
  'Checkout commit': 'コミットをチェックアウト',
  'Checkout commit?': 'コミットをチェックアウトしますか?',
  'Checking out a commit': 'コミットのチェックアウト',
  'Checking out a commit will create a detached HEAD, and you will no longer be on any branch. Are you sure you want to checkout this commit?':
    'コミットをチェックアウトすると HEAD がデタッチされ、どのブランチにもいない状態になります。このコミットをチェックアウトしてもよろしいですか?',
  'View on GitHub': 'GitHub で表示',
  'View on GitHub Enterprise': 'GitHub Enterprise で表示',
  'View on Gitea': 'Gitea で表示',
  'Expand commit details': 'コミットの詳細を展開',
  'Collapse commit details': 'コミットの詳細を折りたたむ',
  'Expand description': '説明を展開',
  'Collapse description': '説明を折りたたむ',
  'Lines changed:': '変更行数:',
  'Showing changes from all commits': 'すべてのコミットの変更を表示しています',
  'Selected commit file list': '選択したコミットのファイル一覧',
  'Previous tags': '以前のタグ',
  'View commit author information': 'コミット作成者の情報を表示',
  'Commit may be misattributed. View warning.':
    'コミットの作成者が誤って記録される可能性があります。警告を表示します。',
  'Email address is disallowed. View warning.':
    'メールアドレスが許可されていません。警告を表示します。',
  'This commit will be misattributed':
    'このコミットは誤った作成者として記録されます',
  'Your commits will be wrongly attributed.':
    'コミットが誤った作成者として記録されます。',
  'This email address is disallowed': 'このメールアドレスは使用できません',
  'Update email': 'メールアドレスを更新',
  'Learn more about commit attribution': 'コミットの作成者についての詳細',
  'You can also set an email local to this repository from the {0} .':
    '{0}から、このリポジトリ専用のメールアドレスも設定できます。',
  'Committing with {0}': '{0} でコミット',
  'Undo commit?': 'コミットを元に戻しますか?',
  'You have changes in progress. Undoing the commit might result in some of these changes being lost. Do you want to continue anyway?':
    '作業中の変更があります。コミットを元に戻すと、変更の一部が失われる可能性があります。それでも続行しますか?',
  'You have changes in progress. Undoing the merge commit might result in some of these changes being lost.':
    '作業中の変更があります。マージコミットを元に戻すと、変更の一部が失われる可能性があります。',
  'You have changes in progress. Resetting to a previous commit might result in some of these changes being lost. Do you want to continue anyway?':
    '作業中の変更があります。以前のコミットにリセットすると、変更の一部が失われる可能性があります。それでも続行しますか?',
  'Do you want to continue anyway?': 'それでも続行しますか?',
  'Learn more about unreachable commits.': '到達できないコミットについての詳細',
  Reachable: '到達可能',
  Unreachable: '到達不能',
  'Commit reachability': 'コミットの到達性',
  Compare: '比較',
  'Merge options': 'マージのオプション',
  'Reorder commit': 'コミットを並べ替え',
  'Reorder commits': 'コミットを並べ替え',
  Reordering: '並べ替え中',
  Squash: 'スカッシュ',
  'Squash commits': 'コミットをスカッシュ',
  Squashing: 'スカッシュ中',
  'Squash and merge': 'スカッシュしてマージ',
  'Squash and': 'スカッシュして',
  Merge: 'マージ',
  Merging: 'マージ中',
  Rebase: 'リベース',
  Rebasing: 'リベース中',
  'Rebasing branch': 'ブランチをリベースしています',
  'Rebase in progress': 'リベース中',
  'Continue rebase': 'リベースを続行',
  'Cherry-pick': 'チェリーピック',
  'Cherry-pick to new branch': '新しいブランチにチェリーピック',
  'Create branch and cherry-pick': 'ブランチを作成してチェリーピック',
  'Create a merge commit': 'マージコミットを作成',
  'The commits from the selected branch will be added to the current branch via a merge commit.':
    '選択したブランチのコミットがマージコミットで現在のブランチに追加されます。',
  'The commits from the selected branch will be rebased and added to the current branch.':
    '選択したブランチのコミットがリベースされ、現在のブランチに追加されます。',
  'The commits in the selected branch will be combined into one commit in the current branch.':
    '選択したブランチのコミットが 1 つのコミットにまとめられ、現在のブランチに追加されます。',
  'The current branch is already up to date with the selected branch.':
    '現在のブランチには選択したブランチの変更がすべて含まれています。',
  '{0} is already up to date with {1}':
    '{0} には {1} の変更がすべて含まれています',
  'Choose a base branch': 'ベースブランチを選択',
  'Checking for ability to merge automatically...':
    '自動でマージできるか確認しています…',
  'Checking for ability to merge automatically':
    '自動でマージできるか確認しています',
  'Checking for ability to rebase automatically':
    '自動でリベースできるか確認しています',
  'Checking for ability to squash and merge automatically':
    '自動でスカッシュしてマージできるか確認しています',
  'Successfully merged': 'マージしました',
  'Successfully rebased': 'リベースしました',

  // Branches
  'Create branch': 'ブランチを作成',
  'Create a branch': 'ブランチを作成',
  'Create new branch': '新しいブランチを作成',
  'Create branch based on': 'ブランチの作成元',
  Name: '名前',
  'Branch name': 'ブランチ名',
  'Rename branch': 'ブランチ名を変更',
  'Delete branch': 'ブランチを削除',
  'Delete remote branch': 'リモートブランチを削除',
  'Delete branch {0}?': 'ブランチ {0} を削除しますか?',
  'Delete remote branch {0}?': 'リモートブランチ {0} を削除しますか?',
  'Copy branch name': 'ブランチ名をコピー',
  'Yes, delete this branch on the remote':
    'はい、リモートのこのブランチも削除します',
  'The branch also exists on the remote, do you wish to delete it there as well?':
    'このブランチはリモートにも存在します。リモートでも削除しますか?',
  'This branch does not exist locally. Deleting it may impact others collaborating on this branch.':
    'このブランチはローカルに存在しません。削除すると、このブランチで共同作業している人に影響する可能性があります。',
  'This branch may have an open pull request associated with it.':
    'このブランチにはオープンなプルリクエストが関連付けられている可能性があります。',
  'If {0} has been merged, you can also go to GitHub to delete the remote branch.':
    '{0} がマージ済みの場合は、GitHub でリモートブランチを削除することもできます。',
  'A branch named {0} already exists.':
    '{0} という名前のブランチは既に存在します。',
  'A branch named {0} already exists on the remote.':
    '{0} という名前のブランチは既にリモートに存在します。',
  'This branch is tracking {0} and renaming this branch will not change the branch name on the remote.':
    'このブランチは {0} を追跡しています。名前を変更しても、リモートのブランチ名は変わりません。',
  'Your new branch will be based on {0}':
    '新しいブランチは {0} をもとに作成されます',
  'Your current branch is unborn (does not contain any commits). Creating a new branch will rename the current branch.':
    '現在のブランチにはまだコミットがありません。新しいブランチを作成すると、現在のブランチの名前が変更されます。',
  'The currently checked out branch. Pick this if you need to build on work done on this branch.':
    '現在チェックアウトしているブランチです。このブランチでの作業をもとにする場合に選びます。',
  "The default branch in your repository. Pick this to start on something new that's not dependent on your current branch.":
    'リポジトリの既定のブランチです。現在のブランチに依存しない新しい作業を始める場合に選びます。',
  "The default branch of the upstream repository. Pick this to start on something new that's not dependent on your current branch.":
    'アップストリームリポジトリの既定のブランチです。現在のブランチに依存しない新しい作業を始める場合に選びます。',
  '{0} is the {1} for your repository.': '{0} はリポジトリの{1}です。',
  'Your default branch source is determined by your {0} .':
    '既定のブランチの作成元は{0}で決まります。',
  'fork behavior settings': 'フォークの動作の設定',
  'Invalid characters have been replaced by hyphens.':
    '使用できない文字はハイフンに置き換えられました。',
  'Spaces and invalid characters have been replaced by hyphens.':
    'スペースと使用できない文字はハイフンに置き換えられました。',
  'Will be created as {0}. {1}': '{0} として作成されます。{1}',
  '{0} is not a valid name.': '{0} は有効な名前ではありません。',
  'Name is invalid, it consists only of disallowed characters.':
    '名前が無効です。使用できない文字だけで構成されています。',
  'Update from {0}': '{0} から更新',
  'Switch to pull request': 'プルリクエストに切り替え',
  'Switch to repository and pull request':
    'リポジトリとプルリクエストに切り替え',

  // Tags
  'Create a tag': 'タグを作成',
  'A tag named {0} already exists': '{0} という名前のタグは既に存在します',
  'Are you sure you want to delete the tag {0}?':
    'タグ {0} を削除してもよろしいですか?',
  'Push tags': 'タグをプッシュ',

  // Repositories
  'Add repository': 'リポジトリを追加',
  'Add existing repository': '既存のリポジトリを追加',
  'Add a local repository': 'ローカルリポジトリを追加',
  'Add an existing repository from your local drive':
    'ローカルドライブから既存のリポジトリを追加',
  'Create a new repository': '新しいリポジトリを作成',
  'Create a new repository on your local drive':
    'ローカルドライブに新しいリポジトリを作成',
  'Create new repository': '新しいリポジトリを作成',
  'Create repository': 'リポジトリを作成',
  'Clone a repository': 'リポジトリをクローン',
  'Clone a repository from the Internet':
    'インターネットからリポジトリをクローン',
  'Create a tutorial repository': 'チュートリアル用リポジトリを作成',
  'Return to in progress tutorial': '進行中のチュートリアルに戻る',
  'Add a repository to MS2026 Desktop to start collaborating':
    'MS2026 Desktop にリポジトリを追加して共同作業を始めましょう',
  "Let's get started!": 'さあ、始めましょう!',
  'Get started': 'はじめる',
  'Get started on a brand new project': '新しいプロジェクトを始める',
  'Contribute to a project that interests you':
    '興味のあるプロジェクトに参加する',
  'Work on an existing project in MS2026 Desktop':
    'MS2026 Desktop で既存のプロジェクトに取り組む',
  'Explore projects on GitHub': 'GitHub でプロジェクトを探す',
  'Select a repository': 'リポジトリを選択',
  'Local path': 'ローカルパス',
  Path: 'パス',
  'Path:': 'パス:',
  'Git ignore': '無視するファイル (.gitignore)',
  License: 'ライセンス',
  'Initialize this repository with a README': 'README でこのリポジトリを初期化',
  'The repository will be created at {0}.': 'リポジトリは {0} に作成されます。',
  'This directory contains a {0} file already. Checking this box will result in the existing file being overwritten.':
    'このディレクトリには既に {0} があります。チェックすると既存のファイルが上書きされます。',
  'The directory {0}appears to be a Git repository. Would you like to {1} instead?':
    'ディレクトリ {0} は Git リポジトリのようです。代わりに{1}しますか?',
  'add this repository': 'このリポジトリを追加',
  'The directory {0}appears to be a subfolder of Git repository. {1}':
    'ディレクトリ {0} は Git リポジトリのサブフォルダのようです。{1}',
  'Learn about submodules.': 'サブモジュールについて',
  'This directory does not appear to be a Git repository.':
    'このディレクトリは Git リポジトリではないようです。',
  'This directory does not appear to be a Git repository. Would you like to create a repository here instead?':
    'このディレクトリは Git リポジトリではないようです。代わりにここにリポジトリを作成しますか?',
  'Would you like to {0} here instead?': '代わりにここに{0}しますか?',
  'create a repository': 'リポジトリを作成',
  'This directory appears to be a bare repository. Bare repositories are not currently supported.':
    'このディレクトリはベアリポジトリのようです。ベアリポジトリには対応していません。',
  'Directory could not be created at this path.':
    'このパスにディレクトリを作成できませんでした。',
  'Directory could not be created at this path. You may not have permissions to create a directory here.':
    'このパスにディレクトリを作成できませんでした。ここにディレクトリを作成する権限がない可能性があります。',
  'Unable to read path on disk. Please check the path and try again.':
    'ディスク上のパスを読み取れません。パスを確認してもう一度お試しください。',
  'The local path cannot end in .app on macOS. Choose a different folder name to avoid creating an application bundle.':
    'macOS ではローカルパスの末尾を .app にできません。アプリケーションバンドルにならないよう、別のフォルダ名を選んでください。',
  'The Git repository at {0} appears to be owned by another user on your machine. Adding untrusted repositories may automatically execute files in the repository.':
    '{0} の Git リポジトリは、このマシンの別のユーザーが所有しているようです。信頼できないリポジトリを追加すると、リポジトリ内のファイルが自動で実行される可能性があります。',
  'If you trust the owner of the directory you can {0} in order to continue.':
    'ディレクトリの所有者を信頼できる場合は、{0}して続行できます。',
  'add an exception for this directory': 'このディレクトリを例外に追加',
  'Trust repository': 'リポジトリを信頼',
  'Remove repository': 'リポジトリを削除',
  'The repository will be removed from MS2026 Desktop:':
    '次のリポジトリが MS2026 Desktop から削除されます:',
  'Also move this repository to': 'このリポジトリを次の場所にも移動:',
  'Copy repo name': 'リポジトリ名をコピー',
  'Copy repo path': 'リポジトリのパスをコピー',
  'Change alias': 'エイリアスを変更',
  'Create alias': 'エイリアスを作成',
  'Remove alias': 'エイリアスを削除',
  Alias: 'エイリアス',
  'Change repository alias': 'リポジトリのエイリアスを変更',
  'Create repository alias': 'リポジトリのエイリアスを作成',
  'This will not affect the original repository name on GitHub.':
    'GitHub 上の元のリポジトリ名には影響しません。',
  'Open repository': 'リポジトリを開く',
  'Open in browser': 'ブラウザで開く',
  'Open editor': 'エディターを開く',
  'Open without Git': 'Git なしで開く',
  'Clone again': 'もう一度クローン',
  'Retry clone': 'クローンを再試行',
  Clone: 'クローン',
  'Clone as:': 'クローン先:',
  Cloning: 'クローン中',
  'Cloning {0}': '{0} をクローンしています',
  'Clone failed': 'クローンに失敗しました',
  'Repository URL or GitHub username and repository':
    'リポジトリの URL、または GitHub のユーザー名とリポジトリ',
  'URL or username/repository': 'URL またはユーザー名/リポジトリ',
  'There is already a file with this name. Git can only clone to a folder.':
    'この名前のファイルが既に存在します。Git はフォルダにのみクローンできます。',
  'This folder contains files. Git can only clone to empty folders.':
    'このフォルダにはファイルがあります。Git は空のフォルダにのみクローンできます。',
  "Looks like there are no repositories for {0} on {1}. {2} if you've created a repository recently.":
    '{0} のリポジトリは {1} にないようです。最近リポジトリを作成した場合は{2}してください。',
  Archived: 'アーカイブ済み',
  'Would you like to retry cloning {0}?': '{0} のクローンを再試行しますか?',
  'Publish your repository': 'リポジトリを公開',
  'Keep this code private': 'このコードを非公開にする',
  Organization: '組織',
  'This repository is currently only available on your local machine. By publishing it on GitHub you can share it, and collaborate with others.':
    'このリポジトリは現在このマシンにのみあります。GitHub に公開すると、共有や共同作業ができます。',
  'Missing repository': 'リポジトリが見つかりません',
  'Can\'t find "{0}"': '「{0}」が見つかりません',
  'It was last seen at {0}. {1}': '最後に確認された場所は {0} です。{1}',
  'Check again.': 'もう一度確認',
  'Could not determine repository type':
    'リポジトリの種類を判別できませんでした',

  // Pull requests
  'Choose a model': 'モデルを選択',
  Draft: '下書き',
  'Review requested': 'レビュー依頼',
  'Checks Summary': 'チェックの概要',
  'All checks have failed': 'すべてのチェックが失敗しました',
  'All checks have passed': 'すべてのチェックに成功しました',
  "Some checks haven't completed yet": '一部のチェックがまだ完了していません',
  'Some checks were not successful': '一部のチェックが成功しませんでした',
  'Re-run': '再実行',
  'Re-run {0}': '再実行 {0}',
  'Re-run checks': 'チェックを再実行',
  'Re-run all checks': 'すべてのチェックを再実行',
  'Re-run failed checks': '失敗したチェックを再実行',
  'View check details': 'チェックの詳細を表示',
  'View check details {0}': 'チェックの詳細を表示 {0}',
  'There are no steps to display for this check. {0}':
    'このチェックに表示する手順はありません。{0}',
  'Check runs incoming!': 'チェックを読み込んでいます',
  'Check run steps incoming!': 'チェックの手順を読み込んでいます',
  'Determining which checks can be re-run.':
    '再実行できるチェックを確認しています。',
  'Able to merge.': 'マージできます。',
  "Can't automatically merge.": '自動でマージできません。',
  'These branches can be automatically merged.':
    'これらのブランチは自動でマージできます。',
  'Don’t worry, you can still create the pull request.':
    'プルリクエストは作成できます。',
  'Checking mergeability': 'マージできるか確認しています',
  'Error checking merge status.': 'マージの状態を確認できませんでした。',
  'Unable to merge unrelated histories in this repository':
    'このリポジトリの無関係な履歴はマージできません',
  '{0} These branches can be automatically merged.':
    '{0} これらのブランチは自動でマージできます。',
  '{0} Don’t worry, you can still create the pull request.':
    '{0} プルリクエストは作成できます。',
  '{0} Unable to merge unrelated histories in this repository':
    '{0} このリポジトリの無関係な履歴はマージできません',
  'Merge {0} into {1} from {2}.': '{0} を {1} にマージします (マージ元: {2})。',
  '{0} is up to date with all commits from {1}.':
    '{0} には {1} のすべてのコミットが含まれています。',
  '{0} and {1} are entirely different commit histories.':
    '{0} と {1} はまったく異なるコミット履歴です。',
  'Could not find a default branch to compare against.':
    '比較する既定のブランチが見つかりませんでした。',
  'Select a base branch above.': '上でベースブランチを選択してください。',
  'Your branch must be published before opening a pull request.':
    'プルリクエストを作成する前にブランチを公開してください。',
  'You can only open pull requests against remote branches.':
    'プルリクエストはリモートブランチに対してのみ作成できます。',
  'Would you like to publish {0} now and open a pull request?':
    '{0} を今すぐ公開してプルリクエストを作成しますか?',
  'Would you like to push your changes to {0} before creating your pull request?':
    'プルリクエストを作成する前に、変更を {0} にプッシュしますか?',
  'Create without pushing': 'プッシュせずに作成',
  'Pull request file list': 'プルリクエストのファイル一覧',
  'Base:': 'ベース:',
  'View branch on GitHub': 'GitHub でブランチを表示',
  'Do you want to switch to that Pull Request now and start fixing {0}?':
    'このプルリクエストに切り替えて{0}の修正を始めますか?',

  // Conflicts and multi commit operations
  'Resolve conflicts before {0}': '{0}の前にコンフリクトを解決',
  'Resolve conflicts to continue': 'コンフリクトを解決して続行してください',
  'Resolve conflicts to continue rebasing {0}.':
    'コンフリクトを解決して {0} のリベースを続行してください。',
  'Resolve conflicts to continue cherry-picking onto {0}.':
    'コンフリクトを解決して {0} へのチェリーピックを続行してください。',
  'Resolve conflicts and commit to merge into {0}.':
    'コンフリクトを解決してコミットし、{0} へのマージを完了してください。',
  'Resolve all conflicts before continuing':
    '続行する前にすべてのコンフリクトを解決してください',
  'Resolve all changes before continuing':
    '続行する前にすべての変更を解決してください',
  'All conflicts resolved': 'すべてのコンフリクトを解決しました',
  'All conflicted files have been resolved.':
    'すべてのコンフリクトのあるファイルが解決されました。',
  'All resolutions have been undone.': 'すべての解決を元に戻しました。',
  'View conflicts': 'コンフリクトを表示',
  Conflicts: 'コンフリクト',
  'Conflict resolution': 'コンフリクトの解決',
  'Choose a resolution': '解決方法を選択',
  'Choose a resolution for this file': 'このファイルの解決方法を選択',
  'Change resolution choice': '解決方法を変更',
  'Use current file': '現在のファイルを使用',
  'Use incoming file': '取り込むファイルを使用',
  'Keep file': 'ファイルを残す',
  'Delete file': 'ファイルを削除',
  'Keeping modified file': '変更したファイルを残します',
  'Manual conflict': '手動で解決するコンフリクト',
  'Open in command line,': 'コマンドライン、',
  '{0} your tool of choice, or close to resolve manually.':
    '{0}お好みのツールで開くか、閉じて手動で解決してください。',
  'Are you sure you want to commit these conflicted files?':
    'コンフリクトのあるファイルをコミットしてもよろしいですか?',
  'Confirm committing conflicted files':
    'コンフリクトのあるファイルのコミットを確認',
  'If you choose to commit, you’ll be committing the following conflicted files into your repository:':
    'コミットすると、次のコンフリクトのあるファイルがリポジトリにコミットされます:',
  'Yes, commit files': 'はい、ファイルをコミットします',
  'This will take you back to the original branch state and the conflicts you have already resolved will be discarded.':
    'ブランチを元の状態に戻し、解決済みのコンフリクトは破棄されます。',
  'Cannot resolve while operation is being aborted':
    '操作の中止中は解決できません',
  'Unable to start rebase. Check you have chosen a valid branch.':
    'リベースを開始できません。有効なブランチを選択しているか確認してください。',
  'You are not able to rebase this branch onto itself.':
    'ブランチをそれ自体にリベースすることはできません。',
  'You are not able to cherry-pick from and to the same branch':
    '同じブランチからそのブランチへはチェリーピックできません',
  'Unable to reorder. Reordering replays all commits up to the last one required for the reorder. A merge commit cannot exist among those commits.':
    '並べ替えできません。並べ替えでは、必要な最後のコミットまでのすべてのコミットを再適用します。その中にマージコミットがあってはいけません。',
  'Unable to squash. Squashing replays all commits up to the last one required for the squash. A merge commit cannot exist among those commits.':
    'スカッシュできません。スカッシュでは、必要な最後のコミットまでのすべてのコミットを再適用します。その中にマージコミットがあってはいけません。',
  'Unable to merge unrelated histories': '無関係な履歴はマージできません',
  'Abort merge': 'マージを中止',
  'Abort rebase': 'リベースを中止',
  'Abort cherry-pick': 'チェリーピックを中止',
  'Abort squash': 'スカッシュを中止',
  'Abort reorder': '並べ替えを中止',
  'Continue merge': 'マージを続行',
  'Continue cherry-pick': 'チェリーピックを続行',
  'Continue squash': 'スカッシュを続行',
  'Continue reorder': '並べ替えを続行',
  'Begin rebase': 'リベースを開始',
  'Begin squash': 'スカッシュを開始',
  'Begin reorder': '並べ替えを開始',
  'Begin cherry-pick': 'チェリーピックを開始',
  'Rebase will require force push': 'リベースには強制プッシュが必要です',
  'Squash will require force push': 'スカッシュには強制プッシュが必要です',
  'Reorder will require force push': '並べ替えには強制プッシュが必要です',
  'Successfully squashed': 'スカッシュしました',
  'Successfully reordered': '並べ替えました',
  'Successfully copied': 'コピーしました',
  'Choose a branch to merge into': 'マージするブランチを選択',

  // Diff
  'No file selected': 'ファイルが選択されていません',
  'Hide whitespace changes': '空白の変更を隠す',
  'Show whitespace changes?': '空白の変更を表示しますか?',
  'Interacting with individual lines or hunks will be disabled while hiding whitespace.':
    '空白を隠している間は、行やハンクごとの操作はできません。',
  'Selecting lines is disabled when hiding whitespace changes.':
    '空白の変更を隠している間は行を選択できません。',
  'Show check marks in the diff': '差分にチェックマークを表示',
  'Diff display': '差分の表示',
  Unified: '統合',
  Split: '分割',
  'Diff settings': '差分の設定',
  'Diff options': '差分のオプション',
  'No newline at end of file': 'ファイル末尾に改行がありません',
  'The diff is too large to be displayed by default.':
    '差分が大きすぎるため、既定では表示されません。',
  'The diff is too large to be displayed.':
    '差分が大きすぎるため表示できません。',
  'You can try to show it anyway, but performance may be negatively impacted.':
    'それでも表示できますが、パフォーマンスが低下する可能性があります。',
  'Show diff': '差分を表示',
  'Unable to load the diff for this file.':
    'このファイルの差分を読み込めません。',
  'This binary file has changed.': 'このバイナリファイルは変更されています。',
  'Open file in external program.': '外部プログラムでファイルを開きます。',
  'The file is empty': 'ファイルは空です',
  'The file was renamed but not changed':
    'ファイル名が変更されました (内容の変更はありません)',
  'The file was renamed and includes changes.':
    'ファイル名が変更され、内容も変更されています。',
  'Only whitespace changes found': '空白の変更のみです',
  'No content changes found': '内容の変更はありません',
  'The file is in conflict and must be resolved via the command line.':
    'このファイルにはコンフリクトがあり、コマンドラインで解決する必要があります。',
  'Expand whole file': 'ファイル全体を展開',
  'Collapse expanded lines': '展開した行を折りたたむ',
  'Expand up': '上に展開',
  'Expand down': '下に展開',
  'Expand all': 'すべて展開',
  '2-up': '並べて表示',
  Swipe: 'スワイプ',
  'Onion skin': 'オニオンスキン',
  Difference: '差分',
  'Diff:': '差分:',
  'W:': '幅:',
  'H:': '高さ:',
  'Size:': 'サイズ:',
  'No size difference': 'サイズの差はありません',
  Added: '追加',
  Modified: '変更',
  Deleted: '削除',
  Removed: '削除',
  Untracked: '未追跡',
  Renamed: '名前を変更',
  Copied: 'コピー',
  Conflicted: 'コンフリクト',
  Excluded: '除外',
  Included: '含む',
  'Submodule changes': 'サブモジュールの変更',
  'This change can be committed to the parent repository.':
    'この変更は親リポジトリにコミットできます。',
  'Open this submodule on MS2026 Desktop':
    'このサブモジュールを MS2026 Desktop で開く',
  'You can open this submodule on MS2026 Desktop as a normal repository to manage and commit any changes in it.':
    'このサブモジュールを通常のリポジトリとして MS2026 Desktop で開き、変更を管理・コミットできます。',
  'Only changes that have been committed within the submodule will be added to this repository. You need to commit any other modified or untracked changes in the submodule before including them in this repository.':
    'このリポジトリに追加されるのは、サブモジュール内でコミットされた変更だけです。それ以外の変更や未追跡のファイルは、先にサブモジュール内でコミットしてください。',
  'This submodule change cannot be added to a commit in this repository because it contains changes that have not been committed.':
    'このサブモジュールの変更には未コミットの変更が含まれるため、このリポジトリのコミットに追加できません。',
  'This diff contains bidirectional Unicode text that may be interpreted or compiled differently than what appears below. To review, open the file in an editor that reveals hidden Unicode characters. {0}':
    'この差分には双方向の Unicode テキストが含まれており、表示とは異なる解釈やコンパイルが行われる可能性があります。確認するには、隠れた Unicode 文字を表示できるエディターでファイルを開いてください。{0}',
  'Learn more about bidirectional Unicode characters':
    '双方向 Unicode 文字についての詳細',
  Search: '検索',
  Previous: '前へ',
  Next: '次へ',

  // Dialogs: general
  'Are you sure?': 'よろしいですか?',
  'This action cannot be undone.': 'この操作は元に戻せません。',
  'Show a confirmation dialog before...': '次の操作の前に確認ダイアログを表示:',
  'Removing repositories': 'リポジトリの削除',
  'Error details': 'エラーの詳細',
  'Uncaught exception': '予期しない例外',
  'Open Git settings': 'Git の設定を開く',
  'Open preferences': '設定を開く',
  'Open options': '設定を開く',

  // Sign in and accounts
  'Sign in': 'サインイン',
  'Sign out': 'サインアウト',
  'Sign into': 'サインイン:',
  'Sign in using your browser': 'ブラウザでサインイン',
  'Sign in using your browser {0}': 'ブラウザでサインイン {0}',
  'Sign in to GitHub.com': 'GitHub.com にサインイン',
  'Sign in to GitHub.com {0}': 'GitHub.com にサインイン {0}',
  'Sign in to GitHub Enterprise': 'GitHub Enterprise にサインイン',
  'Sign in to your GitHub.com account to access your repositories.':
    'GitHub.com アカウントにサインインしてリポジトリにアクセスします。',
  'If you are using GitHub Enterprise at work, sign in to it to get access to your repositories.':
    '職場で GitHub Enterprise を使っている場合は、サインインしてリポジトリにアクセスします。',
  'Continue with browser': 'ブラウザで続行',
  'Continue in browser': 'ブラウザで続行',
  "Your browser will redirect you back to MS2026 Desktop once you've signed in. If your browser asks for your permission to launch MS2026 Desktop please allow it to.":
    'サインインすると、ブラウザから MS2026 Desktop に戻ります。ブラウザが MS2026 Desktop の起動の許可を求めた場合は許可してください。',
  "Your browser will redirect you back to MS2026 Desktop once you've signed in. If your browser asks for your permission to launch MS2026 Desktop, please allow it.":
    'サインインすると、ブラウザから MS2026 Desktop に戻ります。ブラウザが MS2026 Desktop の起動の許可を求めた場合は許可してください。',
  'Enterprise address': 'Enterprise のアドレス',
  'Server address': 'サーバーのアドレス',
  Username: 'ユーザー名',
  Password: 'パスワード',
  'Personal access token': '個人アクセストークン',
  'Remember password': 'パスワードを記憶',
  'Remember passphrase': 'パスフレーズを記憶',
  'Toggle password visibility': 'パスワードの表示を切り替え',
  Account: 'アカウント',
  Accounts: 'アカウント',
  'Add account': 'アカウントを追加',
  'Add GitHub Enterprise account': 'GitHub Enterprise アカウントを追加',
  'Add Gitea account': 'Gitea アカウントを追加',
  'Add an account on a Gitea server to see and create pull requests for repositories hosted there.':
    'Gitea サーバーのアカウントを追加すると、そこでホストされているリポジトリのプルリクエストを表示・作成できます。',
  'Create a token in Gitea under Settings > Applications with the read:user and write:repository scopes.':
    'Gitea の「設定 > アプリケーション」で、read:user と write:repository のスコープを持つトークンを作成してください。',
  'Choose an account': 'アカウントを選択',
  'Connecting to GitHub': 'GitHub に接続しています',
  "You're already signed in to {0} with the account {1}. If you continue, you will first be signed out.":
    '{0} にはアカウント {1} で既にサインインしています。続行すると、先にサインアウトします。',
  'Authentication failed': '認証に失敗しました',
  Authentication: '認証',
  'Invalidated account token': '無効になったアカウントトークン',
  'Your account token has been invalidated and you have been signed out from your {0} account. Do you want to sign in again?':
    'アカウントトークンが無効になったため、{0} アカウントからサインアウトしました。もう一度サインインしますか?',
  'Re-authorization required': '再認証が必要です',
  'We were unable to authenticate with {0}. Please enter {1} to try again.':
    '{0} で認証できませんでした。もう一度試すには {1} を入力してください。',
  'the password for the user {0}': 'ユーザー {0} のパスワード',
  "Depending on your repository's hosting service, you might need to use a Personal Access Token (PAT) as your password. Learn more about creating a PAT in our {0} .":
    'リポジトリのホスティングサービスによっては、パスワードとして個人アクセストークン (PAT) を使う必要があります。PAT の作成方法は{0}を参照してください。',
  'integration docs': '連携のドキュメント',
  'Git requesting credentials to access {0}.':
    'Git が {0} にアクセスするための認証情報を求めています。',
  'Untrusted server': '信頼できないサーバー',
  'View certificate': '証明書を表示',
  'Add certificate': '証明書を追加',
  'This may indicate attackers are trying to steal your data.':
    '攻撃者がデータを盗もうとしている可能性があります。',
  'Only continue if you recognize and trust this server.':
    'このサーバーを知っていて信頼できる場合にのみ続行してください。',
  'Are you sure you want to continue connecting?':
    '接続を続けてもよろしいですか?',
  'SSH host': 'SSH ホスト',
  'SSH key passphrase': 'SSH キーのパスフレーズ',
  'SSH user password': 'SSH ユーザーのパスワード',
  'New to GitHub? {0}': 'GitHub は初めてですか? {0}',
  'Create your free account.': '無料アカウントを作成しましょう。',
  'Welcome to {0}': '{0} へようこそ',
  'Welcome to MS2026 Desktop': 'MS2026 Desktop へようこそ',
  'MS2026 Desktop is a seamless way to contribute to projects on GitHub and GitHub Enterprise. Sign in below to get started with your existing projects.':
    'MS2026 Desktop で GitHub や GitHub Enterprise のプロジェクトにスムーズに参加できます。下からサインインして、既存のプロジェクトを始めましょう。',
  'Skip this step': 'この手順をスキップ',
  'Configure Git': 'Git を設定',
  'This is used to identify the commits you create. Anyone will be able to see this information if you publish commits.':
    '作成したコミットの識別に使われます。コミットを公開すると誰でもこの情報を見られます。',
  'Use my global Git config': 'グローバルの Git 設定を使用',
  'Use a local Git config': 'ローカルの Git 設定を使用',
  'Configure manually': '手動で設定',
  'Example commit': 'コミットの例',
  'Fix all the things': 'いろいろ修正',
  Email: 'メールアドレス',
  'Your name': '名前',
  'Your account emails': 'アカウントのメールアドレス',
  'Full Name:': '氏名:',
  'Email:': 'メールアドレス:',
  'Display name': '表示名',
  'Avatar for unknown user': '不明なユーザーのアバター',
  'Unknown user': '不明なユーザー',
  'Search for user': 'ユーザーを検索',
  'MS2026 Desktop sends usage metrics to improve the product and inform feature decisions. {0}':
    'MS2026 Desktop は製品の改善と機能の判断のために利用状況を送信します。{0}',
  'Learn more about user metrics.': '利用状況の送信についての詳細',
  "By creating an account, you agree to the {0} . For more information about GitHub's privacy practices, see the {1}":
    'アカウントを作成すると、{0}に同意したことになります。GitHub のプライバシーへの取り組みについては{1}をご覧ください',
  'Terms of Service': '利用規約',
  'GitHub Privacy Statement.': 'GitHub プライバシーステートメント。',
  'GitHub Privacy Statement': 'GitHub プライバシーステートメント',

  // Preferences
  Preferences: '設定',
  Integrations: '連携',
  Git: 'Git',
  Appearance: '外観',
  Notifications: '通知',
  Prompts: 'プロンプト',
  Advanced: '詳細設定',
  Accessibility: 'アクセシビリティ',
  Links: 'リンク',
  Copilot: 'Copilot',
  Theme: 'テーマ',
  Light: 'ライト',
  Dark: 'ダーク',
  System: 'システム',
  'Loading system theme': 'システムのテーマを読み込んでいます',
  Formatting: '書式',
  'Date format': '日付の形式',
  'Time format': '時刻の形式',
  'Number format': '数値の形式',
  Miscellaneous: 'その他',
  Miscellanea: 'その他',
  'Diff tab size': '差分のタブ幅',
  'Prefer absolute dates over relative':
    '相対的な日付より絶対的な日付を優先する',
  Language: '言語',
  'Display language': '表示言語',
  'External editor': '外部エディター',
  Shell: 'シェル',
  'Configure custom editor': 'カスタムエディターを設定',
  'Configure custom shell': 'カスタムシェルを設定',
  'Path to executable': '実行ファイルのパス',
  'Command line arguments': 'コマンドライン引数',
  Arguments: '引数',
  'This path does not appear to be a valid executable.':
    'このパスは有効な実行ファイルではないようです。',
  'These arguments are not valid.': '引数が無効です。',
  'No editors found.': 'エディターが見つかりません。',
  'No other editors found.': 'ほかのエディターが見つかりません。',
  'No editors found. {0}': 'エディターが見つかりません。{0}',
  'No other editors found. {0}': 'ほかのエディターが見つかりません。{0}',
  'Select an editor': 'エディターを選択',
  'Default branch name for new repositories':
    '新しいリポジトリの既定のブランチ名',
  "GitHub's default branch name is {0}. You may want to change it due to different workflows, or because your integrations still require the historical default branch name of {1}.":
    'GitHub の既定のブランチ名は {0} です。ワークフローの違いや、連携先がまだ以前の既定のブランチ名 {1} を必要とする場合は変更してください。',
  'These preferences will {0} .': 'これらの設定は{0}します。',
  'edit your global Git config file': 'グローバルの Git 設定ファイルを編集',
  'Git config': 'Git の設定',
  Global: 'グローバル',
  Local: 'ローカル',
  'Removing worktrees': 'ワークツリーの削除',
  'Discarding changes': '変更の破棄',
  Pushing: 'プッシュ',
  'Switching branches': 'ブランチの切り替え',
  'Discarding stashes': 'スタッシュの破棄',
  'If I have changes and I switch branches...':
    '変更がある状態でブランチを切り替えたとき:',
  'Ask me where I want the changes to go': '変更の移動先を毎回確認する',
  'Always bring my changes to my new branch':
    '変更を常に新しいブランチに持っていく',
  'Always stash and leave my changes on the current branch':
    '変更を常にスタッシュして現在のブランチに残す',
  'Background updates': 'バックグラウンド更新',
  'Show status icons in the repository list':
    'リポジトリの一覧にステータスアイコンを表示',
  'These icons indicate which repositories have local or remote changes, and require the periodic fetching of repositories that are not currently selected.':
    'これらのアイコンは、ローカルまたはリモートに変更があるリポジトリを示します。表示には、選択していないリポジトリの定期的なフェッチが必要です。',
  'Turning this off will not stop the periodic fetching of your currently selected repository, but may improve overall app performance for users with many repositories.':
    'オフにしても選択中のリポジトリの定期的なフェッチは止まりませんが、リポジトリが多い場合はアプリ全体のパフォーマンスが向上することがあります。',
  'Network and credentials': 'ネットワークと認証情報',
  'Use system OpenSSH (recommended)': 'システムの OpenSSH を使用 (推奨)',
  'Use Git Credential Manager': 'Git Credential Manager を使用',
  'Use {0} for private repositories outside of GitHub.com. This feature is experimental and subject to change.':
    'GitHub.com 以外の非公開リポジトリで {0} を使います。この機能は試験的なもので、変更される可能性があります。',
  Hooks: 'フック',
  'Load Git hook environment variables from shell':
    'Git フックの環境変数をシェルから読み込む',
  'Shell to use when loading environment': '環境の読み込みに使うシェル',
  'Cache Git hook environment variables': 'Git フックの環境変数をキャッシュ',
  'Cache hook environment variables to improve performance. Disable if your hooks rely on frequently changing environment variables.':
    'フックの環境変数をキャッシュしてパフォーマンスを改善します。頻繁に変わる環境変数にフックが依存している場合は無効にしてください。',
  Usage: '使用量',
  'Help MS2026 Desktop improve by submitting {0}':
    '{0}を送信して MS2026 Desktop の改善に協力する',
  'usage stats': '利用状況',
  'Underline links': 'リンクに下線を表示',
  'When enabled, MS2026 Desktop will underline links in commit messages, comments, and other text fields. This can help make links easier to distinguish. {0}':
    '有効にすると、MS2026 Desktop はコミットメッセージやコメントなどのテキスト内のリンクに下線を表示します。リンクを見分けやすくなります。{0}',
  'This is an example link': 'これはリンクの例です',
  'When enabled, check marks will be displayed along side the line numbers and groups of line numbers in the diff when committing. When disabled, the line number controls will be less prominent.':
    '有効にすると、コミット時に差分の行番号の横にチェックマークを表示します。無効にすると、行番号のコントロールが目立たなくなります。',
  'Enable notifications': '通知を有効化',
  'Allows the display of notifications when high-signal events take place in the current repository.':
    '現在のリポジトリで重要なイベントが起きたときに通知を表示します。',
  'Notifications settings': '通知の設定',
  'You need to {0} to display these notifications from MS2026 Desktop.':
    'MS2026 Desktop からの通知を表示するには{0}する必要があります。',
  'grant permission': '許可',
  'Show commit progress': 'コミットの進行状況を表示',

  // About and updates
  About: '情報',
  'Version {0}': 'バージョン {0}',
  Version: 'バージョン',
  'Checking for updates': 'アップデートを確認しています',
  'Downloading update': 'アップデートをダウンロードしています',
  'Installing update': 'アップデートをインストールしています',
  'An update has been downloaded and is ready to be installed.':
    'アップデートがダウンロードされ、インストールの準備ができました。',
  'Quit and install update': '終了してアップデートをインストール',
  'Install and restart': 'インストールして再起動',
  'Error checking for updates': 'アップデートの確認中にエラーが発生しました',
  'You have the latest version (last checked {0})':
    '最新バージョンです (最終確認 {0})',
  'The application is currently running in development and will not receive any updates.':
    'アプリは開発モードで実行中のため、アップデートを受信しません。',
  'This operating system is no longer supported. Software updates have been disabled.':
    'この OS はサポートが終了しました。ソフトウェアのアップデートは無効になっています。',
  'This operating system is no longer supported. Software updates have been disabled. {0}':
    'この OS はサポートが終了しました。ソフトウェアのアップデートは無効になっています。{0}',
  'Supported operating systems': '対応 OS',
  'Support details': 'サポート情報',
  'License and open source notices': 'ライセンスとオープンソースに関する表示',
  'Open source licenses and notices': 'オープンソースのライセンスと表示',
  'Terms and conditions': '利用規約',
  'Release notes': 'リリースノート',
  'View all release notes': 'すべてのリリースノートを表示',
  Bugfixes: 'バグ修正',
  Enhancements: '改善',
  'Do not close MS2026 Desktop while the update is in progress. Closing now may break your installation.':
    'アップデート中は MS2026 Desktop を閉じないでください。インストールが壊れる可能性があります。',
  'Quit anyway': 'それでも終了',
  'Installing update…': 'アップデートをインストールしています…',
  'Move MS2026 Desktop to the Applications folder?':
    'MS2026 Desktop を「アプリケーション」フォルダに移動しますか?',
  'Move and restart': '移動して再起動',
  "We've detected that you're not running MS2026 Desktop from the Applications folder of your machine. This could cause problems with the app, including impacting your ability to sign in.":
    'MS2026 Desktop が「アプリケーション」フォルダから実行されていません。サインインできないなど、アプリに問題が起きる可能性があります。',
  'Do you want to move MS2026 Desktop to the Applications folder now? This will also restart the app.':
    'MS2026 Desktop を今すぐ「アプリケーション」フォルダに移動しますか? アプリも再起動します。',
  'This will move MS2026 Desktop to the Applications folder in your machine and restart the app.':
    'MS2026 Desktop を「アプリケーション」フォルダに移動し、アプリを再起動します。',
  'Command line tool installed': 'コマンドラインツールをインストールしました',
  'The command line tool has been installed at {0}.':
    'コマンドラインツールを {0} にインストールしました。',
  'Error installing CLI': 'CLI のインストール中にエラーが発生しました',

  // Repository settings
  Remote: 'リモート',
  'Remote URL': 'リモート URL',
  'Ignored files': '無視するファイル',
  'Fork behavior': 'フォークの動作',
  'For this repository I wish to': 'このリポジトリで行いたいこと:',
  'To contribute to the parent repository': '親リポジトリに貢献する',
  'To contribute to the parent project': '親プロジェクトに貢献する',
  'For my own purposes': '自分の用途で使う',
  'This repository is a fork. How do you plan to use it?':
    'このリポジトリはフォークです。どのように使いますか?',
  'How are you planning to use this fork?':
    'このフォークをどのように使いますか?',
  'Editing {0}. This file specifies intentionally untracked files that Git should ignore. Files already tracked by Git are not affected. {1}':
    '{0} を編集しています。このファイルには、Git が無視する (意図的に追跡しない) ファイルを指定します。既に Git で追跡しているファイルには影響しません。{1}',
  'Learn more about gitignore files': 'gitignore ファイルについての詳細',
  'Learn more about remote repositories.': 'リモートリポジトリについての詳細',
  'Publish your repository to GitHub.':
    'リポジトリを GitHub に公開しましょう。',
  'Pull requests targeting {0} will be shown in the pull request list.':
    '{0} に対するプルリクエストが一覧に表示されます。',
  'Issues will be created in {0}.': 'Issue は {0} に作成されます。',
  '"View on GitHub" will open {0} in the browser.':
    '「GitHub で表示」はブラウザで {0} を開きます。',
  "New branches will be based on {0}'s default branch.":
    '新しいブランチは {0} の既定のブランチをもとに作成されます。',
  'Autocompletion of user and issues will be based on {0}.':
    'ユーザーと Issue の自動補完は {0} をもとに行われます。',

  // Errors and misc dialogs
  'Unable to locate Git': 'Git が見つかりません',
  'Install Git': 'Git をインストール',
  'To help you get Git installed and configured for your operating system, we have some external resources available.':
    'お使いの OS で Git をインストール・設定するための外部リソースを用意しています。',
  'Unable to open external editor': '外部エディターを開けません',
  'Unable to open shell': 'シェルを開けません',
  'Push blocked: secret detected':
    'プッシュがブロックされました: シークレットを検出',
  'Upstream already exists': 'アップストリームは既に存在します',
  'Current: {0}': '現在: {0}',
  'Expected: {0}': '期待値: {0}',
  'Would you like to update the remote to use the expected URL?':
    'リモートを期待される URL に更新しますか?',
  'Update existing Git LFS filters?':
    '既存の Git LFS フィルターを更新しますか?',
  'Update existing filters': '既存のフィルターを更新',
  'Initialize Git LFS': 'Git LFS を初期化',
  'Local changes overwritten': 'ローカルの変更が上書きされます',
  'Ignore and continue': '無視して続行',
  'Hook failed': 'フックが失敗しました',
  "I'll fix it later": '後で修正します',
  'The {0} hook failed. What would you like to do?':
    '{0} フックが失敗しました。どうしますか?',
  'Unknown co-authors': '不明な共同作成者',
  'Do you want to create a new branch instead?':
    '代わりに新しいブランチを作成しますか?',
  'Do you want to fork this repository?': 'このリポジトリをフォークしますか?',
  'Fork this repository': 'このリポジトリをフォーク',
  'Creating your fork': 'フォークを作成しています',
  'Delete tag?': 'タグを削除しますか?',
  'Config lock file exists': '設定のロックファイルが存在します',
  'Failed to update Git configuration file. A lock file already exists at {0}.':
    'Git の設定ファイルを更新できませんでした。{0} に既にロックファイルがあります。',
  'This can happen if another tool is currently modifying the Git configuration or if a Git process has terminated earlier without cleaning up the lock file. Do you want to {0} and try again?':
    'ほかのツールが Git の設定を変更中か、Git のプロセスがロックファイルを残したまま終了した可能性があります。{0}して再試行しますか?',
  'delete the lock file': 'ロックファイルを削除',
  'Thank you': 'ありがとうございます',
  Welcome: 'ようこそ',
  'Exit tutorial': 'チュートリアルを終了',
  'Start tutorial': 'チュートリアルを開始',
  'Are you sure you want to leave the tutorial? This will bring you back to the home screen.':
    'チュートリアルを終了してもよろしいですか? ホーム画面に戻ります。',
  'Install a text editor': 'テキストエディターをインストール',
  'I have an editor': 'エディターを持っています',
  'Create a branch by going into the branch menu in the top bar and clicking':
    '上部バーのブランチメニューからブランチを作成します',
  'Edit a file': 'ファイルを編集',
  'Make a commit': 'コミットする',
  'Push to GitHub': 'GitHub にプッシュ',
  'Open a pull request on GitHub': 'GitHub でプルリクエストを開く',
  "You're done!": '完了です!',
  "You're all set!": '準備ができました!',
  'You’ve learned the basics on how to use MS2026 Desktop. Here are some suggestions for what to do next.':
    'MS2026 Desktop の基本を学びました。次にできることを紹介します。',
  'Use this tutorial to get comfortable with Git, GitHub, and MS2026 Desktop.':
    'このチュートリアルで Git、GitHub、MS2026 Desktop に慣れましょう。',
  '{0} is the version control system.': '{0} はバージョン管理システムです。',
  '{0} is where you store your code and collaborate with others.':
    '{0} はコードを保存し、ほかの人と共同作業する場所です。',
  '{0} helps you work with GitHub locally.':
    '{0} を使うと、ローカルで GitHub の作業ができます。',
  'Press {0} to exit fullscreen': '{0} でフルスクリーンを終了',
  'Press {0} to confirm.': '{0} で確定します。',
  'Use {0} {1} to choose a new location.': '{0} {1} で新しい位置を選びます。',
  'Open your card': 'カードを開く',
  'Throw it away': '捨てる',
  'Copy to': 'コピー先',
  'Fetch the latest changes': '最新の変更をフェッチ',
  'Open in GitHub &Copilot': 'GitHub Copilot で開く',
  'Report issue…': '問題を報告…',

  // More dialogs and settings
  'Additional services': 'その他のサービス',
  'App location': 'アプリの場所',
  Applications: 'アプリケーション',
  Author: '作成者',
  'Beta channel': 'ベータチャンネル',
  'Branch filter': 'ブランチのフィルター',
  Bypass: '回避',
  'Bypass push detection': 'プッシュ時の検出を回避',
  Bypassed: '回避済み',
  "Can't check for updates on Windows 8.1 or older. Next available update only supports Windows 10 and later":
    'Windows 8.1 以前ではアップデートを確認できません。次のアップデートは Windows 10 以降のみに対応しています',
  "Can't check for updates on macOS 12 or older. Next available update only supports macOS 13 and later":
    'macOS 12 以前ではアップデートを確認できません。次のアップデートは macOS 13 以降のみに対応しています',
  'Commit message rule failures': 'コミットメッセージのルール違反',
  Committed: 'コミット済み',
  'Confirm this address appears in your browser. Otherwise, cancel and contact your repository administrator.':
    'このアドレスがブラウザに表示されていることを確認してください。表示されていない場合は、キャンセルしてリポジトリの管理者に連絡してください。',
  Decrease: '減らす',
  Increase: '増やす',
  Default: '既定',
  'Dismiss this message': 'このメッセージを閉じる',
  Editing: '編集中',
  Executables: '実行ファイル',
  'File does not exist on disk': 'ファイルがディスク上に存在しません',
  'File options': 'ファイルのオプション',
  'File resolution options': 'ファイルの解決方法',
  'File size limit exceeded': 'ファイルサイズの上限を超えています',
  'Files that exceed the limit': '上限を超えるファイル',
  'Git is requesting permission to sign in to this server:':
    'Git がこのサーバーへのサインインの許可を求めています:',
  'If this is a GitHub Enterprise trial.': 'GitHub Enterprise の試用版の場合。',
  'If you are unsure of what to do, cancel and contact your system administrator.':
    'どうすればよいかわからない場合は、キャンセルしてシステム管理者に連絡してください。',
  'If your GitHub Enterprise instance is run on an unusual top-level domain.':
    'GitHub Enterprise が一般的でないトップレベルドメインで運用されている場合。',
  'In some cases, this may be expected. For example:':
    '次のような場合は、想定どおりのこともあります:',
  Incoming: '取り込む側',
  Line: '行',
  Lines: '行',
  Hunk: 'ハンク',
  'Looking for the latest features?': '最新の機能をお探しですか?',
  'MS2026 Desktop also distributes these libraries:':
    'MS2026 Desktop は次のライブラリも同梱しています:',
  'No conflicts remaining': '残りのコンフリクトはありません',
  'No files in commit': 'コミットにファイルがありません',
  Override: '上書き',
  Privacy: 'プライバシー',
  Rules: 'ルール',
  'Learn more about commit signing.': 'コミットの署名についての詳細',
  'View all rulesets for this branch.':
    'このブランチのすべてのルールセットを表示',
  'Sign in to your GitHub Enterprise': 'GitHub Enterprise にサインイン',
  Single: '単一',
  Terminal: 'ターミナル',
  'Terminal window': 'ターミナルウインドウ',
  Type: '種類',
  Unavailable: '利用不可',
  'Unsupported format': '対応していない形式',
  Whitespace: '空白',
  "We couldn't find that repository. Check that you are logged in, the network is accessible, and the URL or repository alias are spelled correctly.":
    'リポジトリが見つかりませんでした。サインインしていること、ネットワークにつながること、URL またはリポジトリのエイリアスが正しいことを確認してください。',
  'When a stash exists, access it at the bottom of the Changes tab to the left.':
    'スタッシュがある場合は、左の「変更」タブの下部から開けます。',
  'Would you like to open a browser to grant GitHub Desktop permission to access the repository?':
    'ブラウザを開いて、MS2026 Desktop にリポジトリへのアクセスを許可しますか?',
  'Would you like to open a browser to grant GitHub Desktop permission to update workflow files?':
    'ブラウザを開いて、MS2026 Desktop にワークフローファイルの更新を許可しますか?',
  'Partially checked check list': '一部チェック済みのリスト',
  'Restricted access to move the file(s).':
    'ファイルを移動する権限がありません。',

  // Secret scanning
  'Secret scanning': 'シークレットスキャン',
  Secrets: 'シークレット',
  'Exposing this secret can allow someone to:':
    'このシークレットが漏れると、次のことができてしまいます:',
  "Act on behalf of the secret's owner": 'シークレットの所有者になりすます',
  'Know which resources the secret(s) can access':
    'シークレットでアクセスできるリソースを知る',
  'Verify the identity of the secret(s)': 'シークレットの持ち主を確認する',
  'Push the secret(s) to this repository without being blocked':
    'ブロックされずにシークレットをこのリポジトリにプッシュする',
  'Allow me to expose this secret': 'このシークレットの公開を許可する',
  "It's a false positive": '誤検出です',
  "It's used in tests": 'テストで使っています',
  'The detected string is not a secret':
    '検出された文字列はシークレットではありません',
  'The secret poses no risk. If anyone finds it, they cannot do any damage or gain access to sensitive information.':
    'このシークレットにリスクはありません。誰かに見つかっても、被害や機密情報へのアクセスにはつながりません。',
  'The secret is real, I understand the risk, and I will need to revoke it. This will open a security alert and notify admins of this repository.':
    'このシークレットは本物で、リスクを理解しており、後で無効化します。セキュリティアラートが作成され、このリポジトリの管理者に通知されます。',
  'Show less locations': '場所を少なく表示',
  'Show more locations': '場所をもっと表示',

  // Copilot (more)
  'A Copilot license is available for your account, but "Copilot in GitHub Desktop" is disabled in your Copilot feature settings.':
    'アカウントに Copilot のライセンスはありますが、Copilot の機能設定で「Copilot in GitHub Desktop」が無効になっています。',
  'Open Copilot feature settings': 'Copilot の機能設定を開く',
  'Experience agent-driven development built natively on GitHub.':
    'GitHub 上に構築されたエージェント駆動の開発を体験しましょう。',
  'Responsible use of Copilot in GitHub Desktop':
    'GitHub Desktop での Copilot の責任ある利用',
  'Add a custom provider to use your own API keys with OpenAI-compatible endpoints, Azure, Anthropic, or local providers like Ollama.':
    'カスタムプロバイダーを追加すると、OpenAI 互換のエンドポイント、Azure、Anthropic、Ollama などのローカルプロバイダーで自分の API キーを使えます。',
  'Tell Desktop which models this provider offers. Each one will appear in the model picker for Copilot features.':
    'このプロバイダーが提供するモデルを指定してください。それぞれ Copilot 機能のモデル選択に表示されます。',
  'Base URL must be an https URL, or an http URL pointing at the local machine.':
    'ベース URL は https の URL か、このマシンを指す http の URL にしてください。',
  'Choose the GitHub Copilot application (.app).':
    'GitHub Copilot アプリ (.app) を選択してください。',
  'Choose the GitHub Copilot executable (github.exe).':
    'GitHub Copilot の実行ファイル (github.exe) を選択してください。',
  'Switch to manual': '手動に切り替え',

  // Copilot
  'Copilot settings': 'Copilot の設定',
  'Commit message generation': 'コミットメッセージの生成',
  'Generate commit message with Copilot': 'Copilot でコミットメッセージを生成',
  'Generating commit details': 'コミットの詳細を生成しています',
  'Cancel generating commit details': 'コミットの詳細の生成をキャンセル',
  'Commit message override': 'コミットメッセージの上書き',
  'Overriding commit message with generated message':
    '生成したメッセージでコミットメッセージを上書きします',
  'The commit message you have entered will be overridden by the generated commit message.':
    '入力したコミットメッセージは、生成したコミットメッセージで上書きされます。',
  'Review and edit the generated message carefully before use.':
    '生成されたメッセージは、使う前によく確認・編集してください。',
  'Learn more about generating commit messages.':
    'コミットメッセージの生成についての詳細',
  'Learn more about Copilot in GitHub Desktop.':
    'GitHub Desktop の Copilot についての詳細',
  'Learn more about GitHub Copilot': 'GitHub Copilot についての詳細',
  'Copilot is powered by AI, so mistakes are possible.':
    'Copilot は AI を利用しているため、誤りが含まれる可能性があります。',
  'Copilot features in GitHub Desktop require a GitHub Copilot license.':
    'GitHub Desktop の Copilot 機能には GitHub Copilot のライセンスが必要です。',
  'Sign in to an account with a Copilot license to configure Copilot settings.':
    'Copilot を設定するには、Copilot のライセンスがあるアカウントでサインインしてください。',
  'Configure Copilot in app settings': 'アプリの設定で Copilot を設定',
  'Checking Copilot access': 'Copilot へのアクセスを確認しています',
  'View Copilot plans': 'Copilot のプランを表示',
  'Tailor how Copilot behaves by using {0}.':
    '{0}を使って Copilot の動作を調整できます。',
  'custom instructions': 'カスタム指示',
  'Copilot instructions': 'Copilot への指示',
  'Tip: You can use {0} to customize how commit messages are generated.':
    'ヒント: {0}を使うと、コミットメッセージの生成方法をカスタマイズできます。',
  'Model changes apply to future conflict resolutions.':
    'モデルの変更は、今後のコンフリクトの解決に適用されます。',
  'Use Copilot to suggest resolutions for conflicted files':
    'Copilot を使ってコンフリクトの解決方法を提案する',
  'Always use Copilot when conflicts are detected':
    'コンフリクトを検出したら常に Copilot を使う',
  'Always use Copilot for conflict resolution?':
    'コンフリクトの解決に常に Copilot を使いますか?',
  'Resolve with Copilot': 'Copilot で解決',
  "Use Copilot's suggestion": 'Copilot の提案を使用',
  "Using Copilot's merged resolution": 'Copilot がマージした解決内容を使用',
  'Skipped by Copilot': 'Copilot がスキップ',
  'Some files were skipped by Copilot. Those need to be resolved manually.':
    'Copilot がスキップしたファイルがあります。手動で解決してください。',
  'No Copilot resolution available': 'Copilot の解決案はありません',
  'No Copilot resolution available for this file.':
    'このファイルには Copilot の解決案がありません。',
  'Review the suggested resolutions carefully before applying them to your files.':
    '提案された解決内容は、ファイルに適用する前によく確認してください。',
  'Copilot conflict resolution summary':
    'Copilot によるコンフリクトの解決の概要',
  'Resolution summary': '解決の概要',
  'Analyzing conflicts': 'コンフリクトを解析しています',
  'Gathering context': 'コンテキストを収集しています',
  'Looking for related context': '関連するコンテキストを探しています',
  'Considering both sides of each conflict':
    '各コンフリクトの両側を検討しています',
  'Cross-referencing related files': '関連ファイルを照合しています',
  'Reading recent commit history': '最近のコミット履歴を読み込んでいます',
  'Reviewing the changes from each side': '両側の変更を確認しています',
  'Choose GitHub Copilot': 'GitHub Copilot を選択',
  Models: 'モデル',
  'Filter models': 'モデルを絞り込む',
  'Loading available models': '利用できるモデルを読み込んでいます',
  'No models available': '利用できるモデルはありません',
  'No Copilot models available.': '利用できる Copilot のモデルはありません。',
  'No models found.': 'モデルが見つかりません。',
  'Show Copilot model credit costs': 'Copilot モデルのクレジット消費量を表示',
  'Show credit costs': 'クレジット消費量を表示',
  'Loading Copilot usage': 'Copilot の使用量を読み込んでいます',
  'No Copilot usage data available yet.':
    'Copilot の使用量データはまだありません。',
  'Premium requests': 'プレミアムリクエスト',
  'Chat messages': 'チャットメッセージ',
  'Code completions': 'コード補完',
  'AI credits': 'AI クレジット',
  'Session limits': 'セッションの上限',
  'Weekly limits': '週ごとの上限',
  'No usage limit': '使用量の上限なし',
  '(resets monthly)': '(毎月リセット)',
  'Custom providers': 'カスタムプロバイダー',
  'Configure custom providers': 'カスタムプロバイダーを設定',
  'Add custom provider': 'カスタムプロバイダーを追加',
  'Edit custom provider': 'カスタムプロバイダーを編集',
  'Remove custom provider': 'カスタムプロバイダーを削除',
  'Add provider': 'プロバイダーを追加',
  Provider: 'プロバイダー',
  'My provider': 'マイプロバイダー',
  'Add model': 'モデルを追加',
  'Edit model': 'モデルを編集',
  'Untitled model': '名前のないモデル',
  'Model identifier': 'モデル ID',
  'API format': 'API の形式',
  'API key': 'API キー',
  'Bearer token': 'Bearer トークン',
  'Base URL': 'ベース URL',
  'Azure API version': 'Azure API のバージョン',
  'Request timeout (seconds)': 'リクエストのタイムアウト (秒)',
  'Request timeout must be a positive number of seconds.':
    'リクエストのタイムアウトには正の秒数を指定してください。',
  Reasoning: '推論',
  'Reasoning effort': '推論の強度',
  "Default (provider's choice)": '既定 (プロバイダーが選択)',
  'Chat completions (default)': 'Chat Completions (既定)',
  Context: 'コンテキスト',
  Input: '入力',
  Output: '出力',
  'Cached input': 'キャッシュされた入力',
  'Please enter a name.': '名前を入力してください。',
  'Please enter a base URL.': 'ベース URL を入力してください。',
  'Please enter an API key.': 'API キーを入力してください。',
  'Please enter a bearer token.': 'Bearer トークンを入力してください。',
  'Please enter a model identifier.': 'モデル ID を入力してください。',
  'Please add at least one model.': 'モデルを 1 つ以上追加してください。',
  'No models yet. Add at least one to use this provider.':
    'モデルがまだありません。このプロバイダーを使うには 1 つ以上追加してください。',
  'Its API key will also be removed from your keychain.':
    'API キーもキーチェーンから削除されます。',
  'Its bearer token will also be removed from your keychain.':
    'Bearer トークンもキーチェーンから削除されます。',
  'Any models you have configured for it will no longer be available.':
    '設定したモデルは使えなくなります。',
  'No credentials will be sent with requests to this provider.':
    'このプロバイダーへのリクエストに認証情報は送信されません。',
  'The friendly name shown in the Copilot model picker.':
    'Copilot のモデル選択に表示される名前です。',

  // Generic status
  'Changes can be restored by retrieving them from the {0} .':
    '変更は{0}から取り出して復元できます。',
  'Checking out': 'チェックアウトしています',
  'Optimizing repository': 'リポジトリを最適化しています',
  Unknown: '不明',
  'Input cleared': '入力をクリアしました',
  'Copied!': 'コピーしました',
  'Repository path': 'リポジトリのパス',
  Expanded: '展開済み',
  Collapsed: '折りたたみ済み',
  Current: '現在',
  'Current:': '現在:',
  'Expected:': '期待値:',
  'Date:': '日付:',
  'Last modified:': '最終更新:',
}

const patterns: ReadonlyArray<TranslationPattern> = [
  // Toolbar
  [/^Fetch (\S+)$/i, '$1 をフェッチ'],
  [/^Fetching (\S+)$/i, '$1 をフェッチしています'],
  [/^Push (\S+)$/i, '$1 にプッシュ'],
  [/^Pushing to (\S+)$/i, '$1 にプッシュしています'],
  [/^Pull (\S+)$/i, '$1 からプル'],
  [/^Pulling (\S+)$/i, '$1 からプルしています'],
  [/^Pull (\S+) with rebase$/i, '$1 からプル (リベース)'],
  [/^Force push (\S+)$/i, '$1 に強制プッシュ'],
  [/^Fetch the latest changes from (\S+)$/i, '$1 から最新の変更をフェッチ'],
  [/^(\S+) complete$/i, (t, op) => `${t(op)}が完了しました`],
  [
    /^Pull ([\d,]+) commits? from the (\S+) remote$/i,
    '$2 リモートから $1 個のコミットをプル',
  ],
  [
    /^Push (.+) to the (\S+) remote$/i,
    (t, items, remote) =>
      `${items
        .replace('commits', 'コミット')
        .replace('tags', 'タグ')
        .replace(' and ', 'と')}を ${remote} リモートにプッシュ`,
  ],
  [
    /^Overwrite any changes on (\S+) with your local changes(.*)$/i,
    '$1 の変更をローカルの変更で上書きします$2',
  ],
  [/^Last fetched (.+)$/i, '最終フェッチ $1'],

  // Home screen suggestions
  [
    /^The current branch \(\{0\}\) hasn't been published to the remote yet\. By publishing it (?:to (.+?) )?you can share it, (open a pull request, )?and collaborate with others\.$/i,
    (t, host, pr) =>
      `現在のブランチ ({0}) はまだリモートに公開されていません。${
        host ? `${host} に` : ''
      }公開すると、共有${
        pr ? '、プルリクエストの作成' : ''
      }や共同作業ができます。`,
  ],
  [
    /^The current branch \(\{0\}\) has (?:a commit|commits) on (.+?) that (?:does|do) not exist on your machine\.$/i,
    '現在のブランチ ({0}) には、$1 にあってこのマシンにないコミットがあります。',
  ],
  [
    /^The current branch \(\{0\}\) is already published to (.+?)\. Create a pull request to propose and collaborate on your changes\.$/i,
    '現在のブランチ ({0}) は $1 に公開済みです。プルリクエストを作成して、変更を提案し共同作業しましょう。',
  ],
  [
    /^The current branch \(\{0\}\) is already published to (.+?)\. Preview the changes this pull request will have before proposing your changes\.$/i,
    '現在のブランチ ({0}) は $1 に公開済みです。提案する前に、プルリクエストに含まれる変更をプレビューできます。',
  ],
  [
    /^You have (.+) waiting to be pushed to (.+)\.$/i,
    (t, items, remote) =>
      `${remote} にプッシュしていない${items
        .replace(/(\d[\d,]*) local commits?/, 'ローカルコミット $1 個')
        .replace(/(\d[\d,]*) tags?/, 'タグ $1 個')
        .replace(' and ', 'と')}があります。`,
  ],

  // Changes
  [/^Commit to (.+)$/i, '$1 にコミット'],
  [/^Committing to (.+)$/i, '$1 にコミットしています'],
  [/^Commit ([\d,]+) files? to \{0\}$/i, '{0} に $1 個のファイルをコミット'],
  [
    /^Committing ([\d,]+) files? to \{0\}$/i,
    '{0} に $1 個のファイルをコミットしています',
  ],
  [/^Amend ([\d,]+ )?files? to \{0\}$/i, '{0} を修正'],
  [
    /^([\d,]+) of ([\d,]+) changed files?$/i,
    '$2 個中 $1 個の変更されたファイル',
  ],
  [/^([\d,]+) changed files?$/i, '$1 個の変更されたファイル'],
  [/^([\d,]+) files? changed$/i, '$1 個のファイルを変更'],
  [/^([\d,]+) files selected$/i, '$1 個のファイルを選択中'],
  [/^Included in commit \(([\d,]+)\)$/i, 'コミットに含める ($1)'],
  [/^Excluded from commit \(([\d,]+)\)$/i, 'コミットから除外 ($1)'],
  [/^New files \(([\d,]+)\)$/i, '新しいファイル ($1)'],
  [/^Modified files \(([\d,]+)\)$/i, '変更されたファイル ($1)'],
  [/^Deleted files \(([\d,]+)\)$/i, '削除されたファイル ($1)'],
  [
    /^Filter options \(([\d,]+) applied\)$/i,
    'フィルターのオプション ($1 個適用中)',
  ],
  [
    /^Adjust the filters to see all ([\d,]+) changes$/i,
    'フィルターを調整して $1 個の変更をすべて表示',
  ],
  [
    /^Sorry, I can't find any changed files matching the following filters: (.+)$/i,
    '次のフィルターに一致する変更されたファイルは見つかりません: $1',
  ],
  [/^Discard ([\d,]+) selected changes$/i, '選択した $1 個の変更を破棄'],
  [
    /^Ignore ([\d,]+) selected files \(add to \.gitignore\)$/i,
    '選択した $1 個のファイルを無視 (.gitignore に追加)',
  ],
  [
    /^Ignore all (\S+) files \(add to \.gitignore\)$/i,
    'すべての $1 ファイルを無視 (.gitignore に追加)',
  ],
  [
    /^Are you sure you want to discard all ([\d,]+) changed files\?$/i,
    '変更された $1 個のファイルをすべて破棄してもよろしいですか?',
  ],
  [
    /^You have ([\d,]+) changes? in progress that you have not yet committed\.$/i,
    'まだコミットしていない変更が $1 個あります。',
  ],
  [
    /^Discard (added|removed) lines?$/i,
    (t, kind) => (kind === 'added' ? '追加した行を破棄' : '削除した行を破棄'),
  ],
  [
    /^Discard (added|removed) lines? from (.+)$/i,
    (t, kind, file) =>
      `${file} の${kind === 'added' ? '追加した' : '削除した'}行を破棄`,
  ],
  [/^Leave my changes on (.+)$/i, '変更を $1 に残す'],
  [/^Bring my changes to (.+)$/i, '変更を $1 に持っていく'],
  [
    /^Choose a new alias for the repository "(.+)"\.$/i,
    'リポジトリ「$1」の新しいエイリアスを選んでください。',
  ],
  [/^([\d,]+) commits? ahead of$/i, '$1 個のコミットが先行:'],
  [/^([\d,]+) commits? behind$/i, '$1 個のコミットが遅れ:'],
  [/^([\d,]+) commits?$/i, '$1 個のコミット'],
  [/^([\d,]+) local commits?$/i, '$1 個のローカルコミット'],
  [/^([\d,]+) tags?$/i, '$1 個のタグ'],
  [/^([\d,]+) added lines$/i, '$1 行追加'],
  [/^([\d,]+) removed lines$/i, '$1 行削除'],
  [/^([\d,]+) people$/i, '$1 人'],
  [/^([\d,]+) conflicted files?$/i, '$1 個のコンフリクトのあるファイル'],
  [/^([\d,]+) unreachable commits?$/i, '到達できない $1 個のコミット'],
  [/^([\d,]+) pull requests? found$/i, '$1 個のプルリクエストが見つかりました'],
  [/^Pull requests in (.+)$/i, '$1 のプルリクエスト'],
  [/^Lines (\d+) to (\d+) (.*)$/i, '$1 行目から $2 行目 $3'],

  // History and operations
  [/^Committed (.+)$/i, '$1にコミット'],
  [/^Cherry-pick ([\d,]+) commits?$/i, '$1 個のコミットをチェリーピック'],
  [
    /^Cherry-pick ([\d,]+) commits? to a branch$/i,
    '$1 個のコミットをブランチにチェリーピック',
  ],
  [/^Reorder ([\d,]+) commits$/i, '$1 個のコミットを並べ替え'],
  [/^Squash ([\d,]+) commits$/i, '$1 個のコミットをスカッシュ'],
  [
    /^Successfully squashed ([\d,]+) commits?\.$/i,
    '$1 個のコミットをスカッシュしました。',
  ],
  [
    /^Successfully reordered ([\d,]+) commits?\.$/i,
    '$1 個のコミットを並べ替えました。',
  ],
  [
    /^Squash of ([\d,]+) commits? undone\.$/i,
    '$1 個のコミットのスカッシュを元に戻しました。',
  ],
  [
    /^Reorder of ([\d,]+) commits? undone\.$/i,
    '$1 個のコミットの並べ替えを元に戻しました。',
  ],
  [
    /^Successfully copied ([\d,]+) commits? to \{0\}\.$/i,
    '$1 個のコミットを {0} にコピーしました。',
  ],
  [/^Successfully merged \{0\} into \{1\}$/i, '{0} を {1} にマージしました'],
  [/^Successfully rebased \{0\} onto \{1\}$/i, '{0} を {1} にリベースしました'],
  [
    /^Cherry-pick undone\. Successfully removed the ([\d,]+) copied commits? from \{0\}\.$/i,
    'チェリーピックを元に戻しました。{0} からコピーした $1 個のコミットを削除しました。',
  ],
  [/^Commit (\d+) of (\d+)$/i, 'コミット $1 / $2'],
  [/^Abort (\S+)$/i, (t, op) => `${t(op)}を中止`],
  [/^Continue (\S+)$/i, (t, op) => `${t(op)}を続行`],
  [/^Begin (\S+)$/i, (t, op) => `${t(op)}を開始`],
  [/^Confirm abort (\S+)$/i, (t, op) => `${t(op)}の中止を確認`],
  [/^(\S+) in progress$/i, (t, op) => `${t(op)}中`],
  [
    /^(\S+) will require force push$/i,
    (t, op) => `${t(op)}には強制プッシュが必要です`,
  ],
  [
    /^Are you sure you want to abort this (\S+)\?$/i,
    (t, op) => `この${t(op)}を中止してもよろしいですか?`,
  ],
  [
    /^Are you sure you want to (\S+)\?$/i,
    (t, op) => `${t(op)}してもよろしいですか?`,
  ],
  [
    /^At the end of the (\S+) flow, MS2026 Desktop will enable you to force push the branch to update the upstream branch\. Force pushing will alter the history on the remote and potentially cause problems for others collaborating on this branch\.$/i,
    (t, op) =>
      `${t(
        op
      )}が終わると、MS2026 Desktop からブランチを強制プッシュしてアップストリームのブランチを更新できます。強制プッシュするとリモートの履歴が変わり、このブランチで共同作業している人に問題が起きる可能性があります。`,
  ],
  [
    /^Resolving conflicts for (\S+)$/i,
    (t, op) => `${t(op)}のコンフリクトを解決しています`,
  ],
  [
    /^Resolve conflicts before (\S+)$/i,
    (t, op) => `${t(op)}の前にコンフリクトを解決`,
  ],
  [
    /^Resolve conflicts to continue (\S+)\.$/i,
    (t, op) => `コンフリクトを解決して${t(op)}を続行してください。`,
  ],
  [/^Rebasing (.+)$/i, '$1 をリベースしています'],
  [/^Checking out (.+)$/i, '$1 をチェックアウトしています'],
  [
    /^Checking for ability to (\S+) automatically$/i,
    (t, op) => `自動で${t(op)}できるか確認しています`,
  ],
  [
    /^([\d,]+) conflicted files? (have|has) been resolved\.$/i,
    '$1 個のコンフリクトのあるファイルが解決されました。',
  ],
  [/^Using changes from (.+)$/i, '$1 の変更を使用'],
  [/^Use current file from (.+)$/i, '$1 の現在のファイルを使用'],
  [/^Use incoming file from (.+)$/i, '$1 から取り込むファイルを使用'],
  [/^File does not exist on (.+)\.$/i, '$1 にはファイルがありません。'],
  [/^Deleting file \(deleted on (.+)\)$/i, 'ファイルを削除 ($1 で削除済み)'],
  [
    /^This will merge \{0\} from \{1\} into \{2\}$/i,
    '{0}を {1} から {2} にマージします',
  ],
  [
    /^This will update \{0\} by applying its \{1\} on top of \{2\}$/i,
    '{0} の{1}を {2} の上に適用して更新します',
  ],
  [
    /^This will fast-forward \{0\} by \{1\} to match \{2\}$/i,
    '{0} を{1}進めて {2} に合わせます',
  ],
  [
    /^There will be \{0\} when merging \{1\} into \{2\}$/i,
    '{0}が発生します ({1} を {2} にマージした場合)',
  ],
  [/^\s*([\d,]+) commits?$/i, '$1 個のコミット'],
  [/^\s*([\d,]+) conflicted files?$/i, '$1 個のコンフリクトのあるファイル'],
  [
    /^(.*)Merge into \{0\}$/i,
    (t, prefix) => `${prefix ? t(prefix.trim()) + ' ' : ''}{0} にマージ`,
  ],
  [/^(.+) to \{0\}$/i, (t, verb) => `{0} に${t(verb)}`],

  // Branches and repositories
  [/^Rename (\S+(?: \S+){0,2})$/i, '$1 の名前を変更'],
  [/^Delete tag (.+)$/i, 'タグ $1 を削除'],
  [/^Update from (\S+(?: \S+){0,2})$/i, '$1 から更新'],
  [/^Current branch is (.+)$/i, '現在のブランチは $1 です'],
  [/^Current worktree is (.+)$/i, '現在のワークツリーは $1 です'],
  [/^Loading repositories from (.+)$/i, '$1 からリポジトリを読み込んでいます'],
  [/^Cloning (\S+(?: \S+){0,2})$/i, '$1 をクローンしています'],
  [/^(.+) is potentially unsafe$/i, '$1 は安全でない可能性があります'],
  [/^No results for "(.+)"$/i, '「$1」の結果はありません'],
  [/^Result (\d+) of (\d+) for "(.+)"$/i, '「$3」の結果 $1 / $2'],
  [/^No matches found for '(.+)'$/i, '「$1」に一致するものはありません'],
  [/^Will be created as (.+)$/i, '$1 として作成されます'],
  [
    /^Warning: Will be created as (.+)\. Spaces and invalid characters have been replaced by hyphens\.$/i,
    '警告: $1 として作成されます。スペースと使用できない文字はハイフンに置き換えられました。',
  ],
  [/^Will be created as \{0\}\. \{1\}$/i, '{0} として作成されます。{1}'],
  [
    /^The tag name cannot be longer than (\d+) characters$/i,
    'タグ名は $1 文字以内にしてください',
  ],
  [
    /^Primary remote repository \((.+)\) URL$/i,
    'プライマリのリモートリポジトリ ($1) の URL',
  ],
  [
    /^Are you sure you want to remove the repository "(.+)" from MS2026 Desktop\?$/i,
    'リポジトリ「$1」を MS2026 Desktop から削除してもよろしいですか?',
  ],
  [/^Linked (\S+)s$/i, 'リンクされたワークツリー'],
  [/^Main (\S+)$/i, 'メインのワークツリー'],

  // Host specific
  [/^View on (\S+(?: \S+){0,2})$/i, '$1 で表示'],
  [/^View branch on (\S+(?: \S+){0,2})$/i, '$1 でブランチを表示'],
  [/^Compare on (\S+(?: \S+){0,2})$/i, '$1 で比較'],
  [/^Create issue on (\S+(?: \S+){0,2})$/i, '$1 で Issue を作成'],
  [
    /^(Create|View) pull request on (.+)\.$/i,
    (t, verb, host) =>
      `${host} でプルリクエストを${
        verb.toLowerCase() === 'create' ? '作成' : '表示'
      }します。`,
  ],
  [
    /^(View|Create) Pull Request$/i,
    (t, verb) =>
      `プルリクエストを${verb.toLowerCase() === 'create' ? '作成' : '表示'}`,
  ],
  [
    /^Open the repository page on (.+) in your browser$/i,
    '$1 のリポジトリページをブラウザで開く',
  ],
  [
    /^View the files of your repository in (.+)$/i,
    'リポジトリのファイルを $1 で表示',
  ],
  [/^Open in (\S+(?: \S+){0,2})$/i, '$1 で開く'],
  [/^Open the (\S+(?: \S+){0,2}) website$/i, '$1 の Web サイトを開く'],
  [/^Install (.+)\?$/i, '$1 をインストールしますか?'],
  [/^Download (\S+(?: \S+){0,2})$/i, '$1 をダウンロード'],
  [/^About (\S+(?: \S+){0,2})$/i, '$1 について'],
  [/^Version (\S+(?: \S+){0,2})$/i, 'バージョン $1'],
  [/^Build (\S+(?: \S+){0,2})$/i, 'ビルド $1'],
  [/^Analyzing (\S+(?: \S+){0,2})$/i, '$1 を解析しています'],
  [/^Reading (\S+(?: \S+){0,2})$/i, '$1 を読み込んでいます'],
  [/^Searching for @(.+)$/i, '@$1 を検索しています'],
  [/^Avatar for (.+)$/i, '$1 のアバター'],
  [/^(\S+) hook failed$/i, '$1 フックが失敗しました'],
  [/^(\S+) hook running$/i, '$1 フックを実行しています'],
  [/^(\S+) hook finished$/i, '$1 フックが完了しました'],
  [/^Re-run (\S+(?: \S+){0,2})$/i, '$1 を再実行'],
  [/^Checks: (.+)$/i, 'チェック: $1'],
  [/^Enter password for '(.+)':$/i, "'$1' のパスワードを入力してください:"],
  [
    /^Enter passphrase for key '(.+)':$/i,
    "キー '$1' のパスフレーズを入力してください:",
  ],
  [
    /^Use my GitHub(.*) account name and email address$/i,
    'GitHub$1 アカウントの名前とメールアドレスを使用',
  ],
  [
    /^You have the latest version \(last checked (.+)\)$/i,
    '最新バージョンです (最終確認 $1)',
  ],

  // Copilot
  [/^(\d+)% quota used$/i, '使用量 $1%'],
  [/^Commit message generation: (.+)$/i, 'コミットメッセージの生成: $1'],
  [/^Conflict resolution: (.+)$/i, 'コンフリクトの解決: $1'],
  [/^(.+) \/ (.+) AI credits used$/i, 'AI クレジット $1 / $2 を使用'],
  [/^Use of credits: (.+)$/i, 'クレジットの消費: $1'],
  [/^Reasoning: (.+)$/i, '推論: $1'],
  [/^(\d+) models$/i, '$1 個のモデル'],
  [/^(\d+) levels$/i, '$1 段階'],
  [/^Edit (\S+(?: \S+){0,2})$/i, '$1 を編集'],
  [/^Remove (\S+(?: \S+){0,2})$/i, '$1 を削除'],

  // The hints on the home screen, e.g. "Repository menu or Ctrl+Shift+F"
  [
    /^(.+) (menu) or (\{0\}.*)$/i,
    (t, menu, _, shortcut) => `${t(menu)} メニュー、または ${shortcut}`,
  ],
]

export const japanese: ITranslations = { phrases, patterns }
