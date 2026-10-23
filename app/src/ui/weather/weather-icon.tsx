import * as React from 'react'
import classNames from 'classnames'
import { WeatherKind } from '../../lib/weather'

interface IWeatherIconProps {
  readonly kind: WeatherKind
  readonly isDay: boolean
  /** The width and height in pixels */
  readonly size: number
  /** Whether to animate the icon (rays turning, rain falling, ...) */
  readonly animated?: boolean
  readonly className?: string
}

const Sun = ({ small }: { small?: boolean }) => (
  <g className={classNames('wx-sun', { small })}>
    <g className="wx-sun-rays">
      {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
        <rect
          key={angle}
          x="30.5"
          y="4"
          width="3"
          height="8"
          rx="1.5"
          transform={`rotate(${angle} 32 32)`}
        />
      ))}
    </g>
    <circle className="wx-sun-core" cx="32" cy="32" r="12" />
  </g>
)

const Moon = ({ small }: { small?: boolean }) => (
  <g className={classNames('wx-moon', { small })}>
    <path d="M39 12a20 20 0 1 0 13 33A16 16 0 0 1 39 12z" />
    <circle className="wx-star" cx="50" cy="14" r="1.6" />
    <circle className="wx-star delay" cx="56" cy="24" r="1.1" />
  </g>
)

const Cloud = ({ dark, offset = 0 }: { dark?: boolean; offset?: number }) => (
  // The position and the drifting animation are on separate groups, as an
  // animation replaces the transform attribute
  <g transform={`translate(0 ${offset})`}>
    <g className={classNames('wx-cloud', { dark })}>
      <circle cx="24" cy="36" r="10" />
      <circle cx="36" cy="29" r="13" />
      <circle cx="47" cy="37" r="9" />
      <rect x="14" y="36" width="42" height="11" rx="5.5" />
    </g>
  </g>
)

const Drops = ({ count, light }: { count: number; light?: boolean }) => (
  <g className={classNames('wx-drops', { light })}>
    {Array.from({ length: count }, (_, i) => (
      <line
        key={i}
        className={`wx-drop d${i}`}
        x1={22 + i * 9}
        y1="50"
        x2={20 + i * 9}
        y2={light ? 54 : 57}
      />
    ))}
  </g>
)

const Flakes = () => (
  <g className="wx-flakes">
    {[0, 1, 2].map(i => (
      <circle
        key={i}
        className={`wx-flake d${i}`}
        cx={23 + i * 9}
        cy="54"
        r="2.4"
      />
    ))}
  </g>
)

/** A drawn weather icon, so that no emoji are needed */
export class WeatherIcon extends React.PureComponent<IWeatherIconProps> {
  private renderParts() {
    const { kind, isDay } = this.props
    const Sky = isDay ? Sun : Moon

    switch (kind) {
      case 'clear':
        return <Sky />
      case 'partly-cloudy':
        return (
          <>
            <g transform="translate(10 -8) scale(0.75)">
              <Sky small={true} />
            </g>
            <Cloud offset={4} />
          </>
        )
      case 'cloudy':
        return (
          <>
            <g transform="translate(14 -10) scale(0.7)">
              <Cloud dark={true} />
            </g>
            <Cloud offset={2} />
          </>
        )
      case 'fog':
        return (
          <>
            <Cloud offset={-6} />
            <g className="wx-fog">
              <rect
                className="d0"
                x="12"
                y="46"
                width="40"
                height="3"
                rx="1.5"
              />
              <rect
                className="d1"
                x="18"
                y="53"
                width="34"
                height="3"
                rx="1.5"
              />
            </g>
          </>
        )
      case 'drizzle':
        return (
          <>
            <Cloud offset={-6} />
            <Drops count={3} light={true} />
          </>
        )
      case 'rain':
        return (
          <>
            <Cloud dark={true} offset={-6} />
            <Drops count={3} />
          </>
        )
      case 'snow':
        return (
          <>
            <Cloud offset={-6} />
            <Flakes />
          </>
        )
      case 'thunder':
        return (
          <>
            <Cloud dark={true} offset={-6} />
            <path className="wx-bolt" d="M34 40 26 52h6l-3 10 10-14h-6l3-8z" />
          </>
        )
    }
  }

  public render() {
    const { size, animated = true, className, kind } = this.props
    return (
      <svg
        className={classNames('weather-icon', `wx-${kind}`, className, {
          animated,
        })}
        width={size}
        height={size}
        viewBox="0 0 64 64"
        aria-hidden="true"
      >
        {this.renderParts()}
      </svg>
    )
  }
}
