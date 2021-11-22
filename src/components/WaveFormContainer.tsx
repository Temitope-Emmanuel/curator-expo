import React from "react";
import { View, Dimensions } from "react-native";
import MaskedView from "@react-native-community/masked-view";
import Waveform from "./Waveform";
import Animated, {
  useSharedValue, useAnimatedGestureHandler,
  withTiming, useAnimatedStyle, interpolate
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import { BAR_HEIGHT, FULL_BAR_WIDTH, WAVEFORM_MARGIN } from "../views/utils/constants"

const { width: wWidth } = Dimensions.get("window")
const offset = wWidth / 2;

function findNearestMultiple(n, multiple) {
  'worklet';
  return Math.floor(n / multiple) * multiple;
}

const WaveFormContainer: React.FC<{
  waveform: number[];
  playing:boolean;
  sliding:Animated.SharedValue<boolean>;
  panX:Animated.SharedValue<number>;
}> = ({
  waveform,sliding,panX
}) => {
  
    const maxPanX = -wWidth
    const height = BAR_HEIGHT + 0.61 * BAR_HEIGHT + WAVEFORM_MARGIN;
    const width = waveform.length * FULL_BAR_WIDTH + (offset * 2);

    const panGestureHandler = useAnimatedGestureHandler({
      onStart(_, context: {
        startX: number
      }) {
        context.startX = panX.value;
        sliding.value = true;
      },
      onActive(event, context) {
        const nextPanX = context.startX + event.translationX;

        if (nextPanX > 0) {
          panX.value = 0;
        } else if (nextPanX < maxPanX) {
          panX.value = maxPanX;
        } else {
          panX.value = nextPanX;
        }
      },
      onEnd() {
        panX.value = withTiming(
          findNearestMultiple(panX.value, FULL_BAR_WIDTH)
        );

        sliding.value = false;
      },
    });

    const playedAnimatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateX: panX.value
          },
        ],
      };
    });

    const maskAnimatedStyle = useAnimatedStyle(() => {
      const newWidth = interpolate(
        panX.value,
        [0, width - wWidth - offset, width - wWidth],
        [offset, -wWidth, -width + offset]
      )

      return {
        width: newWidth,
      };
    });

    return (
      <PanGestureHandler
        onGestureEvent={panGestureHandler}>
        <Animated.View style={[{ flex: 1 }]}>
          <MaskedView
            style={{ width: "100%", height: "100%" }}
            maskElement={
              <Animated.View
                style={[{
                  // Transparent background because mask is based off alpha channel.
                  flex: 1,
                  justifyContent: "center",
                  backgroundColor: "transparent",
                  // alignItems: "center",
                  // transform: [{
                  //   translateX: offset
                  // }]
                },
                  playedAnimatedStyle
                ]}
              >
                <Waveform {...{ width, height, waveform }}
                  primaryColor="#e95f2a"
                  secondaryColor="#f5c19f"
                />
              </Animated.View>
            }
          >
            <Animated.View
              style={[
                {
                  position: "absolute",
                  zIndex: 1,
                  left: 0,
                  bottom: 0,
                  top: 0,
                  backgroundColor: "#FF5836"
                },
                maskAnimatedStyle
              ]}
            />
            <View style={{ flex: 1, backgroundColor: "white" }} />
          </MaskedView>
        </Animated.View>
      </PanGestureHandler>
    );
  };

export default WaveFormContainer