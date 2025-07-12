import { shootingPct, bouncePct, cupHitFreq } from "./utils";

describe("utils stat helpers", () => {
  const shots = [
    { made: true, type: "throw", cup_hit: 1 },
    { made: false, type: "bounce", cup_hit: null },
    { made: true, type: "bounce", cup_hit: 2 },
    { made: false, type: "throw", cup_hit: null },
    { made: true, type: "throw", cup_hit: 1 },
  ];

  it("calculates shootingPct", () => {
    expect(shootingPct(shots)).toBeCloseTo(60);
  });

  it("calculates bouncePct", () => {
    expect(bouncePct(shots)).toBeCloseTo(40);
  });

  it("calculates cupHitFreq", () => {
    expect(cupHitFreq(shots)).toEqual({ 1: 2, 2: 1 });
  });
}); 