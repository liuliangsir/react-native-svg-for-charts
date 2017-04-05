/**
 * @file 移动事件
 * @author liuliang<liuliang@kavout.com>
 */

import React, {
    Component
} from 'react';
import {
    StyleSheet,
    View,
    Text,
    PanResponder,
    Animated,
    Easing,
    Dimensions
} from 'react-native';

const CIRCLE_RADIUS = 36;
const {height: HEIGHT, width: WIDTH} = Dimensions.get('window');
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    dropZone: {
        height: 100,
        backgroundColor: '#2c3e50'
    },
    text: {
        marginTop: 25,
        marginLeft: 5,
        marginRight: 5,
        textAlign: 'center',
        color: '#fff'
    },
    draggableContainer: {
        position: 'absolute',
        top: HEIGHT / 2 - CIRCLE_RADIUS,
        left: WIDTH / 2 - CIRCLE_RADIUS
    },
    circle: {
        backgroundColor: '#1abc9c',
        width: CIRCLE_RADIUS * 2,
        height: CIRCLE_RADIUS * 2,
        borderRadius: CIRCLE_RADIUS
    }
});

export default class MoveEventDemo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showDraggable: true,
            dropZoneValues: null,
            pan: new Animated.ValueXY()
        };

        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event([null, {
                dx: this.state.pan.x,
                dy: this.state.pan.y
            }]),
            onPanResponderRelease: (e, gesture) => {
                if (this.isDropZone(gesture)) {
                    this.setState({
                        showDraggable: false
                    });
                }
                else {
                    Animated.spring(
                        this.state.pan,
                        {toValue: {x: gesture.moveX - gesture.x0, y: gesture.moveY - gesture.y0}}
                    ).start();
                }
            }
        });
    }

    isDropZone(gesture) {
        const dz = this.state.dropZoneValues;
        // console.log(gesture.moveX, gesture.moveY);
        return gesture.moveY > dz.y && gesture.moveY < dz.y + dz.height;
    }

    setDropZoneValues(event) {
        this.setState({
            dropZoneValues: event.nativeEvent.layout
        });
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <View
                    onLayout={this.setDropZoneValues.bind(this)}
                    style={styles.dropZone}>
                    <Text style={styles.text}>Drop me here!</Text>
                </View>

                {this.renderDraggable()}
            </View>
        );
    }

    renderDraggable() {
        if (this.state.showDraggable) {
            return (
                <View style={styles.draggableContainer}>
                    <Animated.View
                        {...this.panResponder.panHandlers}
                        style={[this.state.pan.getLayout(), styles.circle]}>
                        <Text style={styles.text}>Drag me!</Text>
                    </Animated.View>
                </View>
            );
        }
    }
}
