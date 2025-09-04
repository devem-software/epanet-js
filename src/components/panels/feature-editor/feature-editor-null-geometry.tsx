import { memo } from "react";
import type { IWrappedFeature } from "src/types";
import { panelNullOpen } from "src/state/jotai";
import { PanelDetailsCollapsible } from "src/components/panel-details";
import {
  Button,
  StyledPopoverContent,
  TextWell,
} from "src/components/elements";
import * as P from "@radix-ui/react-popover";
import Modes from "src/components/modes";
import { WarningIcon } from "src/icons";

export const FeatureEditorNullGeometry = memo(
  function FeatureEditorNullGeometryInner({
    wrappedFeature,
  }: {
    wrappedFeature: IWrappedFeature;
  }) {
    if (wrappedFeature.feature.geometry) return null;
    return (
      <PanelDetailsCollapsible title="Null geometry" atom={panelNullOpen}>
        <TextWell size="xs">
          <WarningIcon className="inline-block w-3 h-3 mr-1" />
          This feature has no geometry information.
        </TextWell>
        <div className="pt-2">
          <P.Root>
            <P.Trigger asChild>
              <Button size="xs">Add geometry</Button>
            </P.Trigger>
            <StyledPopoverContent size="xs">
              <Modes replaceGeometryForId={wrappedFeature.id} />
            </StyledPopoverContent>
          </P.Root>
        </div>
      </PanelDetailsCollapsible>
    );
  },
);
