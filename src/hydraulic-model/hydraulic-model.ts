import { Topology } from "./topology";
import { AssetsMap } from "./assets-map";
import { AssetBuilder, DefaultQuantities } from "./asset-builder";
import { UnitsSpec } from "src/model-metadata/quantities-spec";
import { nanoid } from "nanoid";
import { HeadlossFormula } from "./asset-types/pipe";
import { IdGenerator } from "./id-generator";
import { LabelManager } from "./label-manager";
import { Demands, nullDemands } from "./demands";
import { CustomerPoints, initializeCustomerPoints } from "./customer-points";
import { CustomerPointsLookup } from "./customer-points-lookup";

export type HydraulicModel = {
  version: string;
  assets: AssetsMap;
  customerPoints: CustomerPoints;
  customerPointsLookup: CustomerPointsLookup;
  assetBuilder: AssetBuilder;
  topology: Topology;
  units: UnitsSpec;
  demands: Demands;
  headlossFormula: HeadlossFormula;
  labelManager: LabelManager;
};

export { AssetsMap };

export const initializeHydraulicModel = ({
  units,
  defaults,
  headlossFormula = "H-W",
  demands = nullDemands,
}: {
  units: UnitsSpec;
  defaults: DefaultQuantities;
  headlossFormula?: HeadlossFormula;
  demands?: Demands;
}) => {
  const labelManager = new LabelManager();
  return {
    version: nanoid(),
    assets: new Map(),
    customerPoints: initializeCustomerPoints(),
    customerPointsLookup: new CustomerPointsLookup(),
    assetBuilder: new AssetBuilder(
      units,
      defaults,
      new IdGenerator(),
      labelManager,
    ),
    topology: new Topology(),
    demands,
    units,
    labelManager,
    headlossFormula,
  };
};
