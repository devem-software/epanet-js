import { useMemo } from "react";
import { useTranslate } from "src/hooks/use-translate";
import { pluralize } from "src/lib/utils";
import { IWrappedFeature } from "src/types";
import { Quantities } from "src/model-metadata/quantities-spec";
import { SectionList, CollapsibleSection } from "src/components/form/fields";
import { MultiAssetActions } from "./actions";
import { Asset } from "src/hydraulic-model";
import { AssetTypeSections } from "./asset-type-sections";
import { useAtom, useAtomValue } from "jotai";
import {
  simulationAtom,
  dataAtom,
  multiAssetPanelCollapseAtom,
} from "src/state/jotai";
import { computeMultiAssetData } from "./data";

export function MultiAssetPanel({
  selectedFeatures,
  quantitiesMetadata,
}: {
  selectedFeatures: IWrappedFeature[];
  quantitiesMetadata: Quantities;
}) {
  const translate = useTranslate();
  const simulationState = useAtomValue(simulationAtom);
  const { hydraulicModel } = useAtomValue(dataAtom);
  const hasSimulation = simulationState.status !== "idle";
  const [collapseState, setCollapseState] = useAtom(
    multiAssetPanelCollapseAtom,
  );

  const { data: multiAssetData, counts: assetCounts } = useMemo(() => {
    const assets = selectedFeatures as Asset[];
    return computeMultiAssetData(assets, quantitiesMetadata, hydraulicModel);
  }, [selectedFeatures, quantitiesMetadata, hydraulicModel]);

  return (
    <SectionList>
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <span className="font-semibold">
            {translate("selection")} (
            {pluralize(translate, "asset", selectedFeatures.length)})
          </span>
          <MultiAssetActions />
        </div>
      </div>

      {assetCounts.junction > 0 && (
        <CollapsibleSection
          title={`${translate("junction")} (${assetCounts.junction})`}
          open={collapseState.junction}
          onOpenChange={(open) =>
            setCollapseState((prev) => ({ ...prev, junction: open }))
          }
        >
          <AssetTypeSections
            sections={multiAssetData.junction}
            hasSimulation={hasSimulation}
          />
        </CollapsibleSection>
      )}

      {assetCounts.pipe > 0 && (
        <CollapsibleSection
          title={`${translate("pipe")} (${assetCounts.pipe})`}
          open={collapseState.pipe}
          onOpenChange={(open) =>
            setCollapseState((prev) => ({ ...prev, pipe: open }))
          }
        >
          <AssetTypeSections
            sections={multiAssetData.pipe}
            hasSimulation={hasSimulation}
          />
        </CollapsibleSection>
      )}

      {assetCounts.pump > 0 && (
        <CollapsibleSection
          title={`${translate("pump")} (${assetCounts.pump})`}
          open={collapseState.pump}
          onOpenChange={(open) =>
            setCollapseState((prev) => ({ ...prev, pump: open }))
          }
        >
          <AssetTypeSections
            sections={multiAssetData.pump}
            hasSimulation={hasSimulation}
          />
        </CollapsibleSection>
      )}

      {assetCounts.valve > 0 && (
        <CollapsibleSection
          title={`${translate("valve")} (${assetCounts.valve})`}
          open={collapseState.valve}
          onOpenChange={(open) =>
            setCollapseState((prev) => ({ ...prev, valve: open }))
          }
        >
          <AssetTypeSections
            sections={multiAssetData.valve}
            hasSimulation={hasSimulation}
          />
        </CollapsibleSection>
      )}

      {assetCounts.reservoir > 0 && (
        <CollapsibleSection
          title={`${translate("reservoir")} (${assetCounts.reservoir})`}
          open={collapseState.reservoir}
          onOpenChange={(open) =>
            setCollapseState((prev) => ({ ...prev, reservoir: open }))
          }
        >
          <AssetTypeSections sections={multiAssetData.reservoir} />
        </CollapsibleSection>
      )}

      {assetCounts.tank > 0 && (
        <CollapsibleSection
          title={`${translate("tank")} (${assetCounts.tank})`}
          open={collapseState.tank}
          onOpenChange={(open) =>
            setCollapseState((prev) => ({ ...prev, tank: open }))
          }
        >
          <AssetTypeSections
            sections={multiAssetData.tank}
            hasSimulation={hasSimulation}
          />
        </CollapsibleSection>
      )}
    </SectionList>
  );
}
