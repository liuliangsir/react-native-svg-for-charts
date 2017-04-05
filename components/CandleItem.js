/**
 * @file 蜡烛子图
 * @author liuliang<liuliang@kavout.com>
 */

import React, {Component} from 'react';

import {
    Text,
    View,
    TouchableHighlight,
    Dimensions,
    StyleSheet,
    PanResponder,
    Animated,
    Easing
} from 'react-native';

import Svg, {
    G
} from 'react-native-svg';

import Axis from '../Axis';
import Tooltips from './Tooltips';

export default class CandleItemChart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShowCrossLine: false,
            crossLineXAxisIndex: 0,
            crossLineYAxisIndex: 0,
            pan: new Animated.ValueXY()
        };
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (e, gesture) => {
                const {isShowCrossLine} = this.state;

                if (!isShowCrossLine) {
                    return false;
                }

                const {locationX, locationY} = e.nativeEvent;

                const {
                    options: {
                        margin: {
                            left,
                            top
                        },
                        chartHeight
                    },
                    chart: {
                        curves
                    },
                    axisYOptions: {
                        min: axisYMin,
                        max: axisYMax
                    }
                } = this.props;
                const crossLineXAxisIndex = curves.findIndex(({centroid}) => centroid > locationX - left);
                const crossLineYAxisIndex = (locationY - top) * (axisYMin - axisYMax) / chartHeight + axisYMax;

                this.setState({
                    crossLineXAxisIndex,
                    crossLineYAxisIndex
                });
            },
            onStartShouldSetPanResponderCapture: (e, gesture) => {
                return gesture.dx !== 0 && gesture.dy !== 0;
            },
            onMoveShouldSetPanResponderCapture: (e, gesture) => {
                return gesture.dx !== 0 && gesture.dy !== 0;
            },
            onPanResponderRelease: (e, gesture) => {

            }
        });
    }

    isDropZone(gesture) {
        const dz = this.state.dropZoneValues;
        return gesture.moveY > dz.y && gesture.moveY < dz.y + dz.height;
    }

    setDropZoneValues(event) {
        const {
            options: {
                margin: {
                    left,
                    top,
                    right,
                    bottom
                }
            }
        } = this.props;

        const layout = Object.assign({}, event.nativeEvent.layout);

        const updateLayout = (left, top, right, bottom, layout) => {
            let value = 0;
            for (let [k, v] of Object.entries(layout)) {
                switch (k) {
                    case 'x': {
                        value = left;
                        break;
                    }
                    case 'y': {
                        value = top;
                        break;
                    }
                    case 'width': {
                        value = -(left + right);
                        break;
                    }
                    case 'height': {
                        value = -(top + bottom);
                        break;
                    }
                }
                layout[k] = v + value;
            }
            return layout;
        };

        this.setState({
            dropZoneValues: updateLayout(left, top, right, bottom, layout)
        });
    }

    onPressIn(e) {

        const {isShowCrossLine} = this.state;

        this.setState({
            isShowCrossLine: !isShowCrossLine
        });

    }

    render() {

        const {
            options: {
                margin: {
                    left,
                    top
                },
                width,
                height
            },
            chart,
            axisYOptions,
            axisXOptions,
            chartArea,
            lines
        } = this.props;

        const {
            crossLineXAxisIndex = 0,
            crossLineYAxisIndex = 0,
            pan,
            isShowCrossLine
        } = this.state;
        const createNewTickValues = (axisOptions, crossLineAxisIndex) => {
            const {tickValues} = axisOptions;
            if (!isShowCrossLine) {
                return tickValues;
            }
            const newTickValues = tickValues.slice();
            newTickValues.push({
                value: crossLineAxisIndex
            });
            newTickValues.sort((v1, v2) => v1.value - v2.value);
            return newTickValues;
        };
        const tooltipsLeft = left + chart.curves[crossLineXAxisIndex].centroid;
        const tooltipsTop =  top;
        return (
            <View
                style={{position: 'relative'}}
                onLayout={this.setDropZoneValues.bind(this)}>
                <Animated.View
                    {...this.panResponder.panHandlers}
                    style={this.state.pan.getLayout()}>
                    <TouchableHighlight
                    onPressIn={this.onPressIn.bind(this)}
                    underlayColor='transparent'>
                        <Svg width={width} height={height}>
                            <G x={left} y={top}>
                                <Axis
                                    scale={chart.scale}
                                    options={Object.assign(
                                        {},
                                        axisYOptions,
                                        {tickValues: createNewTickValues(axisYOptions, crossLineYAxisIndex)}
                                    )}
                                    chartArea={chartArea}
                                />
                                <Axis
                                    scale={chart.scale}
                                    options={Object.assign(
                                        {},
                                        axisXOptions,
                                        {tickValues: createNewTickValues(axisXOptions, crossLineXAxisIndex)}
                                    )}
                                    chartArea={chartArea}
                                    curves={chart.curves}
                                />
                                {lines}
                            </G>
                        </Svg>
                    </TouchableHighlight>
                </Animated.View>
                {isShowCrossLine && <Tooltips top={tooltipsTop} left={tooltipsLeft}/>}
                </View>
        );
    }
}
