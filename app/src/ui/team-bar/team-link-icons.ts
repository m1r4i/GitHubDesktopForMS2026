import { TeamLinkIcon } from '../../lib/team-links'
import { OcticonSymbol } from '../octicons'
import * as octicons from '../octicons/octicons.generated'

/** The Octicon shown for each of the icons users can pick for their links */
export const teamLinkIcons: Record<TeamLinkIcon, OcticonSymbol> = {
  folder: octicons.fileDirectory,
  build: octicons.archive,
  calendar: octicons.calendar,
  repo: octicons.repo,
  document: octicons.book,
  docs: octicons.note,
  chat: octicons.commentDiscussion,
  link: octicons.link,
  globe: octicons.globe,
  people: octicons.people,
  checklist: octicons.checklist,
  code: octicons.code,
  bug: octicons.bug,
  rocket: octicons.rocket,
  server: octicons.server,
  megaphone: octicons.megaphone,
  briefcase: octicons.briefcase,
  home: octicons.home,
}
