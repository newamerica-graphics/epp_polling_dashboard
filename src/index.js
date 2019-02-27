import React from "react";
import ReactDOM from "react-dom";
import Dashboard from "./Dashboard";
import "./index.scss";

let queue = [];
let data = null;

const settings = {
  dashboard: el => {
    const _data = data.dashboard;
    ReactDOM.render(<Dashboard data={_data} />, el);
  }
};

fetch(
  "https://na-data-projects.s3.amazonaws.com/data/epp/polling_dashboard.json"
)
  .then(response => response.json())
  .then(_data => {
    data = _data;
    for (let i = 0; i < queue.length; i++) queue[i]();
  });

window.renderDataViz = function(el) {
  let id = el.getAttribute("id");
  let chart = settings[id];
  if (!chart) return;

  if (data) {
    chart(el);
  } else {
    queue.push(() => chart(el));
  }
};
