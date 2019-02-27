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
      <h3>Top findings directly from the report</h3>
      <div>
        {formatter(row.original["Top findings directly from the report"])}
      </div>
    </div>
  );
};

const Tags = ({ text }) => {
  const tags = text.split(", ");
  return (
    <span className="dv-Dashboard__tags">
      {tags.map(tag => (
        <span className="dv-Dashboard__tag">
          {tag.charAt(0).toUpperCase() + tag.slice(1)}
        </span>
      ))}
    </span>
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
    accessor: "Sample size",
    sortMethod: (a, b, desc) => {
      const first = parseInt(a.replace(","));
      const second = parseInt(b.replace(","));

      if (typeof first === "number" && typeof second === "number") {
        return second - first;
      }
    }
  },
  {
    Header: "Sample size (number column)",
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
  },
  {
    Header: "Download",
    Cell: () => <DownloadIcon />,
    className: "dv-Dashboard__icon",
    sortable: false,
    headerClassName: "not-sortable",
    minWidth: 120
  },
  {
    Header: "Tags",
    accessor: "Tags",
    minWidth: 300,
    sortable: false,
    headerClassName: "not-sortable",
    Cell: ({ value }) => (value ? <Tags text={value} /> : null)
  }
];

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.originalData = this.props.data;
    this.state = {
      data: this.originalData
    };
    this.onSampleChange = this.onSampleChange.bind(this);
  }

  onSampleChange = filter => {
    this.setState({ sampleFilter: filter });
  };
  render() {
    const { data, sampleFilter } = this.state;
    let _data = this.props.data;
    if (sampleFilter) {
      _data = this.props.data.filter(val => {
        const num = +val["sample_number"];
        if (sampleFilter.one && sampleFilter.two && sampleFilter.three) {
          return true;
        }
        if (sampleFilter.one && sampleFilter.two) {
          return num <= 5000;
        }
        if (sampleFilter.two && sampleFilter.three) {
          return num >= 1000;
        }
        if (sampleFilter.one && sampleFilter.three) {
          return num <= 1000 || num >= 5000;
        }
        if (sampleFilter.one) {
          return num <= 1000;
        }
        if (sampleFilter.two) {
          return num >= 1000 && num <= 5000;
        }
        if (sampleFilter.three) {
          return num >= 5000;
        }
        return false;
      });
    }
    return (
      <ChartContainer>
        <div className="dv-Dashboard__content">
          <Sidebar onSampleChange={this.onSampleChange} />
          <Title className="dv-Dashboard__title">This is a title</Title>
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
