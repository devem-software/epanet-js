import { useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import { buildInp } from "src/simulation/build-inp";
import { dataAtom, dialogAtom, simulationAtom } from "src/state/jotai";
import { runSimulation as run } from "src/simulation";
import { attachSimulation } from "src/hydraulic-model";
import { useDrawingMode } from "./set-drawing-mode";
import { Mode } from "src/state/mode";

export const runSimulationShortcut = "shift+enter";

export const useRunSimulation = () => {
  const setSimulationState = useSetAtom(simulationAtom);
  const setDialogState = useSetAtom(dialogAtom);
  const { hydraulicModel } = useAtomValue(dataAtom);
  const setData = useSetAtom(dataAtom);
  const setDrawingMode = useDrawingMode();

  const runSimulation = useCallback(async () => {
    setDrawingMode(Mode.NONE);
    setSimulationState((prev) => ({ ...prev, status: "running" }));
    const inp = buildInp(hydraulicModel, {
      customerDemands: true,
    });
    const start = performance.now();
    setDialogState({ type: "loading" });
    const { report, status, results } = await run(inp);

    attachSimulation(hydraulicModel, results);
    setData((prev) => ({
      ...prev,
      hydraulicModel,
    }));

    setSimulationState({
      status,
      report,
      modelVersion: hydraulicModel.version,
    });
    const end = performance.now();
    const duration = end - start;
    setDialogState({
      type: "simulationSummary",
      status,
      duration,
    });
  }, [
    setDrawingMode,
    hydraulicModel,
    setSimulationState,
    setData,
    setDialogState,
  ]);

  return runSimulation;
};
