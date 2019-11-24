import * as React from "react";
import * as renderer from "react-test-renderer";

import { Author } from "./index";

describe("<Author/>", () => {
  it("renders author info", () => {
    const rendered = renderer
      .create(<Author name="Test Testerson" gravatar="abcd1234" />)
      .toJSON();

    expect(rendered).toMatchInlineSnapshot(`
      <div
        className="author"
      >
        <img
          src="https://www.gravatar.com/avatar/abcd1234"
        />
        <span
          className="name"
        >
          Test Testerson
        </span>
      </div>
    `);
  });
});
