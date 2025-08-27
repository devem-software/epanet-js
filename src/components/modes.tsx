import {
  CursorArrowIcon,
  CircleIcon,
  StretchHorizontallyIcon,
  VercelLogoIcon,
} from "@radix-ui/react-icons";
import { modeAtom, Mode, MODE_INFO } from "src/state/jotai";
import MenuAction from "src/components/menu-action";
import { memo } from "react";
import { useAtomValue } from "jotai";
import { IWrappedFeature } from "src/types";
import { useUserTracking } from "src/infra/user-tracking";
import { useDrawingMode } from "src/commands/set-drawing-mode";
import { PumpIcon } from "src/custom-icons/pump-icon";
import { ValveIcon } from "src/custom-icons/valve-icon";
import { TankIcon } from "src/custom-icons/tank-icon";
import { useTranslate } from "src/hooks/use-translate";
import { useFeatureFlag } from "src/hooks/use-feature-flags";
import {
  Circle,
  MousePointer2,
  RectangleHorizontal,
  Triangle,
} from "lucide-react";
import { PipeIcon } from "src/custom-icons/pipe-icon";
import { DeprecatedPumpIcon } from "src/custom-icons/deprecated-pump-icon";
import { DeprecatedValveIcon } from "src/custom-icons/deprecated-valve-icon";

const MODE_OPTIONS = [
  {
    mode: Mode.NONE,
    hotkey: "1",
    Icon: () => <MousePointer2 size={16} />,
  },
  {
    mode: Mode.DRAW_JUNCTION,
    hotkey: "2",
    Icon: () => <Circle size={16} />,
  },
  {
    mode: Mode.DRAW_RESERVOIR,
    hotkey: "3",
    Icon: () => <Triangle size={16} />,
  },
  {
    mode: Mode.DRAW_TANK,
    hotkey: "4",
    Icon: () => <RectangleHorizontal size={16} />,
  },
  {
    mode: Mode.DRAW_PIPE,
    hotkey: "5",
    Icon: () => <PipeIcon width={16} height={16} />,
  },
  {
    mode: Mode.DRAW_PUMP,
    hotkey: "6",
    Icon: () => <PumpIcon width={16} height={16} />,
  },
  {
    mode: Mode.DRAW_VALVE,
    hotkey: "7",
    Icon: () => <ValveIcon width={16} height={16} />,
  },
] as const;

const DEPRECATED_MODE_OPTIONS = [
  {
    mode: Mode.NONE,
    hotkey: "1",
    Icon: CursorArrowIcon,
  },
  {
    mode: Mode.DRAW_JUNCTION,
    hotkey: "2",
    Icon: CircleIcon,
  },
  {
    mode: Mode.DRAW_RESERVOIR,
    hotkey: "3",
    Icon: VercelLogoIcon,
  },
  {
    mode: Mode.DRAW_TANK,
    hotkey: "4",
    Icon: () => <TankIcon width={15} height={15} />,
  },
  {
    mode: Mode.DRAW_PIPE,
    hotkey: "5",
    Icon: StretchHorizontallyIcon,
  },
  {
    mode: Mode.DRAW_PUMP,
    hotkey: "6",
    Icon: () => <DeprecatedPumpIcon width={15} height={15} />,
  },
  {
    mode: Mode.DRAW_VALVE,
    hotkey: "7",
    Icon: () => <DeprecatedValveIcon width={15} height={15} />,
  },
] as const;

export default memo(function Modes({
  replaceGeometryForId,
}: {
  replaceGeometryForId: IWrappedFeature["id"] | null;
}) {
  const { mode: currentMode } = useAtomValue(modeAtom);
  const setDrawingMode = useDrawingMode();
  const userTracking = useUserTracking();
  const translate = useTranslate();
  const modeOptions = MODE_OPTIONS;
  const deprecatedModeOptions = DEPRECATED_MODE_OPTIONS;
  const isLucideIconsOn = useFeatureFlag("FLAG_LUCIDE_ICONS");

  return isLucideIconsOn ? (
    <div className="flex items-center justify-start" role="radiogroup">
      {modeOptions
        .filter((mode) => {
          if (!replaceGeometryForId) return true;
          return mode.mode !== Mode.NONE;
        })
        .map(({ mode, hotkey, Icon }, i) => {
          const modeInfo = MODE_INFO[mode];
          return (
            <MenuAction
              role="radio"
              key={i}
              selected={currentMode === mode}
              readOnlyHotkey={hotkey}
              label={translate(modeInfo.name)}
              onClick={() => {
                userTracking.capture({
                  name: "drawingMode.enabled",
                  source: "toolbar",
                  type: modeInfo.name,
                });
                void setDrawingMode(mode);
              }}
            >
              <Icon />
            </MenuAction>
          );
        })}
    </div>
  ) : (
    <div className="flex items-center justify-start" role="radiogroup">
      {deprecatedModeOptions
        .filter((mode) => {
          if (!replaceGeometryForId) return true;
          return mode.mode !== Mode.NONE;
        })
        .map(({ mode, hotkey, Icon }, i) => {
          const modeInfo = MODE_INFO[mode];
          return (
            <MenuAction
              role="radio"
              key={i}
              selected={currentMode === mode}
              readOnlyHotkey={hotkey}
              label={translate(modeInfo.name)}
              onClick={() => {
                userTracking.capture({
                  name: "drawingMode.enabled",
                  source: "toolbar",
                  type: modeInfo.name,
                });
                void setDrawingMode(mode);
              }}
            >
              <Icon />
            </MenuAction>
          );
        })}
    </div>
  );
});
