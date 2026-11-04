import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { QrGenerator } from "./QrGenerator";

vi.mock("qr-code-styling", () => ({
  default: class {
    getRawData() { return Promise.resolve(new Blob(["qr"])); }
    append(container: HTMLElement) { container.append(document.createElementNS("http://www.w3.org/2000/svg", "svg")); }
  },
}));

afterEach(cleanup);

describe("QR generation", () => {
  it("does not generate an unrelated QR for empty content", () => {
    render(<QrGenerator />);
    expect(screen.getByRole("button", { name: "PNG", exact: true })).toBeDisabled();
    expect(screen.getByLabelText("QR code preview").childElementCount).toBe(0);
  });

  it("enables downloads after entered content generates, then disables them when cleared", async () => {
    render(<QrGenerator />);
    const input = screen.getByPlaceholderText("instagram.com/yourname");
    fireEvent.change(input, { target: { value: "https://example.com/working-qr" } });
    await waitFor(() => expect(screen.getByRole("button", { name: "PNG", exact: true })).toBeEnabled());
    expect(screen.getByLabelText("QR code preview").childElementCount).toBe(1);
    fireEvent.change(input, { target: { value: "" } });
    await waitFor(() => expect(screen.getByRole("button", { name: "PNG", exact: true })).toBeDisabled());
    expect(screen.getByLabelText("QR code preview").childElementCount).toBe(0);
  });
});