import { describe, it, expect } from "vitest";
import { estimate, formatPounds } from "./pricing";

describe("price estimator", () => {
  it("Signature Detail + Paint Decontamination + Engine Bay Refresh = £259.97", () => {
    const r = estimate("Signature Detail", ["Paint Decontamination", "Engine Bay Refresh"]);
    expect(formatPounds(r.total)).toBe("£259.97");
    expect(r.lines).toHaveLength(3);
  });
  it("Premium Valet with all add-ons = £199.96", () => {
    expect(formatPounds(estimate("Premium Valet", ["Paint Decontamination", "Deep Interior Extraction", "Engine Bay Refresh"]).total)).toBe("£199.96");
  });
  it("Maintenance Valet alone = £79.99", () => {
    expect(formatPounds(estimate("Maintenance Valet", []).total)).toBe("£79.99");
  });
  it("nothing selected = £0.00", () => {
    expect(estimate("", []).total).toBe(0);
  });
});
