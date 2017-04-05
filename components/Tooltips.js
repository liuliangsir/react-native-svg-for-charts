/**
 * @file 蜡烛图Tooltips
 * @author liuliang<liuliang@kavout.com>
 */

import React, {
    Component,
    PropTypes
} from 'react';
import {
    View,
    StyleSheet,
    TouchableHighlight,
    Text,
    Dimensions
} from 'react-native';

const tooltipWidth = 100;

const styles = StyleSheet.create({
    tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        borderRadius: 2,
        paddingHorizontal: 3,
        paddingVertical: 2,
        width: tooltipWidth,
        position: 'absolute'
    },
    tooltipContent: {
        color: '#fff',
        fontSize: 9
    }
});

export default class Tooltips extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isHover: true,
            isHoverCovered: false,
            isHoverCoveredRight: false
        };
    }

    render() {

        const {
            low = 10,
            high = 20,
            value = 30,
            startTime = '20160809',
            endTime = '20160810',
            volume = 30000,
            left = 50,
            top = 0
        } = this.props;

        const {
            isHover,
            isHoverCoveredLeft,
            isHoverCoveredRight
        } = this.state;

        let tooltipPosition = {
            left,
            top
        };

        if (isHoverCoveredLeft) {
            tooltipPosition.left = 0;
        }
        else if (isHoverCoveredRight) {
            delete tooltipPosition.left;
            tooltipPosition.right = 3;
        }
        const createTooltips = () => isHover
                ? (<View style={[styles.tooltip, tooltipPosition]}>
                    <Text style={styles.tooltipContent}>
                        {`开始时间：${startTime}\n结束时间：${endTime}\n　成交量：${volume}\n　最高价：${high}\n　最低价：${low}`}
                    </Text>
                </View>) : null;
        return createTooltips();
    }
}
