import { describe, it } from 'node:test'
import assert from 'node:assert'
import {
  getTeamGreeting,
  teamGreetings,
  teamGiteaServer,
  defaultTeamLinks as teamLinks,
  getTeamLinks,
  isValidTeamLinkURL,
  parseTeamLinks,
  setTeamLinks,
  teamLinkIconOptions,
} from '../../src/lib/team-links'
import { getGiteaAPIEndpoint, getHostingServiceName } from '../../src/lib/gitea'
import { translate } from '../../src/lib/i18n/translate'

const at = (hour: number) => new Date(2026, 3, 1, hour, 30)

describe('team-links', () => {
  it('only contains https links with a label', () => {
    assert(teamLinks.length > 0)
    for (const link of teamLinks) {
      assert.equal(new URL(link.url).protocol, 'https:', link.url)
      assert(link.label.length > 0)
    }
  })

  it('does not use emoji', () => {
    const emoji = /\p{Extended_Pictographic}/u
    for (const link of teamLinks) {
      assert(!emoji.test(link.label + (link.description ?? '')), link.label)
    }
    for (const hour of [2, 8, 12, 15, 20]) {
      assert(!emoji.test(getTeamGreeting(at(hour))))
    }
  })

  it('has unique links', () => {
    const urls = teamLinks.map(l => l.url)
    assert.equal(new Set(urls).size, urls.length)
  })

  it('points at a valid Gitea server', () => {
    assert.equal(
      getGiteaAPIEndpoint(teamGiteaServer),
      `${teamGiteaServer}/api/v1`
    )
  })

  it('greets differently throughout the day', () => {
    // 2026-04-01 is a Wednesday
    assert(teamGreetings.morning.includes(getTeamGreeting(at(8))))
    assert(teamGreetings.noon.includes(getTeamGreeting(at(12))))
    assert(teamGreetings.afternoon.includes(getTeamGreeting(at(15))))
    assert(teamGreetings.evening.includes(getTeamGreeting(at(20))))
    assert(teamGreetings.night.includes(getTeamGreeting(at(2))))
    assert(teamGreetings.night.includes(getTeamGreeting(at(23))))
  })

  it('keeps the greeting during a time of day and varies it by day', () => {
    assert.equal(
      getTeamGreeting(new Date(2026, 3, 1, 15, 0)),
      getTeamGreeting(new Date(2026, 3, 1, 17, 59))
    )

    const greetings = new Set<string>()
    for (let day = 1; day <= 30; day++) {
      greetings.add(getTeamGreeting(new Date(2026, 5, day, 15, 0)))
    }
    assert(greetings.size > 3)
  })

  it('has an English translation of every greeting', () => {
    for (const greeting of Object.values(teamGreetings).flat()) {
      assert.notEqual(translate(greeting, 'en'), null, greeting)
    }
  })

  it('greets differently on special days', () => {
    assert.equal(
      getTeamGreeting(new Date(2026, 0, 1, 10)),
      'あけましておめでとうございます'
    )
    // A Monday morning and a Friday evening
    assert.equal(
      getTeamGreeting(new Date(2026, 3, 6, 9)),
      '今週もよろしくお願いします'
    )
    assert.equal(
      getTeamGreeting(new Date(2026, 3, 10, 19)),
      '今週もおつかれさまでした'
    )
    // A Saturday
    assert.equal(
      getTeamGreeting(new Date(2026, 3, 11, 14)),
      '休日もおつかれさまです'
    )
  })
})

describe('getHostingServiceName', () => {
  it('names Gitea and GitHub', () => {
    assert.equal(getHostingServiceName(`${teamGiteaServer}/api/v1`), 'Gitea')
    assert.equal(getHostingServiceName('https://api.github.com'), 'GitHub')
    assert.equal(
      getHostingServiceName('https://ghe.example.com/api/v3'),
      'GitHub'
    )
  })
})

describe('editable team links', () => {
  it('parses stored links and drops invalid entries', () => {
    const links = parseTeamLinks(
      JSON.stringify([
        { label: 'Wiki', url: 'https://example.com', icon: 'globe' },
        { label: 'Bad icon', url: 'https://example.com', icon: 'nope' },
        { label: 3, url: 'https://example.com', icon: 'link' },
        'garbage',
      ])
    )
    assert.deepEqual(links, [
      { label: 'Wiki', url: 'https://example.com', icon: 'globe' },
    ])
  })

  it('rejects malformed JSON', () => {
    assert.equal(parseTeamLinks('{'), null)
    assert.equal(parseTeamLinks('{}'), null)
  })

  it('validates URLs', () => {
    assert(isValidTeamLinkURL('https://example.com/a?b=c'))
    assert(isValidTeamLinkURL(' http://localhost:3000 '))
    assert(!isValidTeamLinkURL('javascript:alert(1)'))
    assert(!isValidTeamLinkURL('file:///etc/passwd'))
    assert(!isValidTeamLinkURL('https://'))
  })

  it('has unique icon options', () => {
    const icons = teamLinkIconOptions.map(o => o.icon)
    assert.equal(new Set(icons).size, icons.length)
  })

  it('saves, loads and resets links', () => {
    const custom = [
      { label: 'Wiki', url: 'https://example.com', icon: 'globe' as const },
    ]
    setTeamLinks(custom)
    assert.deepEqual(getTeamLinks(), custom)
    setTeamLinks(null)
    assert.deepEqual(getTeamLinks(), teamLinks)
  })
})
