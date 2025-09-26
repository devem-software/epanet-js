import { HydraulicModelBuilder } from "src/__helpers__/hydraulic-model-builder";
import { reverseLink } from "./reverse-link";

describe("reverse-link", () => {
  it("reverses pipe connections and coordinates", () => {
    const model = HydraulicModelBuilder.with()
      .aJunction("J1", { coordinates: [0, 0] })
      .aJunction("J2", { coordinates: [10, 0] })
      .aPipe("P1", {
        startNodeId: "J1",
        endNodeId: "J2",
        coordinates: [
          [0, 0],
          [5, 0],
          [10, 0],
        ],
      })
      .build();

    const moment = reverseLink(model, { linkId: "P1" });

    expect(moment.note).toBe("Reverse pipe");
    expect(moment.putAssets).toHaveLength(1);

    const reversedPipe = moment.putAssets![0];
    expect(reversedPipe.id).toBe("P1");

    const connections = (reversedPipe as any).connections;
    expect(connections[0]).toBe("J2");
    expect(connections[1]).toBe("J1");

    expect(reversedPipe.coordinates).toEqual([
      [10, 0],
      [5, 0],
      [0, 0],
    ]);
  });

  it("reverses pump connections and coordinates", () => {
    const model = HydraulicModelBuilder.with()
      .aJunction("J1", { coordinates: [0, 0] })
      .aJunction("J2", { coordinates: [20, 0] })
      .aPump("PU1", {
        startNodeId: "J1",
        endNodeId: "J2",
        coordinates: [
          [0, 0],
          [10, 0],
          [20, 0],
        ],
      })
      .build();

    const moment = reverseLink(model, { linkId: "PU1" });

    expect(moment.note).toBe("Reverse pump");
    expect(moment.putAssets).toHaveLength(1);

    const reversedPump = moment.putAssets![0];
    expect(reversedPump.id).toBe("PU1");

    const connections = (reversedPump as any).connections;
    expect(connections[0]).toBe("J2");
    expect(connections[1]).toBe("J1");
    expect(reversedPump.coordinates).toEqual([
      [20, 0],
      [10, 0],
      [0, 0],
    ]);
  });

  it("reverses valve connections and coordinates", () => {
    const model = HydraulicModelBuilder.with()
      .aJunction("J1", { coordinates: [0, 0] })
      .aJunction("J2", { coordinates: [15, 0] })
      .aValve("V1", {
        startNodeId: "J1",
        endNodeId: "J2",
        coordinates: [
          [0, 0],
          [7.5, 0],
          [15, 0],
        ],
      })
      .build();

    const moment = reverseLink(model, { linkId: "V1" });

    expect(moment.note).toBe("Reverse valve");
    expect(moment.putAssets).toHaveLength(1);

    const reversedValve = moment.putAssets![0];
    expect(reversedValve.id).toBe("V1");

    const connections = (reversedValve as any).connections;
    expect(connections[0]).toBe("J2");
    expect(connections[1]).toBe("J1");
    expect(reversedValve.coordinates).toEqual([
      [15, 0],
      [7.5, 0],
      [0, 0],
    ]);
  });

  it("handles links with minimal coordinates (2 points)", () => {
    const model = HydraulicModelBuilder.with()
      .aJunction("J1", { coordinates: [0, 0] })
      .aJunction("J2", { coordinates: [10, 0] })
      .aPipe("P1", {
        startNodeId: "J1",
        endNodeId: "J2",
        coordinates: [
          [0, 0],
          [10, 0],
        ],
      })
      .build();

    const moment = reverseLink(model, { linkId: "P1" });

    expect(moment.putAssets).toHaveLength(1);
    const reversedPipe = moment.putAssets![0];

    const connections = (reversedPipe as any).connections;
    expect(connections[0]).toBe("J2");
    expect(connections[1]).toBe("J1");
    expect(reversedPipe.coordinates).toEqual([
      [10, 0],
      [0, 0],
    ]);
  });

  it("handles complex pipe geometry with many vertices", () => {
    const model = HydraulicModelBuilder.with()
      .aJunction("J1", { coordinates: [0, 0] })
      .aJunction("J2", { coordinates: [10, 10] })
      .aPipe("P1", {
        startNodeId: "J1",
        endNodeId: "J2",
        coordinates: [
          [0, 0],
          [2, 1],
          [4, 3],
          [6, 6],
          [8, 8],
          [10, 10],
        ],
      })
      .build();

    const moment = reverseLink(model, { linkId: "P1" });

    expect(moment.putAssets).toHaveLength(1);
    const reversedPipe = moment.putAssets![0];

    const connections = (reversedPipe as any).connections;
    expect(connections[0]).toBe("J2");
    expect(connections[1]).toBe("J1");
    expect(reversedPipe.coordinates).toEqual([
      [10, 10],
      [8, 8],
      [6, 6],
      [4, 3],
      [2, 1],
      [0, 0],
    ]);
  });

  it("throws error for non-existent link", () => {
    const model = HydraulicModelBuilder.with().build();

    expect(() => {
      reverseLink(model, { linkId: "NON_EXISTENT" });
    }).toThrow("Link with id NON_EXISTENT not found");
  });

  it("throws error for node asset instead of link", () => {
    const model = HydraulicModelBuilder.with()
      .aJunction("J1", { coordinates: [0, 0] })
      .build();

    expect(() => {
      reverseLink(model, { linkId: "J1" });
    }).toThrow("Link with id J1 not found");
  });

  it("preserves asset immutability", () => {
    const model = HydraulicModelBuilder.with()
      .aJunction("J1", { coordinates: [0, 0] })
      .aJunction("J2", { coordinates: [10, 0] })
      .aPipe("P1", {
        startNodeId: "J1",
        endNodeId: "J2",
        coordinates: [
          [0, 0],
          [5, 0],
          [10, 0],
        ],
      })
      .build();

    const originalPipe = model.assets.get("P1")!;
    const originalCoordinates = [...originalPipe.coordinates];

    reverseLink(model, { linkId: "P1" });

    expect((originalPipe as any).connections[0]).toBe("J1");
    expect((originalPipe as any).connections[1]).toBe("J2");
    expect(originalPipe.coordinates).toEqual(originalCoordinates);
  });
});
