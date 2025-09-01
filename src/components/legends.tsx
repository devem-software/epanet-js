import { linearGradient } from "src/lib/color";
import { useTranslate } from "src/hooks/use-translate";
import { useTranslateUnit } from "src/hooks/use-translate-unit";
import { localizeDecimal } from "src/infra/i18n/numbers";
import { useUserTracking } from "src/infra/user-tracking";
import { RangeColorRule } from "src/map/symbology/range-color-rule";
import { useAtomValue } from "jotai";
import { linkSymbologyAtom, nodeSymbologyAtom } from "src/state/symbology";
import { useState } from "react";
import { useBreakpoint } from "src/hooks/use-breakpoint";
import { TriangleDownIcon, TriangleRightIcon } from "@radix-ui/react-icons";
import { useFeatureFlag } from "src/hooks/use-feature-flags";
import clsx from "clsx";
import { ChevronDown, ChevronRight } from "lucide-react";

export const Legends = () => {
  const nodeSymbology = useAtomValue(nodeSymbologyAtom);
  const linkSymbology = useAtomValue(linkSymbologyAtom);

  const isSmOrLarger = useBreakpoint("sm");
  if (!isSmOrLarger) return null;

  return (
    <div className="space-y-1 absolute top-10 left-3 w-48">
      {!!nodeSymbology.colorRule && (
        <Legend symbology={nodeSymbology.colorRule} />
      )}
      {!!linkSymbology.colorRule && (
        <Legend symbology={linkSymbology.colorRule} />
      )}
    </div>
  );
};

const Legend = ({ symbology }: { symbology: RangeColorRule }) => {
  const translate = useTranslate();
  const translateUnit = useTranslateUnit();
  const userTracking = useUserTracking();
  const { property, unit } = symbology;

  const title = unit
    ? `${translate(property)} (${translateUnit(unit)})`
    : translate(property);

  const isSmOrLarger = useBreakpoint("sm");

  const [isExpanded, setExpanded] = useState(isSmOrLarger);
  const isLucideIconsOn = useFeatureFlag("FLAG_LUCIDE_ICONS");

  return (
    <LegendContainer>
      <div
        className={clsx(
          "block w-full p-2 flex flex-col justify-between items-start gap-2",
          "cursor-pointer hover:bg-gray-100",
        )}
        onClick={() => {
          setExpanded(!isExpanded);
          userTracking.capture({
            name: "legend.clicked",
            property,
          });
        }}
      >
        <div className="flex w-full items-center justify-between">
          <div className="text-xs text-wrap select-none">{title}</div>
          <span className="flex-shrink-0">
            {isExpanded ? (
              isLucideIconsOn ? (
                <ChevronDown size={16} />
              ) : (
                <TriangleDownIcon />
              )
            ) : isLucideIconsOn ? (
              <ChevronRight size={16} />
            ) : (
              <TriangleRightIcon />
            )}
          </span>
        </div>
        {isExpanded && <LegendRamp colorRule={symbology} />}
      </div>
    </LegendContainer>
  );
};

const LegendContainer = ({
  onClick,
  children,
}: {
  onClick?: () => void;
  children: React.ReactNode;
}) => {
  return (
    <div
      className="space-y-1 text-xs bg-white dark:bg-gray-900 dark:text-white border border-gray-300 dark:border-black w-32 rounded-sm"
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const LegendRamp = ({ colorRule }: { colorRule: RangeColorRule }) => {
  const { colors, breaks, interpolate } = colorRule;
  return (
    <div
      className="relative w-4 h-32 rounded dark:border dark:border-white "
      style={{
        background: linearGradient({
          colors: colors,
          interpolate: interpolate,
          vertical: true,
        }),
      }}
    >
      {Array.from({ length: breaks.length }).map((_, i) => {
        const topPct = ((i + 1) / (breaks.length + 1)) * 100;
        return (
          <div
            key={breaks[i] + "_" + i}
            className="absolute left-full ml-2 text-xs whitespace-nowrap select-none"
            style={{
              top: `${topPct}%`,
              transform: "translateY(-50%)",
            }}
          >
            {localizeDecimal(breaks[i])}
          </div>
        );
      })}
    </div>
  );
};
