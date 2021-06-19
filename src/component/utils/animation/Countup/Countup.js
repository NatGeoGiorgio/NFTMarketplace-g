import React, { Component } from 'react'
import { Transition, animated} from "react-spring";

import "./styles.css";

/**
 * List of separtors
 */
const separators = [",", "."];

/**
 * Renders an animated JS locale formatted number string
 */
const AnimatedNumbers = ({
  value,
  fontSize,
  locale,
  formatOptions,
  className
}) => {
  const valueStr = (Number(value) || Number(0)).toLocaleString(
    locale,
    formatOptions
  );
  const valueStrArray = valueStr.split("");

  const fontSizeValue = fontSize || 40;
  const fontWidth = fontSizeValue * 0.5; // font width is estimated to half the font size

  // Creates animating list where the position of a number/separator depends on the preceding number/separator
  const { items, totalWidth } = valueStrArray.reduce(
    (acc, val, i) => {
      const precedingItem = acc.items[i - 1];
      const currentItem = {
        value: val,
        x: 0,
        y: fontWidth,
        key: `${i}-${val}`
      };

      if (precedingItem) {
        currentItem.x = separators.includes(precedingItem.value)
          ? precedingItem.x + fontWidth * 0.5
          : precedingItem.x + fontWidth;
      }

      acc.items.push(currentItem);
      acc.totalWidth += currentItem.x - acc.totalWidth;

      return acc;
    },
    {
      items: [],
      totalWidth: 0
    }
  );

  const wrapWidth = totalWidth + fontWidth; // width of container

  const cellStyle = { position: "absolute", left: 0 };
  const springConfig = { mass: 4, tension: 100, friction: 10 };

  return (
    <div className="numberFormatContainer">
      <div style={{ width: wrapWidth }} className="numberFormatWrap">
        <Transition
          items={items}
          initial={null}
          keys={v => v.key}
          from={({ y }) => ({ y: -y, opacity: 0 })}
          enter={({ x }) => ({ y: 0, x, opacity: 1 })}
          // update={({ y, x }) => ({ y, x, opacity: 1 })}
          leave={({ y, x }) => ({ y, x, opacity: 0 })}
          config={springConfig}
          trail={200}
        >
          {item => ({ opacity, x, y }) => (
            <animated.span
              style={{
                ...cellStyle,
                opacity,
                fontSize: fontSizeValue,
                transform: `translate3d(${x}px,${y}px,0px)`
              }}
            >
              {item.value}
            </animated.span>
          )}
        </Transition>
      </div>
    </div>
  );
};


export default class Countup extends Component {
  state = { value: 200 };

  incrementor = null;

  /**
   * Starts incrementing value after mount
   */
  componentDidMount() {
    this.incrementValue();
  }

  /**
   * Stops increment value and cleanup on unmount
   */
  componentWillUnmount() {
    if (this.incrementor) {
      clearInterval(this.incrementor);
    }
  }

  /**
   * Increments value by 1 every 2secs and sets to state
   */
  incrementValue = () => {
    this.incrementor = setInterval(
      () => this.setState(state => ({ value: state.value + 1 })),
      2000
    );
  };

  render() {
    const { value } = this.state;

    return (
      <div className="Countup">
        <div className="smaller">
          <AnimatedNumbers
            value={value}
            fontSize={16}
            formatOptions={{
              style: "currency",
              currency: "usd",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }}
          />
        </div>
        <div className="bigger">
          <AnimatedNumbers
            value={value}
            fontSize={100}
            formatOptions={{
              style: "currency",
              currency: "usd",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }}
          />
        </div>
      </div>
    );
  }
}

