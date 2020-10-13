/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { boolean, color, number, select } from '@storybook/addon-knobs';
import React from 'react';

import { Axis, BarSeries, Chart, Position, ScaleType, Settings } from '../../src';
import { SeededDataGenerator } from '../../src/mocks/utils';
import { getChartRotationKnob } from '../utils/knobs';

const dataGen = new SeededDataGenerator();
function generateDataWithAdditional(num: number) {
  return [...dataGen.generateSimpleSeries(num), { x: num, y: 0.25, g: 0 }, { x: num + 1, y: 8, g: 0 }];
}
const frozenDataSmallVolume = generateDataWithAdditional(5);
const frozenDataMediumVolume = generateDataWithAdditional(10);
const frozenDataHighVolume = generateDataWithAdditional(50);

const frozenData: { [key: string]: any[] } = {
  s: frozenDataSmallVolume,
  m: frozenDataMediumVolume,
  h: frozenDataHighVolume,
};

export const Example = () => {
  const showValueLabel = boolean('show value label', true);
  const isAlternatingValueLabel = boolean('alternating value label', false);
  const isValueContainedInElement = boolean('contain value label within bar element', false);
  const hideClippedValue = boolean('hide clipped value', false);

  const displayValueSettings = {
    showValueLabel,
    isAlternatingValueLabel,
    isValueContainedInElement,
    hideClippedValue,
    valueFormatter: (d: any) => Number(d).toFixed(2),
  };

  const debug = boolean('debug', false);
  const fixedFontSize = number('Fixed font size', 10);
  const useFixedFontSize = boolean('Use fixed font size', false);

  const maxFontSize = number('Max font size', 25);
  const minFontSize = number('Min font size', 10);

  const theme = {
    barSeriesStyle: {
      displayValue: {
        fontSize: useFixedFontSize ? fixedFontSize : { max: maxFontSize, min: minFontSize },
        fontFamily: "'Open Sans', Helvetica, Arial, sans-serif",
        fontStyle: 'normal',
        padding: 0,
        fill: color('value color', '#000'),
        offsetX: number('offsetX', 0),
        offsetY: number('offsetY', 0),
      },
    },
  };

  const dataSize = select(
    'data volume size',
    {
      'small volume': 's',
      'medium volume': 'm',
      'high volume': 'h',
    },
    's',
  );
  const data = frozenData[dataSize];

  return (
    <Chart renderer="canvas" className="story-chart">
      <Settings theme={theme} debug={debug} rotation={getChartRotationKnob()} showLegend showLegendExtra />
      <Axis
        id="bottom"
        position={Position.Bottom}
        title="Bottom axis"
        showOverlappingTicks
        tickFormat={(d: any) => Number(d).toFixed(2)}
      />
      <Axis id="left2" title="Left axis" position={Position.Left} tickFormat={(d: any) => Number(d).toFixed(2)} />
      <BarSeries
        id="bars"
        displayValueSettings={displayValueSettings}
        xScaleType={ScaleType.Linear}
        yScaleType={ScaleType.Linear}
        xAccessor="x"
        yAccessors={['y']}
        data={data}
      />
    </Chart>
  );
};