import React from "react";
import { CheckboxGroup } from "@newamerica/components";
import slugify from "./lib/slugify";

export default class Sidebar extends React.Component {
  state = { expanded: false };

  expandSidebar = e => {
    const { expanded } = this.state;
    this.setState({ expanded: !expanded });
  };

  render() {
    const { expanded } = this.state;
    const { onSampleChange } = this.props;
    return (
      <div className={`dv-Sidebar${expanded ? " expanded" : ""}`}>
        <button className="dv-Sidebar__button" onClick={this.expandSidebar}>
          Filters
        </button>
        <div className="dv-Sidebar__interior">
          <CheckboxGroup
            title="Sample size"
            style={{ paddingBottom: "1rem", borderBottom: "solid 1px #ddd" }}
            options={[
              { checked: true, label: "< 1,000", id: "one" },
              {
                checked: true,
                label: "1,000 - 5,000",
                id: "two"
              },
              { checked: true, label: "> 5,000", id: "three" }
            ]}
            onChange={onSampleChange}
          />
          <CheckboxGroup
            title="Sample Demographics"
            style={{ paddingTop: "1rem" }}
            options={[
              {
                checked: true,
                label: "U.S. Adults",
                id: slugify("U.S. Adults")
              },
              {
                checked: true,
                label: "College Students",
                id: slugify("College Students")
              },
              { checked: true, label: "Faculty", id: slugify("Faculty") },
              {
                checked: true,
                label: "Administrators",
                id: slugify("Administrators")
              }
            ]}
            onChange={e => console.log(e)}
          />
        </div>
      </div>
    );
  }
}
