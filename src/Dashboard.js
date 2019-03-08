import React from "react";
import { ChartContainer, Title } from "@newamerica/meta";
import Sidebar from "./Sidebar";
import { DataTableWithSearch } from "@newamerica/data-table";
import DownloadIcon from "./lib/DownloadIcon";
import formatter from "./lib/descriptionFormat";
import { format } from "d3-format";

const Description = row => {
  return (
    <div className="dv-Dashboard__description">
      <a
        className="dv-Dashboard__download"
        href={row.original["download"] || "#"}
      >
        <DownloadIcon />
        Download
      </a>
      <h3>Top findings directly from the report</h3>
      <div>
        {formatter(row.original["Top findings directly from the report"])}
      </div>
      {Tags(row.original["Tags"])}
    </div>
  );
};

const Tags = text => {
  const tags = text.split(", ");
  return (
    <div className="dv-Dashboard__tags">
      <span className="dv-Dashboard__tag-title">Tags:</span>
      {tags.map(tag => (
        <span className="dv-Dashboard__tag">
          {tag.charAt(0).toUpperCase() + tag.slice(1)}
        </span>
      ))}
    </div>
  );
};

const columns = [
  {
    Header: "",
    expander: true,
    Expander: ({ isExpanded, ...rest }) => (
      <div className={`icon-plus ${isExpanded ? " x" : ""}`}>
        <div />
        <div />
      </div>
    ),
    accessor: "Top findings directly from the report",
    className: "dv-Dashboard__icon"
  },
  {
    Header: "Study Title",
    accessor: "Study Title",
    minWidth: 250,
    sortable: false,
    headerClassName: "not-sortable"
  },
  {
    Header: "Year",
    accessor: "Year"
  },
  {
    Header: "Organization",
    accessor: "Organization",
    minWidth: 200,
    sortable: false,
    headerClassName: "not-sortable"
  },
  {
    Header: "Sample size",
    accessor: "sample_number",
    sortMethod: (a, b, desc) => {
      return +b - +a;
    },
    Cell: ({ value }) => (value ? format(",")(value) : null),
    minWidth: 120
  },
  {
    Header: "Sample demographics",
    accessor: "Sample demographics",
    sortable: false,
    headerClassName: "not-sortable",
    minWidth: 350
  }
];

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: {
        one: true,
        two: true,
        three: true
      },
      demographics: {
        "us-adults": true,
        "college-students": true,
        administrators: true,
        faculty: true
      },
      tags: this.props.data.reduce((acc, cur) => {
        const tags = cur["Tags"].split(", ");
        tags.forEach(tag => {
          if (!acc[tag]) {
            acc[tag] = true;
          }
        });
        return acc;
      }, {})
    };
    this.onFilterChange = this.onFilterChange.bind(this);
  }

  onFilterChange = (name, filter) => {
    console.log(name, filter);
    this.setState({ [name]: filter });
  };
  render() {
    const { size, demographics, tags } = this.state;
    let _data = this.props.data;
    _data = this.props.data
      .filter(val => {
        const num = +val["sample_number"];
        if (size.one && size.two && size.three) {
          return true;
        }
        if (size.one && size.two) {
          return num <= 5000;
        }
        if (size.two && size.three) {
          return num >= 1000;
        }
        if (size.one && size.three) {
          return num <= 1000 || num >= 5000;
        }
        if (size.one) {
          return num <= 1000;
        }
        if (size.two) {
          return num >= 1000 && num <= 5000;
        }
        if (size.three) {
          return num >= 5000;
        }
        return false;
      })
      .filter(val => {
        const demo = val["demographics_key"];
        if (demographics[demo]) {
          return true;
        } else {
          return false;
        }
      })
      .filter(val => {
        const tagString = val["Tags"];
        if (
          Object.keys(tags).some(key => tags[key] && tagString.includes(key))
        ) {
          return true;
        } else {
          return false;
        }
      });
    return (
      <ChartContainer>
        <div className="dv-Dashboard__content">
          <Sidebar
            onFilterChange={this.onFilterChange}
            tags={Object.keys(tags)}
          />
          <DataTableWithSearch
            columns={columns}
            data={_data}
            SubComponent={Description}
            defaultPageSize={10}
          />
        </div>
      </ChartContainer>
    );
  }
}
