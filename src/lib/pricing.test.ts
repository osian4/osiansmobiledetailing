import { describe, it, expect } from "vitest";
import { estimate, formatPounds } from "./pricing";

describe("price estimator", () => {
  it("Signature Detail + Paint Decontamination + Engine Bay Refresh = £259.97", () => {
    const r = estimate("Signature Detail", ["Paint Decontamination", "Engine Bay Refresh"]);
    expect(formatPounds(r.total)).toBe("£259.97");
    expect(r.lines).toHaveLength(3);
  });
  it("Interior Detail with all add-ons = £239.96", () => {
    expect(formatPounds(estimate("Interior Detail", ["Paint Decontamination", "Deep Interior Extraction", "Engine Bay Refresh"]).total)).toBe("£239.96");
  });
  it("Exterior Detail alone = £79.99", () => {
    expect(formatPounds(estimate("Exterior Detail", []).total)).toBe("£79.99");
  });
  it("nothing selected = £0.00", () => {
    expect(estimate("", []).total).toBe(0);
  });
});
