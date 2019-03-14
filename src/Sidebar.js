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
    const { onFilterChange, tags } = this.props;
    return (
      <div className={`dv-Sidebar${expanded ? " expanded" : ""}`}>
        <button className="dv-Sidebar__button" onClick={this.expandSidebar}>
          Filters
        </button>
        <div className="dv-Sidebar__interior">
          <div>
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
              onChange={filterState => onFilterChange("size", filterState)}
              selectButtons={true}
            />
            <CheckboxGroup
              title="Sample Demographics"
              style={{ padding: "1rem 0", borderBottom: "solid 1px #ddd" }}
              options={[
                {
                  checked: true,
                  label: "U.S. Adults",
                  id: "us-adults"
                },
                {
                  checked: true,
                  label: "College Students",
                  id: "college-students"
                },
                { checked: true, label: "Faculty", id: "faculty" },
                {
                  checked: true,
                  label: "Administrators",
                  id: "administrators"
                }
              ]}
              onChange={filterState =>
                onFilterChange("demographics", filterState)
              }
              selectButtons={true}
            />
            <CheckboxGroup
              title="Tags"
              style={{ paddingTop: "1rem" }}
              options={tags.map(tag => ({
                id: tag,
                checked: true,
                label: tag.charAt(0).toUpperCase() + tag.slice(1)
              }))}
              onChange={filterState => onFilterChange("tags", filterState)}
              selectButtons={true}
            />
          </div>
        </div>
      </div>
    );
  }
}
