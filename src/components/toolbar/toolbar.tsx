import { useTranslate } from "src/hooks/use-translate";
import MenuAction from "../menu-action";
import {
  CopyIcon,
  DownloadIcon,
  FileIcon,
  FilePlusIcon,
  FileTextIcon,
  GearIcon,
  LightningBoltIcon,
  ResetIcon,
} from "@radix-ui/react-icons";
import Modes from "../modes";
import ContextActions from "../context-actions";
import { useAtomValue } from "jotai";
import { simulationAtom } from "src/state/jotai";
import {
  openInpFromFsShortcut,
  useOpenInpFromFs,
} from "src/commands/open-inp-from-fs";
import { useNewProject } from "src/commands/create-new-project";
import {
  saveAsShortcut,
  saveShortcut,
  useSaveInp,
} from "src/commands/save-inp";
import {
  runSimulationShortcut,
  useRunSimulation,
} from "src/commands/run-simulation";
import { useShowReport } from "src/commands/show-report";
import { useUserTracking } from "src/infra/user-tracking";
import { useHistoryControl } from "src/commands/history-control";
import {
  showSimulationSettingsShortcut,
  useShowSimulationSettings,
} from "src/commands/show-simulation-settings";
import { useBreakpoint } from "src/hooks/use-breakpoint";
import { useFeatureFlag } from "src/hooks/use-feature-flags";
import { useImportCustomerPoints } from "src/commands/import-customer-points";

export const Toolbar = () => {
  const translate = useTranslate();
  const openInpFromFs = useOpenInpFromFs();
  const saveInp = useSaveInp();
  const createNewProject = useNewProject();
  const userTracking = useUserTracking();
  const runSimulation = useRunSimulation();
  const showSimulationSettings = useShowSimulationSettings();
  const showReport = useShowReport();
  const importCustomerPoints = useImportCustomerPoints();

  const { undo, redo } = useHistoryControl();

  const isCustomerPointOn = useFeatureFlag("FLAG_CUSTOMER_POINT");

  const simulation = useAtomValue(simulationAtom);

  const isMdOrLarger = useBreakpoint("md");

  return (
    <div
      className="relative flex flex-row items-center justify-start overflow-x-auto sm:overflow-visible
          border-t border-gray-200 dark:border-gray-900 pl-2 h-12"
    >
      {isMdOrLarger && (
        <MenuAction
          label={translate("newProject")}
          role="button"
          readOnlyHotkey={"alt+n"}
          onClick={() => {
            void createNewProject({ source: "toolbar" });
          }}
        >
          <FileIcon />
        </MenuAction>
      )}
      <MenuAction
        label={translate("openProject")}
        role="button"
        onClick={() => {
          void openInpFromFs({ source: "toolbar" });
        }}
        readOnlyHotkey={openInpFromFsShortcut}
      >
        <FilePlusIcon />
      </MenuAction>
      {
        <>
          <MenuAction
            label={translate("save")}
            role="button"
            onClick={() => {
              void saveInp({ source: "toolbar" });
            }}
            readOnlyHotkey={saveShortcut}
          >
            <DownloadIcon />
          </MenuAction>
          <MenuAction
            label={translate("saveAs")}
            role="button"
            onClick={() => {
              void saveInp({ source: "toolbar", isSaveAs: true });
            }}
            readOnlyHotkey={saveAsShortcut}
          >
            <CopyIcon />
          </MenuAction>
        </>
      }
      {isCustomerPointOn && (
        <MenuAction
          label="Import Customer Points"
          role="button"
          onClick={() => {
            void importCustomerPoints({ source: "toolbar" });
          }}
        >
          <FileTextIcon />
        </MenuAction>
      )}
      <Divider />
      {isMdOrLarger && (
        <>
          <MenuAction
            label={translate("undo")}
            role="button"
            onClick={() => {
              userTracking.capture({
                name: "operation.undone",
                source: "toolbar",
              });

              void undo();
            }}
            readOnlyHotkey={"ctrl+z"}
          >
            <ResetIcon />
          </MenuAction>
          <MenuAction
            label={translate("redo")}
            role="button"
            onClick={() => {
              userTracking.capture({
                name: "operation.redone",
                source: "toolbar",
              });
              void redo();
            }}
            readOnlyHotkey={"ctrl+y"}
          >
            <ResetIcon className="scale-x-[-1]" />
          </MenuAction>
          <Divider />
        </>
      )}
      {isMdOrLarger && (
        <>
          <Modes replaceGeometryForId={null} />
          <Divider />
        </>
      )}
      <MenuAction
        label={translate("simulate")}
        role="button"
        onClick={() => {
          userTracking.capture({
            name: "simulation.executed",
            source: "toolbar",
          });
          void runSimulation();
        }}
        expanded={true}
        readOnlyHotkey={runSimulationShortcut}
      >
        <LightningBoltIcon className="text-yellow-600" />
      </MenuAction>
      <MenuAction
        label={translate("simulationSettings")}
        role="button"
        onClick={() => showSimulationSettings({ source: "toolbar" })}
        readOnlyHotkey={showSimulationSettingsShortcut}
      >
        <GearIcon />
      </MenuAction>
      <MenuAction
        label={translate("viewReport")}
        role="button"
        onClick={() => {
          showReport({ source: "toolbar" });
        }}
        readOnlyHotkey={"alt+r"}
        disabled={simulation.status === "idle"}
      >
        <FileTextIcon />
      </MenuAction>
      <Divider />
      {isMdOrLarger && (
        <>
          <ContextActions />
          <div className="flex-auto" />
        </>
      )}
    </div>
  );
};

const Divider = () => {
  return <div className="border-r-2 border-gray-100 h-8 mx-1"></div>;
};
