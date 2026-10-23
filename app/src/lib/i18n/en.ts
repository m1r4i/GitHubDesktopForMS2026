import { ITranslations, TranslationPattern } from './translate'

/**
 * English translations of the parts of the user interface which were written
 * in Japanese for MS2026 Desktop (the team bar, home screen, pull requests,
 * updates, ...). See ./translate.ts.
 */
const phrases: Record<string, string> = {
  // Team bar
  チームリンク: 'Team links',
  ターミナル: 'Terminal',
  'ターミナルを開く / 閉じる (Ctrl+`)': 'Open or close the terminal (Ctrl+`)',
  'ターミナルを隠す (Ctrl+`)': 'Hide the terminal (Ctrl+`)',
  ターミナルを隠す: 'Hide the terminal',
  ターミナルの高さを変更: 'Resize the terminal',
  新しいセッション: 'New session',
  選択中のリポジトリで新しいセッションを開始:
    'Start a new session in the selected repository',
  アップデート: 'Update',
  アップデートに失敗しました: 'Update failed',
  '再起動しています…': 'Restarting…',

  // Team links
  ドライブ: 'Drive',
  ビルド: 'Builds',
  カレンダー: 'Calendar',
  リポジトリ: 'Repository',
  仕様書: 'Specs',
  ドキュメント: 'Docs',
  チームの共有ドライブを開く: "Open the team's shared drive",
  ビルド成果物のフォルダを開く: 'Open the build artifacts folder',
  チームのカレンダーを開く: "Open the team's calendar",
  'Gitea のリポジトリを開く': 'Open the repositories on Gitea',
  仕様書のフォルダを開く: 'Open the specs folder',
  チームのドキュメントを開く: "Open the team's docs",
  'チームの Discord を開く': "Open the team's Discord",
  フォルダ: 'Folder',
  本: 'Book',
  ノート: 'Notes',
  チャット: 'Chat',
  リンク: 'Links',
  メンバー: 'Members',
  タスク: 'Tasks',
  コード: 'Code',
  バグ: 'Bugs',
  リリース: 'Releases',
  サーバー: 'Server',
  お知らせ: 'News',
  仕事: 'Work',
  ホーム: 'Home',

  // Home greetings, see teamGreetings
  おはようございます: 'Good morning',
  'おはようございます。今日も一日よろしくお願いします':
    "Good morning. Let's have a good day",
  まずはフェッチから始めましょう: "Let's start with a fetch",
  コーヒーの準備はできましたか: 'Got your coffee ready?',
  '新しい一日、新しいブランチ': 'A new day, a new branch',
  朝の静かなうちに進めましょう: 'Get ahead while the morning is quiet',
  お昼の時間です: "It's lunchtime",
  お昼ごはんはしっかりと: 'Have a proper lunch',
  ひと休みしてから続きをどうぞ: 'Take a break, then carry on',
  午前の作業はコミットしましたか: "Have you committed this morning's work?",
  午後に向けてひと息つきましょう: 'Catch your breath before the afternoon',
  今日もいいコミットを: 'Make some good commits today',
  小さなコミットを重ねていきましょう: 'Small commits add up',
  プルリクエストのレビューもお忘れなく: "Don't forget to review pull requests",
  ここからもうひと頑張り: 'One more push from here',
  '集中できていますか。水分補給もどうぞ':
    'Staying focused? Remember to drink some water',
  コンフリクトは早めに解決しましょう: 'Resolve conflicts early',
  おつかれさまです: 'Nice work today',
  今日の作業はプッシュしましたか: "Have you pushed today's work?",
  今日もおつかれさまでした: 'Thanks for your work today',
  帰る前にコミットを忘れずに: "Don't forget to commit before you leave",
  いいところで区切りをつけましょう: 'Find a good place to stop',
  夜更かしはほどほどに: "Don't stay up too late",
  遅くまでおつかれさまです: 'Thanks for working late',
  続きは明日の自分に任せるのもありです:
    "It's fine to leave the rest to tomorrow's you",
  夜のコミットは見直してからプッシュを:
    'Look over late night commits before pushing them',
  そろそろ休みませんか: 'Time for a rest?',
  あけましておめでとうございます: 'Happy New Year',
  今年も一年おつかれさまでした: 'Thanks for all your work this year',
  メリークリスマス: 'Merry Christmas',
  休日の夜更かしはほどほどに: "Don't stay up too late on your day off",
  休日もおつかれさまです: 'Thanks for working on your day off',
  今週もよろしくお願いします: "Let's have a good week",
  今週もおつかれさまでした: 'Thanks for your work this week',
  '未コミットの変更はありません。次にできることはこちらです。':
    "You have no uncommitted changes. Here's what you can do next.",
  'レビュー内容の確認、マージ、クローズをアプリ内で行えます。':
    'Review, merge or close it without leaving the app.',

  // Pull requests
  マージコミットを作成: 'Create a merge commit',
  スカッシュしてマージ: 'Squash and merge',
  リベースしてマージ: 'Rebase and merge',
  オープン: 'Open',
  下書き: 'Draft',
  マージ済み: 'Merged',
  クローズ: 'Close',
  マージ: 'Merge',
  閉じる: 'Close',
  マージ方法: 'Merge method',
  'コンフリクトはありません。マージできます。':
    'No conflicts. This pull request can be merged.',
  'コンフリクトがあるためマージできません。':
    "This pull request has conflicts and can't be merged.",
  'マージできるか確認中です。': 'Checking whether it can be merged.',
  '読み込んでいます…': 'Loading…',
  '説明はありません。': 'No description provided.',
  ブラウザで開く: 'Open in browser',
  ブラウザで作成: 'Create in browser',
  'このリポジトリのアカウントが見つかりません。':
    'No account was found for this repository.',
  プルリクエストを作成: 'Create pull request',
  タイトル: 'Title',
  説明: 'Description',
  変更内容やレビューしてほしい点など:
    'What changed, and what reviewers should look at',
  'マージ後にブランチ {0} を削除する': 'Delete branch {0} after merging',
  クローズ済み: 'Closed',

  // Reviewers
  レビュワー: 'Reviewers',
  レビュー待ち: 'Awaiting review',
  レビュー中: 'Reviewing',
  承認済み: 'Approved',
  変更要求あり: 'Changes requested',
  コメント済み: 'Commented',
  承認: 'Approve',
  変更を要求: 'Request changes',
  コメント: 'Comment',
  却下: 'Dismissed',
  レビュワーから外す: 'Remove reviewer',
  'レビュワーを追加…': 'Add reviewer…',
  レビュワーを追加: 'Add reviewer',
  追加できるユーザーはいません: 'No one else can be added',
  'レビュワーはいません。': 'No reviewers.',

  // All pull requests
  すべて: 'All',
  'タイトル、番号、作成者で絞り込む': 'Filter by title, number or author',
  プルリクエストを絞り込む: 'Filter pull requests',
  再読み込み: 'Reload',
  '更新 {0}': 'Updated {0}',
  さらに読み込む: 'Load more',
  '一致するプルリクエストはありません。': 'No matching pull requests.',
  'プルリクエストはありません。': 'No pull requests.',
  'オープンのプルリクエストはありません。': 'No open pull requests.',
  'クローズ済みのプルリクエストはありません。': 'No closed pull requests.',
  リポジトリのプルリクエスト: 'Repository pull requests',
  対象: 'Show',
  すべての人: 'Everyone',
  自分が作成: 'Created by me',
  自分へのレビュー依頼: 'Review requests for me',
  'あなたへのレビュー依頼はありません。': 'No review requests for you.',
  '自分が作成したプルリクエストはありません。':
    "You haven't created any pull requests.",
  レビュー依頼: 'Reviews',
  あなたのレビューを待っているプルリクエスト:
    'Pull requests waiting for your review',

  // Conversation, assignees and labels
  会話: 'Conversation',
  承認しました: 'approved',
  変更を要求しました: 'requested changes',
  レビューしました: 'reviewed',
  レビューが却下されました: 'review dismissed',
  'コメントはまだありません。': 'No comments yet.',
  コメントを書く: 'Write a comment',
  変更を要求するにはコメントを書いてください:
    'Write a comment to request changes',
  担当者: 'Assignees',
  ラベル: 'Labels',
  担当者を追加: 'Add assignee',
  ラベルを追加: 'Add label',
  '担当者を追加…': 'Add assignee…',
  'ラベルを追加…': 'Add label…',
  '担当者はいません。': 'No assignees.',
  'ラベルはありません。': 'No labels.',
  追加できるものはありません: 'Nothing to add',
  外す: 'Remove',
  'ブランチに関係なく、すべてのプルリクエストを確認してレビュワーの設定やマージができます。':
    'See every pull request regardless of branch, set reviewers and merge.',
  'このリポジトリはホスティングサービスに接続されていません。':
    "This repository isn't connected to a hosting service.",
  'このリポジトリのアカウントが見つかりません。設定 > Accounts から追加してください。':
    'No account was found for this repository. Add one under Settings > Accounts.',
  'ブランチがチェックアウトされていません。': 'No branch is checked out.',
  'このブランチはまだプッシュされていません。先にプッシュしてください。':
    "This branch hasn't been pushed yet. Push it first.",

  // Updates
  'アップデートを確認しています…': 'Checking for updates…',
  '最新バージョンです。': 'You have the latest version.',
  'インストールして再起動しています…': 'Installing and restarting…',
  '新しいバージョンはチームのリリースから自動で確認されます。':
    "New versions are found automatically in the team's releases.",
  アップデートして再起動: 'Update and restart',
  アップデートを確認: 'Check for updates',
  'リポジトリが非公開の場合はアカウントを追加してください。':
    'If the repository is private, add an account.',
  'アプリの場所を特定できませんでした。':
    "Couldn't find where the app is installed.",
  'ダウンロードしたファイルにアプリが含まれていません。':
    "The download doesn't contain the app.",
  'この OS では自動アップデートに対応していません。':
    "Automatic updates aren't supported on this OS.",

  // Settings: links
  アイコンを変更: 'Change icon',
  名前: 'Name',
  上に移動: 'Move up',
  下に移動: 'Move down',
  削除: 'Remove',
  'http:// または https:// で始まる URL を入力してください。':
    'Enter a URL starting with http:// or https://.',
  '画面下のバーに表示するリンクを編集します。アイコンは一覧から選べます。':
    'Edit the links shown in the bar at the bottom of the window. Pick an icon from the list.',
  'リンクはありません。': 'No links.',
  リンクを追加: 'Add link',
  チームの既定に戻す: "Restore the team's defaults",

  // Weather, see lib/weather
  快晴: 'Clear',
  晴れ: 'Mostly clear',
  晴れ時々曇り: 'Partly cloudy',
  曇り: 'Cloudy',
  霧: 'Fog',
  着氷性の霧: 'Freezing fog',
  弱い霧雨: 'Light drizzle',
  霧雨: 'Drizzle',
  強い霧雨: 'Heavy drizzle',
  着氷性の霧雨: 'Freezing drizzle',
  強い着氷性の霧雨: 'Heavy freezing drizzle',
  小雨: 'Light rain',
  雨: 'Rain',
  大雨: 'Heavy rain',
  着氷性の雨: 'Freezing rain',
  強い着氷性の雨: 'Heavy freezing rain',
  小雪: 'Light snow',
  雪: 'Snow',
  大雪: 'Heavy snow',
  霧雪: 'Snow grains',
  にわか雨: 'Showers',
  激しいにわか雨: 'Heavy showers',
  にわか雪: 'Snow showers',
  激しいにわか雪: 'Heavy snow showers',
  雷雨: 'Thunderstorm',
  ひょうを伴う雷雨: 'Thunderstorm with hail',
  激しいひょうを伴う雷雨: 'Thunderstorm with heavy hail',
  不明: 'Unknown',
  天気: 'Weather',
  湿度: 'Humidity',
  降水確率: 'Chance of rain',
  '最高 / 最低': 'High / Low',
  今: 'Now',
  今日: 'Today',
  地点を選ぶ: 'Choose a place',
  '地名で検索 (例: 大阪、札幌、New York)':
    'Search for a place (e.g. Osaka, Sapporo, New York)',
  地名で検索: 'Search for a place',
  '検索しています…': 'Searching…',
  '見つかりませんでした。': 'Nothing found.',
  保存した地点: 'Saved places',
  '天気を取得できませんでした。': "Couldn't get the weather.",
  再試行: 'Try again',
  天気を更新: 'Refresh the weather',
  '1時間ごとの予報': 'Hourly forecast',
  週間予報: '7-day forecast',

  // Settings: language
  言語: 'Language',
  表示言語: 'Display language',
}

