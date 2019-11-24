import * as React from "react";
import * as renderer from "react-test-renderer";

import { Summary } from "./summary";
import { IEventFields } from ".";

describe("events/<Summary />", () => {
  it("renders a basic event", () => {
    const props: IEventFields = {
      frontmatter: {
        contentType: "event",
        date: "2019-01-01",
        title: "Test Event"
      },
      html: "<h1>Test Event HTML</h1>"
    };

    const rendered = renderer.create(<Summary {...props} />).toJSON();

    expect(rendered).toMatchInlineSnapshot(`
      <div
        className="card card-body border-danger"
      >
        <a
          aria-controls="EventSummary-1546322400000"
          aria-expanded="true"
          data-target="#EventSummary-1546322400000"
          data-toggle="collapse"
        >
          <div
            className="card-header"
          >
            <span
              className="date"
            >
              2019-01-01
            </span>
            <h4>
              Test Event
            </h4>
          </div>
        </a>
        <div
          className="collapse show"
          id="EventSummary-1546322400000"
        >
          <div
            className="card-body"
          >
            <span
              className="markdown"
              dangerouslySetInnerHTML={
                Object {
                  "__html": "<h1>Test Event HTML</h1>",
                }
              }
            />
          </div>
        </div>
      </div>
    `);
  });
});
