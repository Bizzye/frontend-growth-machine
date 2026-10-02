import { render, screen } from "@testing-library/react";

import { Input } from "@/components/ui/input";

describe("<Input />", () => {
  it("associates the label with the input", () => {
    render(<Input id="email" label="E-mail" />);

    const input = screen.getByLabelText("E-mail");
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveAttribute("aria-invalid", "false");
    expect(input).not.toHaveAttribute("aria-describedby");
  });

  it("exposes the error message to assistive technologies", () => {
    render(<Input id="email" label="E-mail" error="Invalid e-mail" />);

    const input = screen.getByLabelText("E-mail");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Invalid e-mail");
  });
});