const patterns: ReadonlyArray<TranslationPattern> = [
  [/^プルリクエスト #(\d+) を確認する$/, 'Review pull request #$1'],
  [/^プルリクエスト #(\d+)$/, 'Pull request #$1'],
  [/^更新 (\d.*)$/, 'Updated $1'],
  [/^(\d[\d:]*(?: ?[AP]M)?) 更新$/, 'Updated $1'],
  [/^(.+) を削除$/, 'Remove $1'],
  [
    /^天気を取得できませんでした \(HTTP (\d+)\)$/,
    "Couldn't get the weather (HTTP $1)",
  ],
  [
    /^地点を検索できませんでした \(HTTP (\d+)\)$/,
    "Couldn't search for places (HTTP $1)",
  ],
  [
    /^(.+): (\S+) (-?\d+°) · 湿度 (\d+)%(?: · 降水確率 (\d+)%)?$/,
    (t, place, label, temperature, humidity, rain) =>
      `${place}: ${t(label)} ${temperature} · Humidity ${humidity}%${
        rain !== undefined ? ` · Chance of rain ${rain}%` : ''
      }`,
  ],

  [/^プルリクエスト · (.+)$/, 'Pull requests · $1'],
  [/^(.+) をレビュワーから外す$/, 'Remove $1 as a reviewer'],
  [
    /^レビュワーを変更できませんでした: (.*)$/,
    "Couldn't change the reviewers: $1",
  ],
  [/^マージできませんでした: (.*)$/, "Couldn't merge: $1"],
  [
    /^インストーラを起動できませんでした: (.*)$/,
    "Couldn't start the installer: $1",
  ],
  [/^担当者を変更できませんでした: (.*)$/, "Couldn't change the assignees: $1"],
  [/^ラベルを変更できませんでした: (.*)$/, "Couldn't change the labels: $1"],
  [/^コメントできませんでした: (.*)$/, "Couldn't post the comment: $1"],
  [/^レビューを送信できませんでした: (.*)$/, "Couldn't submit the review: $1"],
  [/^(.+) を外す$/, 'Remove $1'],
  [/^クローズできませんでした: (.*)$/, "Couldn't close: $1"],
  [
    /^プルリクエストを作成できませんでした: (.*)$/,
    "Couldn't create the pull request: $1",
  ],
  [/^新しいバージョン (\S+) があります。$/, 'Version $1 is available.'],
  [/^ダウンロード中… (\d+)%$/, 'Downloading… $1%'],
  [
    /^アップデートを確認できませんでした: (.*)$/,
    "Couldn't check for updates: $1",
  ],
  [/^アップデートをダウンロード中 (\d+)%$/, 'Downloading update $1%'],
  [
    /^MS2026 Desktop (\S+) をインストールして再起動します$/,
    'Install MS2026 Desktop $1 and restart',
  ],
  [/^(.*) クリックして再試行$/, '$1\nClick to try again'],
  [
    /^リリースを取得できませんでした \(HTTP (\d+)\)。(.*)$/,
    (t, status, rest) =>
      `Couldn't get the releases (HTTP ${status}).${rest ? ` ${t(rest)}` : ''}`,
  ],
  [
    /^アップデートをダウンロードできませんでした \(HTTP (\d+)\)$/,
    "Couldn't download the update (HTTP $1)",
  ],
  [/^リンク (\d+) のアイコンを変更$/, 'Change the icon of link $1'],
  [/^リンク (\d+) のアイコン$/, 'Icon of link $1'],
  [/^リンク (\d+) の名前$/, 'Name of link $1'],
  [/^リンク (\d+) の URL$/, 'URL of link $1'],
  [
    /^(.+) チーム専用エディション · Gitea 対応$/,
    '$1 team edition · Gitea support',
  ],
]

export const english: ITranslations = { phrases, patterns }
