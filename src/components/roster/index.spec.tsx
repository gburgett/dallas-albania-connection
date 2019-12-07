import * as React from "react";
import * as renderer from "react-test-renderer";

import { TeamRoster, ITeamRosterProps, ICollatedSmappData } from "./index";

describe("<TeamRoster/>", () => {
  let baseProps: ITeamRosterProps;
  beforeEach(() => {
    baseProps = {
      name: "test",
      goal: "3000",
      mileMarker: "1700",
      adjustment: "200",
      members: []
    };
  });

  it("renders with empty roster", () => {
    const rendered = renderer.create(<TeamRoster {...baseProps} />).toJSON();

    expect(rendered).toMatchInlineSnapshot(`
      <div
        className="teamRoster"
      >
        <h4>
          test
        </h4>
        <ul />
      </div>
    `);
  });

  it("renders a roster member", () => {
    baseProps.members.push({
      name: "Some Person",
      cruId: "1234",
      goal: undefined,
      adjustment: undefined
    });

    const rendered = renderer.create(<TeamRoster {...baseProps} />).toJSON();

    expect(rendered).toMatchInlineSnapshot(`
      <div
        className="teamRoster"
      >
        <h4>
          test
        </h4>
        <ul>
          <li>
            <div
              className="member"
            >
              <span
                className="memberName d-none d-sm-flex"
              >
                <span
                  className="name"
                >
                  Some Person
                </span>
                <span
                  className="amt"
                >
                  $
                  200
                   of $
                  3,000
                </span>
                <span
                  className="cruId"
                >
                  1234
                </span>
                <a
                  className="donate btn btn-sm btn-info"
                  href="https://give.cru.org/1234"
                >
                  <span>
                    <i
                      className="fas fa-gift"
                    />
                      Donate!
                  </span>
                </a>
              </span>
              <span
                className="memberName d-block d-sm-none"
              >
                <a
                  className="donate btn btn-sm btn-info"
                  href="https://give.cru.org/1234"
                  style={
                    Object {
                      "width": "100%",
                    }
                  }
                >
                  <span>
                    <i
                      className="fas fa-gift"
                    />
                     
                    Some Person
                     #
                    1234
                  </span>
                </a>
              </span>
              <div
                className="progress"
              >
                <div
                  aria-valuemax={3000}
                  aria-valuemin={0}
                  aria-valuenow={200}
                  className="progress-bar progress-bar-striped progress-bar-animated bg-info"
                  role="progressbar"
                  style={
                    Object {
                      "width": "6.666666666666667%",
                    }
                  }
                />
              </div>
            </div>
          </li>
        </ul>
      </div>
    `);
  });

  it("renders a roster member with cru data", () => {
    baseProps.members.push({
      name: "Some Person",
      cruId: "1234",
      goal: undefined,
      adjustment: undefined
    });
    const data: ICollatedSmappData = {
      "1234": 752.13
    };

    const rendered = renderer
      .create(<TeamRoster {...baseProps} data={data} />)
      .toJSON();

    expect(rendered).toMatchInlineSnapshot(`
      <div
        className="teamRoster"
      >
        <h4>
          test
        </h4>
        <ul>
          <li>
            <div
              className="member"
            >
              <span
                className="memberName d-none d-sm-flex"
              >
                <span
                  className="name"
                >
                  Some Person
                </span>
                <span
                  className="amt"
                >
                  $
                  952.13
                   of $
                  3,000
                </span>
                <span
                  className="cruId"
                >
                  1234
                </span>
                <a
                  className="donate btn btn-sm btn-info"
                  href="https://give.cru.org/1234"
                >
                  <span>
                    <i
                      className="fas fa-gift"
                    />
                      Donate!
                  </span>
                </a>
              </span>
              <span
                className="memberName d-block d-sm-none"
              >
                <a
                  className="donate btn btn-sm btn-info"
                  href="https://give.cru.org/1234"
                  style={
                    Object {
                      "width": "100%",
                    }
                  }
                >
                  <span>
                    <i
                      className="fas fa-gift"
                    />
                     
                    Some Person
                     #
                    1234
                  </span>
                </a>
              </span>
              <div
                className="progress"
              >
                <div
                  aria-valuemax={3000}
                  aria-valuemin={0}
                  aria-valuenow={952.13}
                  className="progress-bar progress-bar-striped progress-bar-animated bg-info"
                  role="progressbar"
                  style={
                    Object {
                      "width": "31.737666666666662%",
                    }
                  }
                />
              </div>
            </div>
          </li>
        </ul>
      </div>
    `);
  });
});
